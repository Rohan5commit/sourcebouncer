"use client";

import { Check, X } from "lucide-react";
import { SERVICE_TIERS } from "@/lib/cap/provider";

const tierFeatures: Record<string, { text: string; included: boolean }[]> = {
  quick: [
    { text: "Up to 5 claims", included: true },
    { text: "Basic source analysis", included: true },
    { text: "Trust score", included: true },
    { text: "Contradiction detection", included: false },
    { text: "Revision suggestions", included: false },
  ],
  deep: [
    { text: "Up to 20 claims", included: true },
    { text: "Full source analysis", included: true },
    { text: "Trust score", included: true },
    { text: "Contradiction detection", included: true },
    { text: "Revision suggestions", included: true },
  ],
  bundle: [
    { text: "Up to 100 claims", included: true },
    { text: "Full source analysis", included: true },
    { text: "Trust score", included: true },
    { text: "Contradiction detection", included: true },
    { text: "Revision suggestions", included: true },
  ],
};

function formatTurnaround(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m`;
}

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Pay-Per-Verification Pricing</h1>
        <p className="text-[#a0a0b0] max-w-xl mx-auto">Agents pay in USDC through CAP. No subscriptions. No hidden fees. Just verified truth.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SERVICE_TIERS.map((t, i) => (
          <div key={t.tier_id} className={`bg-[#12121a] border rounded-xl p-8 relative ${
            i === 1 ? "border-blue-500 shadow-lg shadow-blue-500/10" : "border-[#1e293b]"
          }`}>
            {i === 1 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <h3 className="text-lg font-semibold mb-1">{t.name}</h3>
            <div className="text-3xl font-bold mb-1">${t.price_usdc} <span className="text-base font-normal text-[#6b7280]">USDC</span></div>
            <div className="text-sm text-[#6b7280] mb-6">~{formatTurnaround(t.turnaround_seconds)} turnaround</div>
            <div className="space-y-3 mb-8">
              {tierFeatures[t.tier_id].map((f, j) => (
                <div key={j} className="flex items-center gap-2 text-sm">
                  {f.included ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-[#6b7280]" />}
                  <span className={f.included ? "text-white" : "text-[#6b7280]"}>{f.text}</span>
                </div>
              ))}
            </div>
            <a href="/demo" className={`block text-center py-3 rounded-xl font-medium transition-colors ${
              i === 1 ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-[#1e293b] hover:bg-[#252535] text-white"
            }`}>Try {t.name}</a>
          </div>
        ))}
      </div>
      <div className="text-center mt-12 space-y-2">
        <p className="text-sm text-[#6b7280]">Payment handled via CAP — USDC on Base — On-chain settlement</p>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-3 inline-block">
          <p className="text-blue-300 text-xs font-medium">ℹ️ Settlement is simulated in this demo. Live on-chain USDC settlement requires CROO_SDK_KEY + funded wallet on Base.</p>
        </div>
      </div>
    </div>
  );
}
