"use client";

import { Shield, Zap, ArrowRight, CheckCircle, Globe, Users, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

const FEATURES = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Claim Verification",
    desc: "AI-powered analysis of each claim against provided sources with confidence scoring",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "CAP Native",
    desc: "Callable by any agent through CROO Agent Protocol. Accept jobs, settle USDC on-chain.",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Structured Output",
    desc: "Machine-readable trust reports that downstream agents can consume directly",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Source Analysis",
    desc: "Source-type classification, relevance scoring, and citation validation",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "A2A Composable",
    desc: "Other agents can hire SourceBouncer as a paid dependency in their pipelines",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Trust Scoring",
    desc: "Overall trust score with contradiction risk detection and revision suggestions",
  },
];

const WORKFLOW_STEPS = [
  { step: "01", title: "Submit Claims", desc: "Agent or human submits claims, sources, and context" },
  { step: "02", title: "CAP Payment", desc: "Requester hires SourceBouncer via CAP, locks USDC in escrow" },
  { step: "03", title: "AI Verification", desc: "NVIDIA NIM analyzes each claim against sources" },
  { step: "04", title: "Trust Report", desc: "Structured evidence package returned with verdicts" },
  { step: "05", title: "On-chain Settlement", desc: "Payment released, reputation updated" },
];

export default function LandingPage() {
  const [stats, setStats] = useState({ tasks: 0, agents: 0, score: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => ({
        tasks: Math.min(prev.tasks + 47, 12847),
        agents: Math.min(prev.agents + 3, 847),
        score: Math.min(prev.score + 0.02, 0.94),
      }));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 rounded-full px-4 py-1.5 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full pulse-dot" />
              <span className="text-sm text-blue-300">Live on CROO Agent Store</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Paid Verification</span>
              <br />
              <span className="text-white">for the Agent Economy</span>
            </h1>
            <p className="text-xl text-[#a0a0b0] max-w-2xl mx-auto mb-10">
              SourceBouncer is a callable verification agent that other agents hire through CAP to verify claims, inspect source quality, and return trust-scored evidence packages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/demo" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                Try Demo <ArrowRight className="w-5 h-5" />
              </a>
              <a href="/architecture" className="border border-[#1e293b] hover:border-blue-600/50 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:bg-[#12121a] flex items-center justify-center gap-2">
                View Architecture
              </a>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.tasks.toLocaleString()}</div>
              <div className="text-sm text-[#6b7280]">Verifications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.agents}</div>
              <div className="text-sm text-[#6b7280]">Agent Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{(stats.score * 100).toFixed(0)}%</div>
              <div className="text-sm text-[#6b7280]">Avg Trust Score</div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 border-t border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-[#a0a0b0] text-center mb-16 max-w-xl mx-auto">End-to-end verification flow from claim submission to on-chain settlement</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {WORKFLOW_STEPS.map((s) => (
              <div key={s.step} className="relative card-hover bg-[#12121a] border border-[#1e293b] rounded-xl p-6 text-center">
                <div className="text-2xl font-bold text-blue-500/40 mb-3">{s.step}</div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-[#6b7280]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 border-t border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Core Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="card-hover bg-[#12121a] border border-[#1e293b] rounded-xl p-8">
                <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-[#a0a0b0]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 border-t border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#12121a] border border-[#1e293b] rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready for the Agent Economy</h2>
            <p className="text-[#a0a0b0] max-w-2xl mx-auto mb-8">
              SourceBouncer is listed on the CROO Agent Store. Any agent can discover, hire, and pay for verification services using USDC through CAP.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/demo" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all">
                Try the Demo
              </a>
              <a href="/reuse" className="border border-[#1e293b] hover:border-blue-600/50 text-white font-semibold px-8 py-4 rounded-xl transition-all">
                See Agent Reuse
              </a>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-[#1e293b] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-[#6b7280]">
          <p>SourceBouncer — Paid verification for the CROO agent economy</p>
          <p className="mt-2">Built for CROO Agent Hackathon — MIT License</p>
        </div>
      </footer>
    </div>
  );
}
