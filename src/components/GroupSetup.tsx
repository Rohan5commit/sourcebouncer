/**
 * GroupSetup Component
 *
 * Allows users to configure and group verification scenarios.
 * Imports demoScenarios from @/lib/demo/scenarios for available scenarios.
 */

"use client";

import { useState } from "react";
import { Users, Plus, Trash2, ArrowRight, Shield } from "lucide-react";
import { demoScenarios, type DemoScenario } from "@/lib/demo/scenarios";

interface GroupConfig {
  name: string;
  scenarios: string[];
  autoVerify: boolean;
}

interface GroupSetupProps {
  onGroupCreated?: (group: GroupConfig) => void;
}

export function GroupSetup({ onGroupCreated }: GroupSetupProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [autoVerify, setAutoVerify] = useState(true);
  const [step, setStep] = useState<"select" | "configure" | "confirm">("select");

  const toggleScenario = (id: string) => {
    setSelectedScenarios((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = () => {
    const group: GroupConfig = {
      name: groupName || `Group ${Date.now()}`,
      scenarios: selectedScenarios,
      autoVerify,
    };
    onGroupCreated?.(group);
    setStep("confirm");
  };

  const selectedScenarioDetails = demoScenarios.filter((s) =>
    selectedScenarios.includes(s.id)
  );

  const totalClaims = selectedScenarioDetails.reduce(
    (sum, s) => sum + s.claims.length,
    0
  );

  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="bg-[#12121a] border border-green-500/30 rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Group Created!</h2>
          <p className="text-[#6b7280] mb-6">
            Your verification group &ldquo;{groupName || "Default Group"}&rdquo; with{" "}
            {selectedScenarios.length} scenarios ({totalClaims} claims) is ready.
          </p>
          <button
            onClick={() => {
              setStep("select");
              setSelectedScenarios([]);
              setGroupName("");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
          >
            Create Another Group
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-[#1e293b] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Users className="w-8 h-8 text-purple-500" />
          <div>
            <h1 className="text-xl font-bold">Group Setup</h1>
            <p className="text-sm text-[#6b7280]">
              Configure a batch of verification scenarios
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div
            className={`flex items-center gap-2 ${
              step === "select" ? "text-blue-400" : "text-[#6b7280]"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === "select"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1e293b] text-[#6b7280]"
              }`}
            >
              1
            </div>
            <span className="text-sm">Select Scenarios</span>
          </div>
          <div className="w-12 h-px bg-[#1e293b]" />
          <div
            className={`flex items-center gap-2 ${
              step === "configure" ? "text-blue-400" : "text-[#6b7280]"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === "configure"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1e293b] text-[#6b7280]"
              }`}
            >
              2
            </div>
            <span className="text-sm">Configure</span>
          </div>
        </div>

        {step === "select" && (
          <>
            {/* Scenario Selection */}
            <h2 className="text-lg font-semibold mb-4">Select Scenarios to Include</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {demoScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => toggleScenario(scenario.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    selectedScenarios.includes(scenario.id)
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-[#1e293b] hover:border-purple-500/30 bg-[#12121a]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{scenario.name}</h3>
                      <p className="text-sm text-[#6b7280] mt-1">{scenario.description}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedScenarios.includes(scenario.id)
                          ? "border-purple-500 bg-purple-500"
                          : "border-[#6b7280]"
                      }`}
                    >
                      {selectedScenarios.includes(scenario.id) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <span className="px-2 py-0.5 text-xs rounded bg-[#1e293b] text-[#6b7280]">
                      {scenario.claims.length} claims
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded bg-[#1e293b] text-[#6b7280]">
                      {scenario.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {selectedScenarios.length > 0 && (
              <button
                onClick={() => setStep("configure")}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all mx-auto"
              >
                Continue ({selectedScenarios.length} selected)
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </>
        )}

        {step === "configure" && (
          <>
            {/* Group Configuration */}
            <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Group Configuration</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#6b7280] mb-2">Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="My Verification Group"
                    className="w-full bg-[#0a0a0f] border border-[#1e293b] rounded-lg px-4 py-3 text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-verify on submission</p>
                    <p className="text-sm text-[#6b7280]">
                      Automatically run verification when scenarios are added
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoVerify(!autoVerify)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      autoVerify ? "bg-purple-600" : "bg-[#1e293b]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        autoVerify ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6 mb-6">
              <h3 className="font-semibold mb-3">Group Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    {selectedScenarios.length}
                  </div>
                  <div className="text-sm text-[#6b7280]">Scenarios</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{totalClaims}</div>
                  <div className="text-sm text-[#6b7280]">Total Claims</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {selectedScenarioDetails.filter((s) => s.pricingTier === "deep").length}
                  </div>
                  <div className="text-sm text-[#6b7280]">Deep Analysis</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setStep("select")}
                className="px-6 py-3 border border-[#1e293b] hover:border-purple-500/50 text-white rounded-xl font-medium transition-all"
              >
                Back
              </button>
              <button
                onClick={handleCreateGroup}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
              >
                <Plus className="w-4 h-4" />
                Create Group
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GroupSetup;
