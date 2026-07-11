"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Shield, FileText, ExternalLink } from "lucide-react";

function ResultsContent() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("task");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!taskId) {
      fetch("/api/tasks").then((r) => r.json()).then((d) => {
        if (d.reports?.length > 0) {
          setData(d.reports[0]);
        }
      });
    }
  }, [taskId]);

  if (!data) return <div className="max-w-5xl mx-auto px-4 py-12 text-[#6b7280]">Loading results...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-blue-400" />
        <div>
          <h1 className="text-3xl font-bold">Trust Report</h1>
          <p className="text-sm text-[#6b7280]">Report ID: {data.report_id?.substring(0, 8)}...</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Trust Score", value: `${Math.round(data.overall_trust_score * 100)}%`, color: data.overall_trust_score > 0.7 ? "text-green-400" : "text-yellow-400" },
          { label: "Citation Score", value: `${Math.round(data.citation_presence_score * 100)}%`, color: "text-blue-400" },
          { label: "Source Relevance", value: `${Math.round(data.source_relevance_score * 100)}%`, color: "text-blue-400" },
          { label: "Contradiction Risk", value: `${Math.round(data.contradiction_risk * 100)}%`, color: data.contradiction_risk > 0.3 ? "text-red-400" : "text-green-400" },
          { label: "Unsupported Ratio", value: `${Math.round(data.unsupported_ratio * 100)}%`, color: data.unsupported_ratio > 0.2 ? "text-orange-400" : "text-green-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#12121a] border border-[#1e293b] rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-[#6b7280]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-3">Summary</h2>
        <p className="text-[#a0a0b0]">{data.overall_report_summary}</p>
      </div>

      <h2 className="text-lg font-semibold mb-4">Claim-by-Claim Verdicts</h2>
      <div className="space-y-4">
        {data.claim_verdicts?.map((v: any, i: number) => (
          <div key={i} className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6">
            <div className="flex items-start justify-between mb-3">
              <p className="font-medium flex-1">&quot;{v.claim_text}&quot;</p>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ml-4 ${
                v.verdict === "supported" ? "bg-green-500/10 text-green-400" :
                v.verdict === "contradicted" ? "bg-red-500/10 text-red-400" :
                v.verdict === "unsupported" ? "bg-orange-500/10 text-orange-400" :
                v.verdict === "partially_supported" ? "bg-yellow-500/10 text-yellow-400" :
                "bg-gray-500/10 text-gray-400"
              }`}>{v.verdict.replace(/_/g, " ")}</span>
            </div>
            <p className="text-sm text-[#a0a0b0] mb-4">{v.reasoning}</p>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[#6b7280]">Evidence Strength</span>
                <div className="mt-1 h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${v.evidence_strength * 100}%` }} />
                </div>
              </div>
              <div>
                <span className="text-[#6b7280]">Confidence</span>
                <div className="mt-1 h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${v.confidence * 100}%` }} />
                </div>
              </div>
              <div>
                <span className="text-[#6b7280]">Sources</span>
                <div className="mt-1 text-white">{v.supporting_sources?.length || 0} supporting, {v.conflicting_sources?.length || 0} conflicting</div>
              </div>
            </div>
            {v.revision_suggestion && (
              <div className="mt-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-300">
                Revision: {v.revision_suggestion}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <a href="/demo" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">New Verification</a>
        <a href="/ask" className="border border-[#1e293b] hover:border-blue-600/50 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">Ask SourceBouncer</a>
        <a href="/reuse" className="border border-[#1e293b] hover:border-blue-600/50 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">See Downstream Use</a>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 py-12 text-[#6b7280]">Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
