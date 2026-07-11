import { PricingTier } from "@/lib/schemas";

export const PRICING_TIERS: PricingTier[] = [
  {
    tier_id: "quick",
    name: "Quick Verification",
    description: "Fast claim-by-claim check with basic source analysis. Perfect for quick fact-checks.",
    price_usdc: 0.5,
    max_claims: 5,
    includes_source_analysis: true,
    includes_contradiction_detection: false,
    turnaround_seconds: 30,
  },
  {
    tier_id: "deep",
    name: "Deep Verification",
    description: "Comprehensive analysis with contradiction detection, revision suggestions, and full evidence mapping.",
    price_usdc: 2.0,
    max_claims: 20,
    includes_source_analysis: true,
    includes_contradiction_detection: true,
    turnaround_seconds: 120,
  },
  {
    tier_id: "bundle",
    name: "Claim Bundle Verification",
    description: "Bulk verification for research teams, content pipelines, and agent dependencies.",
    price_usdc: 5.0,
    max_claims: 100,
    includes_source_analysis: true,
    includes_contradiction_detection: true,
    turnaround_seconds: 300,
  },
];

export function formatPrice(usdc: number): string {
  return `$${usdc.toFixed(2)} USDC`;
}

export function formatTurnaround(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}
