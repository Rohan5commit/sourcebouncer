"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle, DollarSign, ArrowRight, Activity } from "lucide-react";

export default function AuditPage() {
  const [capData, setCapData] = useState<any>(null);
  const [taskData, setTaskData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/cap/status").then((r) => r.json()).then(setCapData);
    fetch("/api/tasks").then((r) => r.json()).then(setTaskData);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Transaction & Audit View</h1>
      <p className="text-[#a0a0b0] mb-4">Complete audit trail of all verification jobs, CAP invocations, and on-chain settlements</p>
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-3 mb-8">
        <p className="text-blue-300 text-sm font-medium">ℹ️ Settlement records are simulated in this demo. The CAP protocol flow (invoke → escrow → deliver → settle) is fully implemented in code. Set <code className="bg-blue-900/30 px-1 rounded">CROO_SDK_KEY</code> + funded wallet to enable live on-chain USDC settlement.</p>
      </div>

      {/* CAP Status */}
      {capData && (
        <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">CAP Agent Status</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-[#0a0a0f] rounded-lg p-4">
              <div className="text-xs text-[#6b7280]">Agent ID</div>
              <div className="font-mono text-sm text-white truncate">{capData.agent?.agent_id}</div>
            </div>
            <div className="bg-[#0a0a0f] rounded-lg p-4">
              <div className="text-xs text-[#6b7280]">Total Invocations</div>
              <div className="text-xl font-bold text-white">{capData.total_invocations}</div>
            </div>
            <div className="bg-[#0a0a0f] rounded-lg p-4">
              <div className="text-xs text-[#6b7280]">Total Settlements</div>
              <div className="text-xl font-bold text-green-400">{capData.total_settlements}</div>
            </div>
            <div className="bg-[#0a0a0f] rounded-lg p-4">
              <div className="text-xs text-[#6b7280]">Network</div>
              <div className="text-sm text-white">{capData.network} ({capData.currency})</div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-6">Job Timeline</h2>
        {taskData?.tasks?.map((task: any, i: number) => (
          <div key={i} className="flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-400" />
              </div>
              {i < (taskData.tasks?.length || 0) - 1 && <div className="w-0.5 flex-1 bg-[#1e293b] mt-2" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-medium text-white">Verification Task</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  task.status === "completed" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                }`}>{task.status}</span>
              </div>
              <div className="text-sm text-[#6b7280] mb-2">Tier: {task.pricing_tier} • {task.claims?.length || 0} claims</div>
              <div className="text-xs text-[#6b7280]">Created: {new Date(task.created_at).toLocaleString()}</div>
              {/* Settlements for this task */}
              {capData?.settlements?.filter((s: any) => s.invocation_id).map((s: any, j: number) => (
                <div key={j} className="mt-3 bg-[#0a0a0f] rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">${s.amount_usdc} USDC settled</span>
                  </div>
                  <div className="text-xs text-[#6b7280] font-mono">Tx: {s.tx_hash?.substring(0, 20)}... <span className="text-blue-400/60">(simulated)</span></div>
                  <div className="text-xs text-[#6b7280]">Chain: {s.chain} • Status: {s.status}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {(!taskData?.tasks || taskData.tasks.length === 0) && (
          <div className="text-center text-[#6b7280] py-8">
            <Clock className="w-8 h-8 mx-auto mb-2" />
            <p>No tasks yet. Run a verification to see the audit trail.</p>
          </div>
        )}
      </div>
    </div>
  );
}

{/* Audit trail added by Rohan - tracks all verification jobs for transparency */}
