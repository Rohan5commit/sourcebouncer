import { NextResponse } from "next/server";
import { getAllInvocations, getAllSettlements, AGENT_IDENTITY } from "@/lib/cap/provider";
import { initializeDemoData } from "@/lib/store";

initializeDemoData();

export async function GET() {
  const invocations = getAllInvocations();
  const settlements = getAllSettlements();
  return NextResponse.json({
    agent: AGENT_IDENTITY,
    total_invocations: invocations.length,
    total_settlements: settlements.length,
    invocations: invocations.slice(-10),
    settlements: settlements.slice(-10),
    status: "operational",
    network: "base",
    currency: "USDC",
  });
}
