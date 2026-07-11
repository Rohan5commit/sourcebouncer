"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2, Send } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { VerdictBadge } from "@/components/VerdictBadge";
import { ScoreCard } from "@/components/ScoreCard";
import { PageHeader } from "@/components/PageHeader";

interface ClaimInput {
  claim_id: string;
  claim_text: string;
  context: string;
}

interface SourceInput {
  source_id: string;
  title: string;
  content: string;
  source_type: string;
}

export default function DemoPage() {
  const [claims, setClaims] = useState<ClaimInput[]>([
    { claim_id: "c1", claim_text: "", context: "" },
  ]);
  const [sources, setSources] = useState<SourceInput[]>([
    { source_id: "s1", title: "", content: "", source_type: "other" },
  ]);
  const [tier, setTier] = useState("quick");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const addClaim = () => setClaims([...claims, { claim_id: `c${claims.length + 1}`, claim_text: "", context: "" }]);
  const removeClaim = (idx: number) => { if (claims.length > 1) setClaims(claims.filter((_, i) => i !== idx)); };
  const addSource = () => setSources([...sources, { source_id: `s${sources.length + 1}`, title: "", content: "", source_type: "other" }]);
  const removeSource = (idx: number) => { if (sources.length > 1) setSources(sources.filter((_, i) => i !== idx)); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const validClaims = claims.filter((c) => c.claim_text.trim());
      const validSources = sources.filter((s) => s.title.trim() && s.content.trim());
      const task = {
        task_id: uuidv4(),
        requester_id: "demo-user",
        claims: validClaims,
        sources: validSources,
        pricing_tier: tier,
        created_at: new Date().toISOString(),
        status: "pending" as const,
      };
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        alert("Verification failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Verification Complete</h1>
          <button onClick={() => setResult(null)} className="text-blue-400 hover:text-blue-300 text-sm">← Run Another</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <ScoreCard label="Trust Score" value={`${Math.round(result.report.overall_trust_score * 100)}%`} color="text-green-400" />
          <ScoreCard label="Claims Verified" value={result.report.claim_verdicts.length} />
          <ScoreCard label="USDC Settled" value={`$${result.settlement.amount_usdc}`} color="text-green-400" />
          <ScoreCard label="On-chain Tx" value={result.settlement.tx_hash?.substring(0, 16) + "..."} />
        </div>
        <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-3">Report Summary</h2>
          <p className="text-[#a0a0b0]">{result.report.overall_report_summary}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Claim Verdicts</h2>
          {result.report.claim_verdicts.map((v: any) => (
            <div key={v.claim_id} className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <p className="font-medium text-white flex-1">&quot;{v.claim_text}&quot;</p>
                <VerdictBadge verdict={v.verdict} className="ml-4 shrink-0" />
              </div>
              <p className="text-sm text-[#a0a0b0] mb-3">{v.reasoning}</p>
              <div className="flex gap-4 text-xs text-[#6b7280]">
                <span>Evidence: {Math.round(v.evidence_strength * 100)}%</span>
                <span>Confidence: {Math.round(v.confidence * 100)}%</span>
                <span>Sources: {v.supporting_sources.length} supporting, {v.conflicting_sources.length} conflicting</span>
              </div>
              {v.revision_suggestion && (
                <div className="mt-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-300">
                  {v.revision_suggestion}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-8">
          <a href={`/results?task=${result.task.task_id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">View Full Report</a>
          <a href="/audit" className="border border-[#1e293b] hover:border-blue-600/50 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">View Audit Trail</a>
          <a href="/ask" className="border border-[#1e293b] hover:border-blue-600/50 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">Ask SourceBouncer</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <PageHeader icon={Send} title="Verification Demo" subtitle="Submit claims and sources for AI-powered verification" />

      <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider mb-4">Pricing Tier</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "quick", name: "Quick", price: "$0.50", desc: "5 claims, fast analysis" },
            { id: "deep", name: "Deep", price: "$2.00", desc: "20 claims, full analysis" },
            { id: "bundle", name: "Bundle", price: "$5.00", desc: "100 claims, bulk verification" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTier(t.id)} className={`p-4 rounded-xl border text-left transition-all ${
              tier === t.id ? "border-blue-500 bg-blue-500/10" : "border-[#1e293b] hover:border-blue-500/30"
            }`}> 
              <div className="font-semibold">{t.name} <span className="text-blue-400">{t.price} USDC</span></div>
              <div className="text-sm text-[#6b7280]">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider">Claims</h2>
          <button onClick={addClaim} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add Claim</button>
        </div>
        <div className="space-y-4">
          {claims.map((claim, idx) => (
            <div key={idx} className="flex gap-3">
              <input value={claim.claim_text} onChange={(e) => {
                const next = [...claims]; next[idx].claim_text = e.target.value; setClaims(next);
              }} placeholder="Enter a claim to verify..." className="flex-1 bg-[#0a0a0f] border border-[#1e293b] rounded-lg px-4 py-3 text-sm focus:border-blue-500 focus:outline-none" />
              {claims.length > 1 && (
                <button onClick={() => removeClaim(idx)} className="text-[#6b7280] hover:text-red-400 p-3"><Trash2 className="w-4 h-4" /></button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider">Sources (optional)</h2>
          <button onClick={addSource} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add Source</button>
        </div>
        <div className="space-y-4">
          {sources.map((source, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input value={source.title} onChange={(e) => {
                const next = [...sources]; next[idx].title = e.target.value; setSources(next);
              }} placeholder="Source title" className="bg-[#0a0a0f] border border-[#1e293b] rounded-lg px-4 py-3 text-sm focus:border-blue-500 focus:outline-none" />
              <input value={source.content} onChange={(e) => {
                const next = [...sources]; next[idx].content = e.target.value; setSources(next);
              }} placeholder="Source content" className="bg-[#0a0a0f] border border-[#1e293b] rounded-lg px-4 py-3 text-sm focus:border-blue-500 focus:outline-none" />
              <div className="flex gap-2">
                <select value={source.source_type} onChange={(e) => {
                  const next = [...sources]; next[idx].source_type = e.target.value; setSources(next);
                }} className="flex-1 bg-[#0a0a0f] border border-[#1e293b] rounded-lg px-4 py-3 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="academic">Academic</option>
                  <option value="news">News</option>
                  <option value="government">Government</option>
                  <option value="industry">Industry</option>
                  <option value="blog">Blog</option>
                  <option value="other">Other</option>
                </select>
                {sources.length > 1 && (
                  <button onClick={() => removeSource(idx)} className="text-[#6b7280] hover:text-red-400 p-3"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || claims.every((c) => !c.claim_text.trim())}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-4 rounded-xl text-lg transition-all flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : <><Send className="w-5 h-5" /> Submit for Verification</>}
      </button>
    </div>
  );
}
