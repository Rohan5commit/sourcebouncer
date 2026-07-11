"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Bot, FileText, CheckCircle, AlertTriangle } from "lucide-react";

export default function ReusePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/tasks").then((r) => r.json()).then(setData);
  }, []);

  const report = data?.reports?.[0];
  const actions = [
    {
      agent: "ResearchBrief Agent",
      type: "content-editor",
      action: "revise",
      reasoning: "One claim contradicted by evidence. Brief revised to remove unsupported statement.",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      agent: "TradeSignal Agent",
      type: "risk-analyzer",
      action: "proceed",
      reasoning: "All claims well-supported. Signal confidence high enough to act on.",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      agent: "ContentPipeline Agent",
      type: "publisher",
      action: "flag",
      reasoning: "Flagged 1 unsupported claim for editorial review before publication.",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Downstream Agent Reuse</h1>
      <p className="text-[#a0a0b0] mb-8">How other agents consume SourceBouncer's verification output to make better decisions</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* SourceBouncer Output */}
        <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-5 h-5 text-blue-400" />
            <h2 className="font-semibold">SourceBouncer Output</h2>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-4 font-mono text-sm">
            <div className="text-[#6b7280] mb-2">// Structured verification report</div>
            <div className="text-blue-400">{`{`}</div>
            <div className="pl-4"><span className="text-green-400">trust_score</span>: {report ? Math.round(report.overall_trust_score * 100) : 74}%,</div>
            <div className="pl-4"><span className="text-green-400">claims_verified</span>: {report?.claim_verdicts?.length || 3},</div>
            <div className="pl-4"><span className="text-green-400">contradictions_found</span>: {report?.claim_verdicts?.filter((v: any) => v.verdict === "contradicted").length || 1},</div>
            <div className="pl-4"><span className="text-green-400">revision_needed</span>: true,</div>
            <div className="text-blue-400">{`}`}</div>
          </div>
        </div>

        {/* A2A Flow */}
        <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowRight className="w-5 h-5 text-blue-400" />
            <h2 className="font-semibold">A2A Commerce Flow</h2>
          </div>
          <div className="space-y-3">
            {[
              { step: "1", text: "Agent discovers SourceBouncer on CROO Store" },
              { step: "2", text: "Agent hires via CAP, locks USDC" },
              { step: "3", text: "SourceBouncer verifies claims" },
              { step: "4", text: "Structured report returned" },
              { step: "5", text: "Agent acts on verification result" },
              { step: "6", text: "Payment settled on-chain" },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center text-xs text-blue-400 font-bold">{s.step}</div>
                <span className="text-sm text-[#a0a0b0]">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Downstream Agent Examples */}
      <h2 className="text-xl font-semibold mb-6">Example Downstream Agents</h2>
      <div className="space-y-4">
        {actions.map((a, i) => (
          <div key={i} className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6 card-hover">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400">
                {a.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-white">{a.agent}</h3>
                  <span className="text-xs text-[#6b7280] bg-[#0a0a0f] px-2 py-0.5 rounded">{a.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    a.action === "proceed" ? "bg-green-500/10 text-green-400" :
                    a.action === "revise" ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-orange-500/10 text-orange-400"
                  }`}>{a.action}</span>
                </div>
                <p className="text-sm text-[#a0a0b0]">{a.reasoning}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#12121a] border border-blue-500/20 rounded-xl p-6 mt-8">
        <h3 className="font-semibold text-blue-400 mb-2">Key Insight</h3>
        <p className="text-[#a0a0b0] text-sm">SourceBouncer enables agent-to-agent commerce by providing a reusable, paid verification dependency. Any agent in the CROO ecosystem can hire SourceBouncer to validate information before taking action—making the entire agent stack more reliable and trustworthy.</p>
      </div>
    </div>
  );
}
