import { describe, it, expect } from "vitest";
import {
  VerificationTaskSchema,
  ClaimVerdictSchema,
  TrustReportSchema,
  PricingTierSchema,
  CapInvocationSchema,
} from "@/lib/schemas";

describe("VerificationTaskSchema", () => {
  it("validates a correct task", () => {
    const result = VerificationTaskSchema.safeParse({
      task_id: "550e8400-e29b-41d4-a716-446655440000",
      requester_id: "agent-001",
      claims: [{ claim_id: "c1", claim_text: "Test claim" }],
      pricing_tier: "quick",
      created_at: "2026-01-01T00:00:00.000Z",
      status: "pending",
    });
    expect(result.success).toBe(true);
  });

  it("rejects task with no claims", () => {
    const result = VerificationTaskSchema.safeParse({
      task_id: "550e8400-e29b-41d4-a716-446655440000",
      requester_id: "agent-001",
      claims: [],
      pricing_tier: "quick",
      created_at: "2026-01-01T00:00:00.000Z",
      status: "pending",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid pricing tier", () => {
    const result = VerificationTaskSchema.safeParse({
      task_id: "550e8400-e29b-41d4-a716-446655440000",
      requester_id: "agent-001",
      claims: [{ claim_id: "c1", claim_text: "Test claim" }],
      pricing_tier: "invalid",
      created_at: "2026-01-01T00:00:00.000Z",
      status: "pending",
    });
    expect(result.success).toBe(false);
  });
});

describe("ClaimVerdictSchema", () => {
  it("validates a supported verdict", () => {
    const result = ClaimVerdictSchema.safeParse({
      claim_id: "c1",
      claim_text: "Test",
      verdict: "supported",
      supporting_sources: [],
      conflicting_sources: [],
      evidence_strength: 0.9,
      confidence: 0.85,
      reasoning: "Good evidence.",
    });
    expect(result.success).toBe(true);
  });

  it("validates a contradicted verdict with revision suggestion", () => {
    const result = ClaimVerdictSchema.safeParse({
      claim_id: "c1",
      claim_text: "False claim",
      verdict: "contradicted",
      supporting_sources: [],
      conflicting_sources: [{ source_id: "s1", relevance_score: 0.95, supports_claim: false }],
      evidence_strength: 0.95,
      confidence: 0.95,
      reasoning: "Contradicted by evidence.",
      revision_suggestion: "Remove this claim.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid verdict", () => {
    const result = ClaimVerdictSchema.safeParse({
      claim_id: "c1",
      claim_text: "Test",
      verdict: "maybe",
      supporting_sources: [],
      conflicting_sources: [],
      evidence_strength: 0.5,
      confidence: 0.5,
      reasoning: "Unclear.",
    });
    expect(result.success).toBe(false);
  });
});

describe("TrustReportSchema", () => {
  it("validates a complete report", () => {
    const result = TrustReportSchema.safeParse({
      report_id: "550e8400-e29b-41d4-a716-446655440000",
      task_id: "550e8400-e29b-41d4-a716-446655440001",
      claim_verdicts: [],
      overall_trust_score: 0.85,
      overall_report_summary: "All claims verified.",
      citation_presence_score: 0.9,
      source_relevance_score: 0.88,
      contradiction_risk: 0.1,
      unsupported_ratio: 0.05,
      completed_at: "2026-01-01T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });
});

describe("PricingTierSchema", () => {
  it("validates quick tier", () => {
    const result = PricingTierSchema.safeParse({
      tier_id: "quick",
      name: "Quick",
      description: "Fast verification",
      price_usdc: 0.5,
      max_claims: 5,
      includes_source_analysis: true,
      includes_contradiction_detection: false,
      turnaround_seconds: 30,
    });
    expect(result.success).toBe(true);
  });
});
