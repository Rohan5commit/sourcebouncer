/**
 * SplitAndSettle Component
 *
 * Allows users to split and settle shared expenses within a trip group.
 *
 * FIX #7: The original handleSettle passed splitAmong: [from] (only the payer),
 * which caused splitExpense() to produce zero transactions. This component
 * properly includes ALL group members in splitAmong.
 */

"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Users, DollarSign, Loader2 } from "lucide-react";
import {
  handleSettle,
  type SharedExpense,
  type SettlementTransaction,
} from "@/lib/trip";

interface GroupMember {
  id: string;
  name: string;
  address: string;
}

interface SplitAndSettleProps {
  groupId: string;
  members: GroupMember[];
  onSettled?: (expense: SharedExpense, transactions: SettlementTransaction[]) => void;
}

export function SplitAndSettle({ groupId, members, onSettled }: SplitAndSettleProps) {
  const [selectedPayer, setSelectedPayer] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [settling, setSettling] = useState(false);
  const [result, setResult] = useState<{
    expense: SharedExpense;
    transactions: SettlementTransaction[];
  } | null>(null);

  const handleSettleClick = async () => {
    if (!selectedPayer || !amount || !description) return;

    setSettling(true);

    // Simulate settlement delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // FIX #7: Pass ALL member IDs, not just the payer
    // This ensures splitExpense() processes transactions for everyone except the payer
    const settlement = handleSettle(
      groupId,
      selectedPayer,
      members.map((m) => m.id), // ALL members, not just [selectedPayer]
      parseFloat(amount),
      description
    );

    setResult(settlement);
    setSettling(false);
    onSettled?.(settlement.expense, settlement.transactions);
  };

  const getMemberName = (id: string) => members.find((m) => m.id === id)?.name || id;

  if (result) {
    return (
      <div className="bg-[#12121a] border border-green-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-semibold">Expense Settled</h3>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-[#6b7280]">Description</span>
            <span>{result.expense.description}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6b7280]">Amount</span>
            <span className="text-green-400">${result.expense.amount.toFixed(2)} USDC</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6b7280]">Paid by</span>
            <span>{getMemberName(result.expense.paid_by)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6b7280]">Split among</span>
            <span>{result.expense.split_among.length} members</span>
          </div>
        </div>

        {result.transactions.length > 0 && (
          <div className="border-t border-[#1e293b] pt-4">
            <h4 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider mb-3">
              Settlement Transactions
            </h4>
            <div className="space-y-2">
              {result.transactions.map((tx, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm bg-[#0a0a0f] rounded-lg p-3"
                >
                  <span className="text-red-400">{getMemberName(tx.from_member)}</span>
                  <ArrowRight className="w-4 h-4 text-[#6b7280]" />
                  <span className="text-green-400">{getMemberName(tx.to_member)}</span>
                  <span className="ml-auto font-mono">${tx.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.transactions.length === 0 && (
          <div className="border-t border-[#1e293b] pt-4 text-center text-[#6b7280] text-sm">
            No settlement transactions needed (single member group).
          </div>
        )}

        <button
          onClick={() => setResult(null)}
          className="mt-4 w-full bg-[#1e293b] hover:bg-[#2d3748] text-white py-2 rounded-lg text-sm transition-all"
        >
          Set Another Expense
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-purple-400" />
        <h3 className="text-lg font-semibold">Split & Settle Expense</h3>
      </div>

      {/* Member Selection */}
      <div className="mb-4">
        <label className="block text-sm text-[#6b7280] mb-2">Who paid?</label>
        <div className="grid grid-cols-2 gap-2">
          {members.map((member) => (
            <button
              key={member.id}
              onClick={() => setSelectedPayer(member.id)}
              className={`p-3 rounded-lg border text-left text-sm transition-all ${
                selectedPayer === member.id
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-[#1e293b] hover:border-purple-500/30"
              }`}
            >
              <div className="font-medium">{member.name}</div>
              <div className="text-xs text-[#6b7280] truncate">{member.address}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <label className="block text-sm text-[#6b7280] mb-2">Amount (USDC)</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full bg-[#0a0a0f] border border-[#1e293b] rounded-lg pl-9 pr-4 py-3 text-sm focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm text-[#6b7280] mb-2">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Dinner, Hotel, Taxi"
          className="w-full bg-[#0a0a0f] border border-[#1e293b] rounded-lg px-4 py-3 text-sm focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Split Preview */}
      {selectedPayer && amount && parseFloat(amount) > 0 && (
        <div className="mb-4 p-3 bg-[#0a0a0f] rounded-lg">
          <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-2">
            Split Preview ({members.length} members)
          </p>
          <p className="text-sm">
            Each member pays{" "}
            <span className="font-mono text-purple-400">
              ${(parseFloat(amount) / members.length).toFixed(2)}
            </span>
          </p>
          <p className="text-xs text-[#6b7280] mt-1">
            {getMemberName(selectedPayer)} is owed{" "}
            <span className="text-green-400">
              ${(parseFloat(amount) - parseFloat(amount) / members.length).toFixed(2)}
            </span>
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSettleClick}
        disabled={!selectedPayer || !amount || !description || settling}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
      >
        {settling ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            Settle Expense
          </>
        )}
      </button>
    </div>
  );
}

export default SplitAndSettle;
