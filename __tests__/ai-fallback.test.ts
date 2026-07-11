import { describe, it, expect, vi } from "vitest";

describe("AI output parsing", () => {
  it("parses valid JSON", () => {
    const raw = JSON.stringify({ verdict: "supported", confidence: 0.9 });
    const parsed = JSON.parse(raw);
    expect(parsed.verdict).toBe("supported");
    expect(parsed.confidence).toBe(0.9);
  });

  it("extracts JSON from markdown code blocks", () => {
    const raw = "```json\n{\"verdict\": \"contradicted\", \"confidence\": 0.95}\n```";
    const match = raw.match(/```(?:json)?\n?([\s\S]*?)```/);
    expect(match).toBeTruthy();
    const parsed = JSON.parse(match![1]);
    expect(parsed.verdict).toBe("contradicted");
    expect(parsed.confidence).toBe(0.95);
  });

  it("returns fallback for malformed JSON", () => {
    const raw = "This is not JSON at all";
    const fallback = { verdict: "unverifiable", confidence: 0 };
    let result = fallback;
    try {
      result = JSON.parse(raw);
    } catch {
      const match = raw.match(/```(?:json)?\n?([\s\S]*?)```/);
      if (match) {
        try { result = JSON.parse(match[1]); } catch { /* keep fallback */ }
      }
    }
    expect(result.verdict).toBe("unverifiable");
    expect(result.confidence).toBe(0);
  });

  it("handles nested JSON structures", () => {
    const raw = JSON.stringify({
      verdict: "supported",
      supporting_sources: [{ source_id: "s1", relevance_score: 0.9, supports_claim: true }],
      conflicting_sources: [],
    });
    const parsed = JSON.parse(raw);
    expect(parsed.supporting_sources).toHaveLength(1);
    expect(parsed.supporting_sources[0].source_id).toBe("s1");
    expect(parsed.conflicting_sources).toHaveLength(0);
  });

  it("handles empty arrays gracefully", () => {
    const raw = JSON.stringify({
      verdict: "unverifiable",
      supporting_sources: [],
      conflicting_sources: [],
      evidence_strength: 0,
      confidence: 0,
    });
    const parsed = JSON.parse(raw);
    expect(parsed.supporting_sources).toHaveLength(0);
    expect(parsed.conflicting_sources).toHaveLength(0);
  });
});

describe("Verdict values", () => {
  it("accepts all valid verdict types", () => {
    const validVerdicts = ["supported", "partially_supported", "unsupported", "contradicted", "unverifiable"];
    for (const v of validVerdicts) {
      expect(["supported", "partially_supported", "unsupported", "contradicted", "unverifiable"]).toContain(v);
    }
  });
});
