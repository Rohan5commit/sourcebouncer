import { describe, it, expect } from "vitest";
import {
  AGENT_IDENTITY,
  SERVICE_TIERS,
  getTierById,
  createInvocation,
  escrowFunds,
  completeAndSettle,
  getAllInvocations,
  getAllSettlements,
} from "@/lib/cap/provider";
import { TrustReport } from "@/lib/schemas";

describe("CAP Agent Identity", () => {
  it("has required fields", () => {
    expect(AGENT_IDENTITY.agent_id).toBeTruthy();
    expect(AGENT_IDENTITY.name).toBe("SourceBouncer");
    expect(AGENT_IDENTITY.description).toBeTruthy();
    expect(AGENT_IDENTITY.category).toBe("Data & Verification");
    expect(AGENT_IDENTITY.wallet_address).toBeTruthy();
  });

  it("has capabilities array", () => {
    expect(Array.isArray(AGENT_IDENTITY.capabilities)).toBe(true);
    expect(AGENT_IDENTITY.capabilities.length).toBeGreaterThan(0);
  });

  it("has pricing array matching SERVICE_TIERS", () => {
    expect(AGENT_IDENTITY.pricing).toEqual(SERVICE_TIERS);
  });
});

describe("Pricing tiers", () => {
  it("returns correct tier by ID", () => {
    expect(getTierById("quick")).toBeDefined();
    expect(getTierById("deep")).toBeDefined();
    expect(getTierById("bundle")).toBeDefined();
  });

  it("returns undefined for unknown tier", () => {
    expect(getTierById("premium")).toBeUndefined();
  });

  it("quick tier has lower price than deep", () => {
    const quick = getTierById("quick")!;
    const deep = getTierById("deep")!;
    expect(quick.price_usdc).toBeLessThan(deep.price_usdc);
  });

  it("deep tier has lower price than bundle", () => {
    const deep = getTierById("deep")!;
    const bundle = getTierById("bundle")!;
    expect(deep.price_usdc).toBeLessThan(bundle.price_usdc);
  });

  it("all tiers have positive prices", () => {
    for (const tier of SERVICE_TIERS) {
      expect(tier.price_usdc).toBeGreaterThan(0);
    }
  });

  it("all tiers have positive max_claims", () => {
    for (const tier of SERVICE_TIERS) {
      expect(tier.max_claims).toBeGreaterThan(0);
    }
  });

  it("all tiers have positive turnaround_seconds", () => {
    for (const tier of SERVICE_TIERS) {
      expect(tier.turnaround_seconds).toBeGreaterThan(0);
    }
  });
});

describe("Invocation lifecycle", () => {
  it("creates invocation with correct initial state", () => {
    const tier = getTierById("quick")!;
    const inv = createInvocation("task-lifecycle-001", "agent-lifecycle-001", tier);
    expect(inv.invocation_id).toBeTruthy();
    expect(inv.task_id).toBe("task-lifecycle-001");
    expect(inv.provider_agent_id).toBe(AGENT_IDENTITY.agent_id);
    expect(inv.requester_agent_id).toBe("agent-lifecycle-001");
    expect(inv.status).toBe("initiated");
    expect(inv.price_usdc).toBe(tier.price_usdc);
    expect(inv.created_at).toBeTruthy();
  });

  it("transitions initiated → escrowed → completed", () => {
    const tier = getTierById("deep")!;
    const inv = createInvocation("task-lifecycle-002", "agent-lifecycle-002", tier);
    const escrowed = escrowFunds(inv.invocation_id);
    expect(escrowed.status).toBe("escrowed");

    const mockReport = {
      report_id: "report-lifecycle-001",
      task_id: "task-lifecycle-002",
      claim_verdicts: [],
      overall_trust_score: 0.9,
      overall_report_summary: "All good.",
      citation_presence_score: 1.0,
      source_relevance_score: 0.95,
      contradiction_risk: 0.0,
      unsupported_ratio: 0.0,
      completed_at: new Date().toISOString(),
    } as TrustReport;

    const { invocation, settlement } = completeAndSettle(inv.invocation_id, mockReport);
    expect(invocation.status).toBe("completed");
    expect(invocation.settled_at).toBeTruthy();
    expect(settlement.status).toBe("confirmed");
    expect(settlement.amount_usdc).toBe(tier.price_usdc);
    expect(settlement.chain).toBe("base");
  });

  it("settlement has valid tx_hash format", () => {
    const tier = getTierById("quick")!;
    const inv = createInvocation("task-txhash-001", "agent-txhash-001", tier);
    escrowFunds(inv.invocation_id);
    const mockReport = {
      report_id: "report-txhash-001",
      task_id: "task-txhash-001",
      claim_verdicts: [],
      overall_trust_score: 0.8,
      overall_report_summary: "Done.",
      citation_presence_score: 0.9,
      source_relevance_score: 0.85,
      contradiction_risk: 0.05,
      unsupported_ratio: 0.0,
      completed_at: new Date().toISOString(),
    } as TrustReport;

    const { settlement } = completeAndSettle(inv.invocation_id, mockReport);
    expect(settlement.tx_hash).toMatch(/^0x[0-9a-f]+$/);
  });

  it("tracks all invocations", () => {
    const all = getAllInvocations();
    expect(all.length).toBeGreaterThanOrEqual(1);
  });

  it("tracks all settlements", () => {
    const all = getAllSettlements();
    expect(all.length).toBeGreaterThanOrEqual(1);
  });
});
