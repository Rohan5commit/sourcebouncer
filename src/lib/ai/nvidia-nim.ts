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

async function callNim(messages: NimChatMessage[], timeoutMs = 15000): Promise<string> {
  if (!NIM_API_KEY) {
    throw new Error("NVIDIA NIM API key not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
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
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`NIM API error: ${res.status} ${res.statusText}`);
    }

    const data: NimChatResponse = await res.json();
    return data.choices[0].message.content;
  } finally {
    clearTimeout(timeout);
  }
}

function parseJsonResponse<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
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

/**
 * Rule-based fallback analysis when NIM API is unavailable.
 * Uses keyword matching and source comparison for basic verification.
 */
function ruleBasedAnalysis({ claim, sources }: VerdictInput): VerdictOutput {
  const claimLower = claim.claim_text.toLowerCase();
  const claimWords = claimLower.split(/\s+/).filter(w => w.length > 3);

  // Analyze each source against the claim
  const supporting: VerdictOutput["supporting_sources"] = [];
  const conflicting: VerdictOutput["conflicting_sources"] = [];

  for (const source of sources) {
    const sourceLower = source.content.toLowerCase() + " " + source.title.toLowerCase();
    const matchedWords = claimWords.filter(w => sourceLower.includes(w));
    const relevance = matchedWords.length / Math.max(claimWords.length, 1);

    if (relevance < 0.2) continue;

    // Simple negation detection
    const negationPatterns = ["not", "never", "no ", "false", "incorrect", "wrong", "contrary", "opposite", "refutes", "disproves", "debunked", "myth"];
    const hasNegation = negationPatterns.some(p => {
      // Check if negation appears near claim words
      const idx = sourceLower.indexOf(p);
      if (idx === -1) return false;
      // Check context window around negation
      const window = sourceLower.substring(Math.max(0, idx - 50), idx + 50);
      return claimWords.some(w => window.includes(w));
    });

    if (hasNegation) {
      conflicting.push({
        source_id: source.source_id,
        relevance_score: Math.min(relevance + 0.3, 1.0),
        supports_claim: false,
        excerpt: source.content.substring(0, 200),
      });
    } else {
      supporting.push({
        source_id: source.source_id,
        relevance_score: Math.min(relevance + 0.3, 1.0),
        supports_claim: true,
        excerpt: source.content.substring(0, 200),
      });
    }
  }

  // Determine verdict based on evidence
  let verdict: VerdictOutput["verdict"];
  let evidenceStrength: number;
  let confidence: number;

  if (supporting.length > 0 && conflicting.length === 0) {
    verdict = "supported";
    evidenceStrength = Math.min(0.6 + supporting.length * 0.1, 0.9);
    confidence = 0.6;
  } else if (conflicting.length > 0 && supporting.length === 0) {
    verdict = "contradicted";
    evidenceStrength = Math.min(0.6 + conflicting.length * 0.1, 0.9);
    confidence = 0.6;
  } else if (supporting.length > 0 && conflicting.length > 0) {
    verdict = "partially_supported";
    evidenceStrength = 0.5;
    confidence = 0.4;
  } else if (sources.length === 0) {
    verdict = "unverifiable";
    evidenceStrength = 0;
    confidence = 0.1;
  } else {
    verdict = "unsupported";
    evidenceStrength = 0.2;
    confidence = 0.3;
  }

  return {
    verdict,
    supporting_sources: supporting,
    conflicting_sources: conflicting,
    evidence_strength: evidenceStrength,
    confidence,
    reasoning: `Rule-based analysis: ${supporting.length} source(s) support, ${conflicting.length} conflict. Confidence is moderate — API-based analysis was unavailable.`,
    revision_suggestion: verdict === "contradicted"
      ? "This claim conflicts with provided sources. Consider revising or removing it."
      : verdict === "unsupported"
      ? "No supporting sources found. Add evidence or revise the claim."
      : "",
  };
}

export async function analyzeClaim({ claim, sources }: VerdictInput): Promise<VerdictOutput> {
  const fallback: VerdictOutput = {
    verdict: "unverifiable",
    supporting_sources: [],
    conflicting_sources: [],
    evidence_strength: 0,
    confidence: 0,
    reasoning: "Unable to analyze claim due to processing error.",
    revision_suggestion: "Please re-submit with sources.",
  };

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

  try {
    const raw = await callNim([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
    return parseJsonResponse<VerdictOutput>(raw, fallback);
  } catch (error) {
    console.warn("NIM API unavailable, using rule-based fallback:", (error as Error).message);
    // Use smart rule-based fallback instead of returning empty results
    return ruleBasedAnalysis({ claim, sources });
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
    // Generate summary from verdicts directly
    const supported = verdicts.filter(v => v.verdict === "supported").length;
    const contradicted = verdicts.filter(v => v.verdict === "contradicted").length;
    const unsupported = verdicts.filter(v => v.verdict === "unsupported").length;
    const total = verdicts.length;

    const parts = [];
    if (supported > 0) parts.push(`${supported} of ${total} claims are supported by evidence`);
    if (contradicted > 0) parts.push(`${contradicted} claim(s) are contradicted by sources`);
    if (unsupported > 0) parts.push(`${unsupported} claim(s) lack supporting evidence`);

    return parts.length > 0
      ? `Verification complete: ${parts.join("; ")}. Review individual claim verdicts for detailed analysis.`
      : "Verification completed. Review individual claim verdicts for details.";
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
    // Simple keyword-based Q&A fallback
    const qLower = question.toLowerCase();
    if (qLower.includes("summary") || qLower.includes("overall")) {
      return reportSummary;
    }
    if (qLower.includes("contradict") || qLower.includes("false") || qLower.includes("wrong")) {
      const contradicted = verdicts.filter(v => v.verdict === "contradicted");
      if (contradicted.length > 0) {
        return contradicted.map(v => `"${v.claim_text}" — ${v.reasoning}`).join("\n");
      }
      return "No contradicted claims found in the verification results.";
    }
    if (qLower.includes("support") || qLower.includes("true") || qLower.includes("correct")) {
      const supported = verdicts.filter(v => v.verdict === "supported");
      if (supported.length > 0) {
        return supported.map(v => `"${v.claim_text}" — ${v.reasoning}`).join("\n");
      }
      return "No supported claims found in the verification results.";
    }
    return `I can answer questions about the ${verdicts.length} verified claims. Try asking about supported, contradicted, or unsupported claims, or ask for the overall summary.`;
  }
}
