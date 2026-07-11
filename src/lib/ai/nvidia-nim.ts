import { ClaimRecord, SourceRecord, ClaimVerdict } from "@/lib/schemas";

const NIM_API_URL = process.env.NVIDIA_NIM_API_URL || "https://integrate.api.nvidia.com/v1";
const NIM_API_KEY = process.env.NVIDIA_NIM_API_KEY || "";
const NIM_MODEL = process.env.NVIDIA_NIM_MODEL || "meta/llama-3.3-70b-instruct";

interface NimChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface NimChatResponse {
  choices: {
    message: { content: string };
    finish_reason: string;
  }[];
}

async function callNim(messages: NimChatMessage[]): Promise<string> {
  const res = await fetch(`${NIM_API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${NIM_API_KEY}`,
    },
    body: JSON.stringify({
      model: NIM_MODEL,
      messages,
      temperature: 0.1,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    throw new Error(`NIM API error: ${res.status} ${res.statusText}`);
  }

  const data: NimChatResponse = await res.json();
  return data.choices[0].message.content;
}

function parseJsonResponse<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Attempt to extract JSON from markdown code block
    const match = raw.match(/```(?:json)?\n?([\s\S]*?)```/);
    if (match) {
      try {
        return JSON.parse(match[1]) as T;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
}

interface VerdictInput {
  claim: ClaimRecord;
  sources: SourceRecord[];
}

interface VerdictOutput {
  verdict: "supported" | "partially_supported" | "unsupported" | "contradicted" | "unverifiable";
  supporting_sources: { source_id: string; relevance_score: number; supports_claim: boolean; excerpt: string }[];
  conflicting_sources: { source_id: string; relevance_score: number; supports_claim: boolean; excerpt: string }[];
  evidence_strength: number;
  confidence: number;
  reasoning: string;
  revision_suggestion: string;
}

export async function analyzeClaim({ claim, sources }: VerdictInput): Promise<VerdictOutput> {
  const systemPrompt = `You are a rigorous fact-verification engine. Analyze the claim against provided sources.
Return ONLY valid JSON with this exact schema:
{
  "verdict": "supported" | "partially_supported" | "unsupported" | "contradicted" | "unverifiable",
  "supporting_sources": [{ "source_id": "string", "relevance_score": 0-1, "supports_claim": true, "excerpt": "string" }],
  "conflicting_sources": [{ "source_id": "string", "relevance_score": 0-1, "supports_claim": false, "excerpt": "string" }],
  "evidence_strength": 0-1,
  "confidence": 0-1,
  "reasoning": "string (2-3 sentences)",
  "revision_suggestion": "string or empty if supported"
}

Rules:
- Be strict: unsupported claims must be flagged.
- Low confidence means insufficient evidence, not uncertainty.
- Always return source_ids from the provided list.
- Keep reasoning concise and factual.`;

  const sourceContext = sources.length > 0
    ? sources.map((s, i) => `[SOURCE ${s.source_id}] (${s.source_type}): ${s.title}\n${s.content.substring(0, 1000)}`).join("\n\n")
    : "No sources provided.";

  const userPrompt = `CLAIM: "${claim.claim_text}"\n${claim.context ? `CONTEXT: ${claim.context}\n` : ""}\nSOURCES:\n${sourceContext}`;

  const fallback: VerdictOutput = {
    verdict: "unverifiable",
    supporting_sources: [],
    conflicting_sources: [],
    evidence_strength: 0,
    confidence: 0,
    reasoning: "Unable to analyze claim due to processing error.",
    revision_suggestion: "Please re-submit with sources.",
  };

  try {
    const raw = await callNim([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
    return parseJsonResponse<VerdictOutput>(raw, fallback);
  } catch (error) {
    console.error("NIM analysis failed, retrying once...", error);
    try {
      const raw = await callNim([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);
      return parseJsonResponse<VerdictOutput>(raw, fallback);
    } catch {
      return fallback;
    }
  }
}

export async function generateReportSummary(verdicts: { claim_text: string; verdict: string; reasoning: string }[]): Promise<string> {
  const systemPrompt = `You are a trust report summarizer. Generate a concise 2-3 sentence executive summary of the verification results. Focus on overall trustworthiness and key findings. Return ONLY the summary text, no JSON.`;

  const userPrompt = `Verification results:\n${verdicts.map((v, i) => `${i + 1}. "${v.claim_text}" → ${v.verdict} (${v.reasoning})`).join("\n")}`;

  try {
    const raw = await callNim([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
    return raw.trim();
  } catch {
    return "Verification completed. Review individual claim verdicts for details.";
  }
}

export async function answerSourceQuestion(
  question: string,
  reportSummary: string,
  verdicts: { claim_text: string; verdict: string; reasoning: string }[]
): Promise<string> {
  const systemPrompt = `You are SourceBouncer's Q&A assistant. Answer questions about verification results using ONLY the provided report data. Be concise and specific. Do not hallucinate information not in the data.`;

  const userPrompt = `REPORT SUMMARY: ${reportSummary}\n\nCLAIM VERDICTS:\n${verdicts.map((v, i) => `${i + 1}. "${v.claim_text}" → ${v.verdict}: ${v.reasoning}`).join("\n")}\n\nQUESTION: ${question}`;

  try {
    const raw = await callNim([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
    return raw.trim();
  } catch {
    return "I'm unable to answer that question right now. Please try again.";
  }
}
