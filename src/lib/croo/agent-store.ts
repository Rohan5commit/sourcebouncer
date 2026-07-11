// CROO Agent Store listing metadata
export const AGENT_STORE_LISTING = {
  name: "SourceBouncer",
  tagline: "Paid verification and citation agent for the CROO agent economy",
  description: "A callable verification agent that other agents can hire through CAP to verify claims, inspect source quality, detect unsupported statements, and return a trust-scored evidence packages.",
  category: ["Data & Verification", "Research & Intelligence"],
  pricing: [
    { tier: "quick", price_usdc: 0.5, claims: 5, turnaround: "30s" },
    { tier: "deep", price_usdc: 2.0, claims: 20, turnaround: "2m" },
    { tier: "bundle", price_usdc: 5.0, claims: 100, turnaround: "5m" },
  ],
  capabilities: [
    "claim-verification",
    "source-analysis",
    "contradiction-detection",
    "trust-scoring",
    "citation-validation",
    "evidence-packaging",
  ],
  example_use_cases: [
    "Research agent verifies claims before publishing",
    "Trading agent validates news signals",
    "Content agent checks citations before publishing",
    "Any agent hires SourceBouncer for fact-checking",
  ],
  network: "base",
  currency: "USDC",
  callable_by: ["humans", "other-agents"],
};
