import { v4 as uuidv4 } from "uuid";
import {
  VerificationTask,
  TrustReport,
  ClaimVerdict,
  ClaimRecord,
  SourceRecord,
} from "@/lib/schemas";
import { analyzeClaim, generateReportSummary } from "@/lib/ai/nvidia-nim";

export async function runVerification(task: VerificationTask): Promise<TrustReport> {
  const sources = task.sources || [];

  // Analyze ALL claims in parallel for speed
  const verdictOutputs = await Promise.all(
    task.claims.map((claim) => analyzeClaim({ claim, sources }))
  );

  const verdicts: ClaimVerdict[] = task.claims.map((claim, idx) => {
    const verdictOutput = verdictOutputs[idx];
    return {
      claim_id: claim.claim_id,
      claim_text: claim.claim_text,
      verdict: verdictOutput.verdict,
      supporting_sources: verdictOutput.supporting_sources.map((s) => ({
        source_id: s.source_id,
        relevance_score: s.relevance_score,
        supports_claim: s.supports_claim,
        excerpt: s.excerpt,
      })),
      conflicting_sources: verdictOutput.conflicting_sources.map((s) => ({
        source_id: s.source_id,
        relevance_score: s.relevance_score,
        supports_claim: s.supports_claim,
        excerpt: s.excerpt,
      })),
      evidence_strength: verdictOutput.evidence_strength,
      confidence: verdictOutput.confidence,
      reasoning: verdictOutput.reasoning,
      revision_suggestion: verdictOutput.revision_suggestion,
    };
  });

  // Calculate aggregate scores
  const totalClaims = verdicts.length;
  const supportedCount = verdicts.filter((v) => v.verdict === "supported").length;
  const partiallySupportedCount = verdicts.filter((v) => v.verdict === "partially_supported").length;
  const unsupportedCount = verdicts.filter((v) => v.verdict === "unsupported").length;
  const contradictedCount = verdicts.filter((v) => v.verdict === "contradicted").length;
  const unverifiableCount = verdicts.filter((v) => v.verdict === "unverifiable").length;

  const overallTrustScore = totalClaims > 0
    ? (supportedCount * 1.0 + partiallySupportedCount * 0.5 + unverifiableCount * 0.3) / totalClaims
    : 0;

  const citationPresenceScore = totalClaims > 0
    ? verdicts.filter((v) => v.supporting_sources.length > 0 || v.conflicting_sources.length > 0).length / totalClaims
    : 0;

  const sourceRelevanceScore = totalClaims > 0
    ? verdicts.reduce((acc, v) => {
        const allSources = [...v.supporting_sources, ...v.conflicting_sources];
        return acc + (allSources.length > 0 ? allSources.reduce((a, s) => a + s.relevance_score, 0) / allSources.length : 0);
      }, 0) / totalClaims
    : 0;

  const contradictionRisk = totalClaims > 0 ? contradictedCount / totalClaims : 0;
  const unsupportedRatio = totalClaims > 0 ? unsupportedCount / totalClaims : 0;

  // Generate summary
  const summary = await generateReportSummary(
    verdicts.map((v) => ({ claim_text: v.claim_text, verdict: v.verdict, reasoning: v.reasoning }))
  );

  return {
    report_id: uuidv4(),
    task_id: task.task_id,
    claim_verdicts: verdicts,
    overall_trust_score: Math.round(overallTrustScore * 100) / 100,
    overall_report_summary: summary,
    citation_presence_score: Math.round(citationPresenceScore * 100) / 100,
    source_relevance_score: Math.round(sourceRelevanceScore * 100) / 100,
    contradiction_risk: Math.round(contradictionRisk * 100) / 100,
    unsupported_ratio: Math.round(unsupportedRatio * 100) / 100,
    completed_at: new Date().toISOString(),
  };
}
