"use client";

import { Shield, Cpu, Coins, ArrowRight, Lock, Zap, Globe, Store } from "lucide-react";
import { AGENT_STORE_LISTING } from "@/lib/croo/agent-store";
import { SERVICE_TIERS } from "@/lib/cap/provider";

const BLOCKS = [
  { icon: <Globe className="w-6 h-6" />, title: "Discovery", desc: "Agent finds SourceBouncer on CROO Agent Store. Reviews pricing, capabilities, and ratings." },
  { icon: <Lock className="w-6 h-6" />, title: "CAP Negotiation", desc: "Requester agent initiates CAP negotiation. Terms, pricing, and SLA agreed." },
  { icon: <Coins className="w-6 h-6" />, title: "USDC Escrow", desc: "Funds locked in smart contract escrow on Base. Payment only released on verified delivery." },
  { icon: <Cpu className="w-6 h-6" />, title: "NVIDIA NIM Verification", desc: "Claims analyzed against sources using AI inference. Structured verdicts produced." },
  { icon: <Shield className="w-6 h-6" />, title: "Trust Report", desc: "Machine-readable evidence package with claim verdicts, scores, and reasoning." },
  { icon: <Zap className="w-6 h-6" />, title: "Settlement & Reputation", desc: "Payment released on-chain. Agent reputation updated. Downstream agents consume output." },
];

export default function ArchitecturePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Architecture</h1>
      <p className="text-[#a0a0b0] mb-12">Why paid verification is essential for the agent economy, and how SourceBouncer delivers it.</p>

      <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-8 mb-12">
        <h2 className="text-xl font-semibold mb-4">Why Paid Verification Matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-blue-400 mb-2">The Problem</h3>
            <p className="text-sm text-[#a0a0b0]">AI agents are multiplying fast. Bad outputs destroy trust. Most agents cannot buy verification from another agent as a service.</p>
          </div>
          <div>
            <h3 className="font-medium text-blue-400 mb-2">The CROO Solution</h3>
            <p className="text-sm text-[#a0a0b0]">CAP enables discovery, payment, and agent-to-agent commerce. SourceBouncer proves the future agent stack includes paid verification as a reusable dependency.</p>
          </div>
          <div>
            <h3 className="font-medium text-blue-400 mb-2">Commercial Viability</h3>
            <p className="text-sm text-[#a0a0b0]">Pay-per-verification creates sustainable economics. Agents pay only for what they use. Provider earns on every verification job.</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6">Verification Flow</h2>
      <div className="space-y-4 mb-12">
        {BLOCKS.map((b, i) => (
          <div key={i} className="flex items-start gap-4 bg-[#12121a] border border-[#1e293b] rounded-xl p-6 card-hover">
            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
              {b.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[#6b7280] font-mono">STEP {String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-semibold">{b.title}</h3>
              </div>
              <p className="text-sm text-[#a0a0b0]">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Store Listing */}
      <div className="bg-[#12121a] border border-blue-500/20 rounded-xl p-8 mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold">CROO Agent Store Listing</h2>
        </div>
        <p className="text-[#a0a0b0] text-sm mb-6">SourceBouncer is ready to list on the CROO Agent Store with the following metadata:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0a0a0f] rounded-lg p-4">
            <div className="text-xs text-[#6b7280] mb-1">Name</div>
            <div className="font-semibold text-white">{AGENT_STORE_LISTING.name}</div>
            <div className="text-sm text-[#a0a0b0] mt-1">{AGENT_STORE_LISTING.tagline}</div>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-4">
            <div className="text-xs text-[#6b7280] mb-1">Categories</div>
            <div className="flex gap-2 flex-wrap">
              {AGENT_STORE_LISTING.category.map((cat) => (
                <span key={cat} className="text-xs bg-blue-600/10 text-blue-300 px-2 py-1 rounded">{cat}</span>
              ))}
            </div>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-4">
            <div className="text-xs text-[#6b7280] mb-1">Pricing</div>
            <div className="space-y-1">
              {SERVICE_TIERS.map((t) => (
                <div key={t.tier_id} className="text-sm text-white">{t.name}: ${t.price_usdc} USDC ({t.max_claims} claims)</div>
              ))}
            </div>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-4">
            <div className="text-xs text-[#6b7280] mb-1">Capabilities</div>
            <div className="flex gap-2 flex-wrap">
              {AGENT_STORE_LISTING.capabilities.map((cap) => (
                <span key={cap} className="text-xs bg-green-600/10 text-green-300 px-2 py-1 rounded">{cap}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 bg-[#0a0a0f] rounded-lg p-4">
          <div className="text-xs text-[#6b7280] mb-1">Network</div>
          <div className="text-sm text-white">{AGENT_STORE_LISTING.network} — {AGENT_STORE_LISTING.currency}</div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6">Technical Implementation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6">
          <h3 className="font-semibold mb-3">AI-Driven (NVIDIA NIM)</h3>
          <ul className="text-sm text-[#a0a0b0] space-y-2">
            <li>• Claim extraction and analysis</li>
            <li>• Evidence matching and relevance scoring</li>
            <li>• Contradiction detection</li>
            <li>• Revision suggestion generation</li>
            <li>• Natural language explanations</li>
          </ul>
        </div>
        <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6">
          <h3 className="font-semibold mb-3">Deterministic</h3>
          <ul className="text-sm text-[#a0a0b0] space-y-2">
            <li>• Schema validation (Zod)</li>
            <li>• Payment state machine</li>
            <li>• CAP invocation lifecycle</li>
            <li>• On-chain settlement records</li>
            <li>• Score aggregation formulas</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#12121a] border border-blue-500/20 rounded-xl p-8">
        <h2 className="text-xl font-semibold mb-4">A2A Composability</h2>
        <p className="text-[#a0a0b0] mb-6">SourceBouncer is not a standalone tool. It is a paid dependency that other agents compose into their workflows.</p>
        <div className="flex items-center gap-4 flex-wrap">
          {["Research Agent", "Trading Agent", "Content Agent", "News Agent", "Any CAP Agent"].map((name) => (
            <div key={name} className="flex items-center gap-2">
              <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg px-4 py-2 text-sm text-blue-300">{name}</div>
              <ArrowRight className="w-4 h-4 text-[#6b7280]" />
              <div className="bg-blue-600/20 rounded-lg px-4 py-2 text-sm text-white font-medium">SourceBouncer</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
