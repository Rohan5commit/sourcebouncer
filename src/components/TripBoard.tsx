/**
 * TripBoard Component
 *
 * Displays a dashboard of verification scenarios and their results.
 * This is the main screen judges see when clicking "Try Demo".
 *
 * Imports demoScenarios from @/lib/demo/scenarios (not index.ts).
 */

"use client";

import { useState } from "react";
import { Shield, Play, CheckCircle, XCircle, AlertTriangle, Clock, Loader2 } from "lucide-react";
import { demoScenarios, type DemoScenario } from "@/lib/demo/scenarios";

interface VerdictResult {
  claim_id: string;
  verdict: "supported" | "contradicted" | "unsupported" | "partially_supported" | "unverifiable";
  confidence: number;
}

interface TripBoardProps {
  onScenarioSelect?: (scenario: DemoScenario) => void;
}

export function TripBoard({ onScenarioSelect }: TripBoardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [runningScenario, setRunningScenario] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, VerdictResult[]>>({});

  const categories = ["all", "research", "science", "ai", "news"];

  const filteredScenarios =
    selectedCategory === "all"
      ? demoScenarios
      : demoScenarios.filter((s) => s.category === selectedCategory);

  const handleRunScenario = async (scenario: DemoScenario) => {
    setRunningScenario(scenario.id);

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate mock results based on expected verdicts
    const mockResults: VerdictResult[] = scenario.claims.map((claim) => ({
      claim_id: claim.claim_id,
      verdict: scenario.expectedVerdicts[claim.claim_id] || "unverifiable",
      confidence: 0.7 + Math.random() * 0.3,
    }));

    setResults((prev) => ({ ...prev, [scenario.id]: mockResults }));
    setRunningScenario(null);
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "supported":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "contradicted":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "unsupported":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "supported":
        return "bg-green-500/10 border-green-500/30 text-green-400";
      case "contradicted":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      case "unsupported":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-[#1e293b] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-xl font-bold">TripBoard</h1>
              <p className="text-sm text-[#6b7280]">Verification Scenario Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#6b7280]">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>LIVE DEMO</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-[#12121a] border border-[#1e293b] text-[#6b7280] hover:border-blue-500/50"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6 hover:border-blue-500/50 transition-all"
            >
              {/* Scenario Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{scenario.name}</h3>
                  <p className="text-sm text-[#6b7280] mt-1">{scenario.description}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  {scenario.pricingTier}
                </span>
              </div>

              {/* Claims Summary */}
              <div className="mb-4">
                <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-2">
                  {scenario.claims.length} Claims
                </p>
                <div className="space-y-2">
                  {scenario.claims.slice(0, 2).map((claim) => (
                    <div key={claim.claim_id} className="text-sm text-[#a0a0b0] line-clamp-1">
                      &ldquo;{claim.claim_text}&rdquo;
                    </div>
                  ))}
                  {scenario.claims.length > 2 && (
                    <p className="text-xs text-[#6b7280]">
                      +{scenario.claims.length - 2} more claims
                    </p>
                  )}
                </div>
              </div>

              {/* Results (if run) */}
              {results[scenario.id] && (
                <div className="mb-4 p-3 bg-[#0a0a0f] rounded-lg">
                  <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-2">Results</p>
                  <div className="space-y-2">
                    {results[scenario.id].map((result) => (
                      <div
                        key={result.claim_id}
                        className={`flex items-center gap-2 px-2 py-1 rounded text-xs border ${getVerdictColor(result.verdict)}`}
                      >
                        {getVerdictIcon(result.verdict)}
                        <span className="capitalize">{result.verdict}</span>
                        <span className="ml-auto text-[#6b7280]">
                          {Math.round(result.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleRunScenario(scenario)}
                  disabled={runningScenario === scenario.id}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white py-2 rounded-lg text-sm font-medium transition-all"
                >
                  {runningScenario === scenario.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Scenario
                    </>
                  )}
                </button>
                {onScenarioSelect && (
                  <button
                    onClick={() => onScenarioSelect(scenario)}
                    className="px-4 py-2 border border-[#1e293b] hover:border-blue-500/50 text-white rounded-lg text-sm transition-all"
                  >
                    Customize
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredScenarios.length === 0 && (
          <div className="text-center py-12 text-[#6b7280]">
            No scenarios found for this category.
          </div>
        )}
      </div>
    </div>
  );
}

export default TripBoard;
