import { describe, it, expect } from "vitest";
import {
  createInvocation,
  escrowFunds,
  completeAndSettle,
  getTierById,
  SERVICE_TIERS,
} from "@/lib/cap/provider";
import { TrustReport } from "@/lib/schemas";

describe("Payment state transitions", () => {
  it("creates invocation with initiated status", () => {
    const tier = getTierById("quick")!;
    const inv = createInvocation("task-001", "agent-001", tier);
    expect(inv.status).toBe("initiated");
    expect(inv.price_usdc).toBe(0.5);
  });

  it("transitions to escrowed", () => {
    const tier = getTierById("quick")!;
    const inv = createInvocation("task-002", "agent-002", tier);
    const escrowed = escrowFunds(inv.invocation_id);
    expect(escrowed.status).toBe("escrowed");
  });

  it("completes and settles payment", () => {
    const tier = getTierById("deep")!;
    const inv = createInvocation("task-003", "agent-003", tier);
    escrowFunds(inv.invocation_id);

    const mockReport = {
      report_id: "550e8400-e29b-41d4-a716-446655440000",
      task_id: "task-003",
      claim_verdicts: [],
      overall_trust_score: 0.9,
      overall_report_summary: "Verified.",
      citation_presence_score: 1.0,
      source_relevance_score: 0.95,
      contradiction_risk: 0.0,
      unsupported_ratio: 0.0,
      completed_at: new Date().toISOString(),
    } as TrustReport;

    const { invocation, settlement } = completeAndSettle(inv.invocation_id, mockReport);
    expect(invocation.status).toBe("completed");
    expect(invocation.settled_at).toBeDefined();
    expect(settlement.status).toBe("confirmed");
    expect(settlement.amount_usdc).toBe(2.0);
    expect(settlement.tx_hash).toBeDefined();
  });

  it("throws on missing invocation", () => {
    expect(() => escrowFunds("nonexistent")).toThrow("Invocation not found");
  });
});

describe("Pricing tiers", () => {
  it("has three tiers", () => {
    expect(SERVICE_TIERS).toHaveLength(3);
  });

  it("quick tier is cheapest", () => {
    const quick = getTierById("quick")!;
    const deep = getTierById("deep")!;
    expect(quick.price_usdc).toBeLessThan(deep.price_usdc);
  });

  it("bundle tier has most claims", () => {
    const bundle = getTierById("bundle")!;
    const quick = getTierById("quick")!;
    expect(bundle.max_claims).toBeGreaterThan(quick.max_claims);
  });
});
