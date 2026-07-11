import { z } from "zod";

export const ClaimRecordSchema = z.object({
  claim_id: z.string(),
  claim_text: z.string().min(1),
  context: z.string().optional(),
});

export const SourceRecordSchema = z.object({
  source_id: z.string(),
  url: z.string().url().optional(),
  title: z.string(),
  content: z.string(),
  source_type: z.enum(["academic", "news", "government", "industry", "blog", "social", "other"]),
});

export const VerificationTaskSchema = z.object({
  task_id: z.string().uuid(),
  requester_id: z.string(),
  claims: z.array(ClaimRecordSchema).min(1),
  sources: z.array(SourceRecordSchema).optional().default([]),
  text_summary: z.string().optional(),
  raw_notes: z.string().optional(),
  pricing_tier: z.enum(["quick", "deep", "bundle"]),
  created_at: z.string().datetime(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
});

export const EvidenceLinkSchema = z.object({
  source_id: z.string(),
  relevance_score: z.number().min(0).max(1),
  supports_claim: z.boolean(),
  excerpt: z.string().optional(),
});

export const ClaimVerdictSchema = z.object({
  claim_id: z.string(),
  claim_text: z.string(),
  verdict: z.enum(["supported", "partially_supported", "unsupported", "contradicted", "unverifiable"]),
  supporting_sources: z.array(EvidenceLinkSchema),
  conflicting_sources: z.array(EvidenceLinkSchema),
  evidence_strength: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  revision_suggestion: z.string().optional(),
});

export const TrustReportSchema = z.object({
  report_id: z.string().uuid(),
  task_id: z.string().uuid(),
  claim_verdicts: z.array(ClaimVerdictSchema),
  overall_trust_score: z.number().min(0).max(1),
  overall_report_summary: z.string(),
  citation_presence_score: z.number().min(0).max(1),
  source_relevance_score: z.number().min(0).max(1),
  contradiction_risk: z.number().min(0).max(1),
  unsupported_ratio: z.number().min(0).max(1),
  completed_at: z.string().datetime(),
});

export const PricingTierSchema = z.object({
  tier_id: z.enum(["quick", "deep", "bundle"]),
  name: z.string(),
  description: z.string(),
  price_usdc: z.number().positive(),
  max_claims: z.number().positive(),
  includes_source_analysis: z.boolean(),
  includes_contradiction_detection: z.boolean(),
  turnaround_seconds: z.number().positive(),
});

export const CapInvocationSchema = z.object({
  invocation_id: z.string().uuid(),
  task_id: z.string().uuid(),
  provider_agent_id: z.string(),
  requester_agent_id: z.string(),
  service_name: z.string(),
  price_usdc: z.number().positive(),
  status: z.enum(["initiated", "escrowed", "completed", "failed", "refunded"]),
  created_at: z.string().datetime(),
  settled_at: z.string().datetime().optional(),
});

export const SettlementRecordSchema = z.object({
  settlement_id: z.string().uuid(),
  invocation_id: z.string().uuid(),
  tx_hash: z.string().optional(),
  amount_usdc: z.number().positive(),
  from_address: z.string(),
  to_address: z.string(),
  chain: z.string().default("base"),
  status: z.enum(["pending", "confirmed", "failed"]),
  timestamp: z.string().datetime(),
});

export const DownstreamAgentActionSchema = z.object({
  action_id: z.string().uuid(),
  report_id: z.string().uuid(),
  agent_name: z.string(),
  agent_type: z.string(),
  action_taken: z.enum(["proceed", "revise", "reject", "flag"]),
  reasoning: z.string(),
  timestamp: z.string().datetime(),
});

export type ClaimRecord = z.infer<typeof ClaimRecordSchema>;
export type SourceRecord = z.infer<typeof SourceRecordSchema>;
export type VerificationTask = z.infer<typeof VerificationTaskSchema>;
export type ClaimVerdict = z.infer<typeof ClaimVerdictSchema>;
export type EvidenceLink = z.infer<typeof EvidenceLinkSchema>;
export type TrustReport = z.infer<typeof TrustReportSchema>;
export type PricingTier = z.infer<typeof PricingTierSchema>;
export type CapInvocation = z.infer<typeof CapInvocationSchema>;
export type SettlementRecord = z.infer<typeof SettlementRecordSchema>;
export type DownstreamAgentAction = z.infer<typeof DownstreamAgentActionSchema>;
