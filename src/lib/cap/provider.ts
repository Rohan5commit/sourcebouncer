import { v4 as uuidv4 } from "uuid";
import {
  CapInvocation,
  SettlementRecord,
  PricingTier,
  TrustReport,
} from "@/lib/schemas";

const invocations: Map<string, CapInvocation> = new Map();
const settlements: Map<string, SettlementRecord> = new Map();

let _client: any = null;
let _connected = false;
let _initAttempted = false;

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

// Lazy CAP client initialization - only when actually needed
async function getClient(): Promise<any> {
  if (_client) return _client;
  if (_initAttempted) return null;
  _initAttempted = true;

  const sdkKey = process.env.CROO_SDK_KEY;
  if (!sdkKey) {
    console.warn("CAP SDK: CROO_SDK_KEY not set, running in simulation mode");
    return null;
  }

  try {
    const sdk = await import("@croo-network/sdk");
    const AgentClientClass = sdk.AgentClient;

    if (!AgentClientClass) {
      console.warn("CAP SDK: AgentClient not found");
      return null;
    }

    _client = new AgentClientClass(
      {
        baseURL: process.env.CROO_API_URL || "https://cap.croo.network",
        wsURL: process.env.CROO_WS_URL || "wss://cap.croo.network",
      },
      sdkKey
    );

    if (typeof _client.connect === "function") {
      await _client.connect();
      _connected = true;
      console.log("CAP SDK connected");
    }

    return _client;
  } catch (error) {
    console.warn("CAP SDK init failed, simulation mode:", error);
    _client = null;
    return null;
  }
}

export { getClient as getCAPClient };

export function isCAPConnected(): boolean {
  return _connected;
}

export async function registerService(): Promise<void> {
  const client = await getClient();
  if (!client) return;
  try {
    if (typeof client.registerService === "function") {
      await client.registerService({
        agentId: AGENT_IDENTITY.agent_id,
        capabilities: AGENT_IDENTITY.capabilities,
        pricing: SERVICE_TIERS.map(t => ({
          tier: t.tier_id,
          price: t.price_usdc,
          currency: "USDC",
        })),
      });
    }
  } catch (error) {
    console.warn("CAP service registration failed:", error);
  }
}

export async function acceptNegotiation(negotiationId: string): Promise<boolean> {
  const client = await getClient();
  if (!client) return true;
  try {
    if (typeof client.acceptNegotiation === "function") {
      await client.acceptNegotiation(negotiationId);
    }
    return true;
  } catch (error) {
    console.warn("CAP negotiation failed:", error);
    return false;
  }
}

export async function deliverOrder(invocationId: string, resultHash: string): Promise<boolean> {
  const client = await getClient();
  if (!client) return true;
  try {
    if (typeof client.deliverOrder === "function") {
      await client.deliverOrder(invocationId, resultHash);
    }
    return true;
  } catch (error) {
    console.warn("CAP delivery failed:", error);
    return false;
  }
}

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

export function escrowFunds(invocationId: string): CapInvocation {
  const inv = invocations.get(invocationId);
  if (!inv) throw new Error("Invocation not found");
  inv.status = "escrowed";
  invocations.set(invocationId, inv);
  return inv;
}

export function completeAndSettle(
  invocationId: string,
  report: TrustReport
): { invocation: CapInvocation; settlement: SettlementRecord } {
  const inv = invocations.get(invocationId);
  if (!inv) throw new Error("Invocation not found");

  inv.status = "completed";
  inv.settled_at = new Date().toISOString();
  invocations.set(invocationId, inv);

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

export function getAllInvocations(): CapInvocation[] {
  return Array.from(invocations.values());
}

export function getAllSettlements(): SettlementRecord[] {
  return Array.from(settlements.values());
}

export function getTierById(tierId: string): PricingTier | undefined {
  return SERVICE_TIERS.find((t) => t.tier_id === tierId);
}
