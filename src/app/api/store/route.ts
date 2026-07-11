import { NextResponse } from "next/server";
import { AGENT_STORE_LISTING } from "@/lib/croo/agent-store";
import { SERVICE_TIERS, AGENT_IDENTITY } from "@/lib/cap/provider";

export async function GET() {
  return NextResponse.json(
    {
      ...AGENT_STORE_LISTING,
      agent_id: AGENT_IDENTITY.agent_id,
      wallet: AGENT_IDENTITY.wallet_address,
      tiers: SERVICE_TIERS.map(t => ({
        id: t.tier_id,
        name: t.name,
        price_usdc: t.price_usdc,
        max_claims: t.max_claims,
        turnaround_seconds: t.turnaround_seconds,
      })),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    }
  );
}
