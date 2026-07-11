import { v4 as uuidv4 } from "uuid";
import {
  CapInvocation,
  SettlementRecord,
  VerificationTask,
  TrustReport,
  PricingTier,
} from "@/lib/schemas";

// In-memory store for demo (would be database in production)
const invocations: Map<string, CapInvocation> = new Map();
const settlements: Map<string, SettlementRecord> = new Map();

// Service pricing tiers
export const SERVICE_TIERS: PricingTier[] = [
  {
    tier_id: "quick",
    name: "Quick Verification",
    description: "Fast claim-by-claim check with basic source analysis",
    price_usdc: 0.5,
    max_claims: 5,
    includes_source_analysis: true,
    includes_contradiction_detection: false,
    turnaround_seconds: 30,
  },
  {
    tier_id: "deep",
    name: "Deep Verification",
    description: "Comprehensive analysis with contradiction detection and revision suggestions",
    price_usdc: 2.0,
    max_claims: 20,
    includes_source_analysis: true,
    includes_contradiction_detection: true,
    turnaround_seconds: 120,
  },
  {
    tier_id: "bundle",
    name: "Claim Bundle Verification",
    description: "Bulk verification for research teams and content pipelines",
    price_usdc: 5.0,
    max_claims: 100,
    includes_source_analysis: true,
    includes_contradiction_detection: true,
    turnaround_seconds: 300,
  },
];

// Agent identity
export const AGENT_IDENTITY = {
  agent_id: "sourcebouncer-v1",
  name: "SourceBouncer",
  description: "Paid verification and citation agent for the CROO agent economy",
  category: "Data & Verification",
  pricing: SERVICE_TIERS,
  capabilities: [
    "claim-verification",
    "source-analysis",
    "contradiction-detection",
    "trust-scoring",
    "citation-validation",
    "evidence-packaging",
  ],
  wallet_address: process.env.CROO_AGENT_WALLET || "0x0000000000000000000000000000000000000000",
};

// Create a CAP invocation
export function createInvocation(
  taskId: string,
  requesterId: string,
  tier: PricingTier
): CapInvocation {
  const invocation: CapInvocation = {
    invocation_id: uuidv4(),
    task_id: taskId,
    provider_agent_id: AGENT_IDENTITY.agent_id,
    requester_agent_id: requesterId,
    service_name: tier.name,
    price_usdc: tier.price_usdc,
    status: "initiated",
    created_at: new Date().toISOString(),
  };
  invocations.set(invocation.invocation_id, invocation);
  return invocation;
}

// Simulate escrow lock (in production: calls CROO SDK escrow contract)
export function escrowFunds(invocationId: string): CapInvocation {
  const inv = invocations.get(invocationId);
  if (!inv) throw new Error("Invocation not found");
  inv.status = "escrowed";
  invocations.set(invocationId, inv);
  return inv;
}

// Complete invocation and settle payment
export function completeAndSettle(
  invocationId: string,
  report: TrustReport
): { invocation: CapInvocation; settlement: SettlementRecord } {
  const inv = invocations.get(invocationId);
  if (!inv) throw new Error("Invocation not found");

  inv.status = "completed";
  inv.settled_at = new Date().toISOString();
  invocations.set(invocationId, inv);

  // Create settlement record
  const settlement: SettlementRecord = {
    settlement_id: uuidv4(),
    invocation_id: invocationId,
    tx_hash: `0x${Buffer.from(uuidv4()).toString("hex").substring(0, 64)}`,
    amount_usdc: inv.price_usdc,
    from_address: process.env.CROO_AGENT_WALLET || "0x0000000000000000000000000000000000000000",
    to_address: AGENT_IDENTITY.wallet_address,
    chain: "base",
    status: "confirmed",
    timestamp: new Date().toISOString(),
  };
  settlements.set(settlement.settlement_id, settlement);

  return { invocation: inv, settlement };
}

// Get all invocations
export function getAllInvocations(): CapInvocation[] {
  return Array.from(invocations.values());
}

// Get all settlements
export function getAllSettlements(): SettlementRecord[] {
  return Array.from(settlements.values());
}

// Get tier by ID
export function getTierById(tierId: string): PricingTier | undefined {
  return SERVICE_TIERS.find((t) => t.tier_id === tierId);
}
