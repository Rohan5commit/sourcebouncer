/**
 * Trip Fund Module
 *
 * Manages shared expenses and fund balances for trip groups.
 *
 * FIX #7: handleSettle now properly includes ALL group members in splitAmong,
 *         not just the payer. Previously splitAmong: [from] caused splitExpense()
 *         to skip the only member (since from === paidBy), silently no-opping.
 *
 * FIX #8: calculateFundBalance logic was inverted (always returned negative).
 *         Now correctly sums: positive for unsettled expenses (money owed),
 *         zero for settled expenses (already paid).
 */

import { v4 as uuidv4 } from "uuid";

/**
 * A shared expense within a trip group.
 */
export interface SharedExpense {
  /** Unique expense identifier */
  expense_id: string;

  /** ID of the trip group this expense belongs to */
  group_id: string;

  /** Description of the expense */
  description: string;

  /** Total amount of the expense */
  amount: number;

  /** ID of the member who paid for this expense */
  paid_by: string;

  /**
   * IDs of all members this expense is split among.
   *
   * FIX #7: This MUST include ALL group members, not just the payer.
   * If splitAmong only contains the payer, splitExpense() will skip
   * the only member (since memberId === paidBy), resulting in zero
   * transactions being processed.
   */
  split_among: string[];

  /** Whether this expense has been settled via on-chain payment */
  settled: boolean;

  /** Transaction hash if settled on-chain */
  settlement_tx?: string;

  /** Timestamp when the expense was created */
  created_at: string;

  /** Timestamp when the expense was settled (if applicable) */
  settled_at?: string;
}

/**
 * A pending settlement transaction between two members.
 */
export interface SettlementTransaction {
  /** Member who owes money */
  from_member: string;

  /** Member who is owed money */
  to_member: string;

  /** Amount to settle */
  amount: number;

  /** Whether this transaction has been completed */
  completed: boolean;
}

/**
 * Calculate the remaining fund balance from a list of shared expenses.
 *
 * FIX #8: The original implementation had inverted logic:
 *   - It subtracted unsettled amounts from 0, always returning negative
 *   - It ignored settled amounts entirely
 *
 * Correct logic:
 *   - Unsettled expenses represent money the group has spent but not yet settled
 *   - The fund balance should reflect how much is "owed back" to the group
 *   - Positive balance = group has surplus, negative = group is in deficit
 *
 * @param expenses - List of shared expenses in the group
 * @returns The fund balance (positive = surplus, negative = deficit)
 */
export function calculateFundBalance(expenses: SharedExpense[]): number {
  return expenses.reduce((sum, exp) => {
    // Each member's share of the expense
    const perPersonShare = exp.amount / Math.max(exp.split_among.length, 1);

    if (!exp.settled) {
      // For unsettled expenses, the payer is owed (perPersonShare * (splitAmong.length - 1))
      // because everyone else owes their share to the payer
      return sum + (exp.amount - perPersonShare);
    }
    // Settled expenses don't affect the balance
    return sum;
  }, 0);
}

/**
 * Calculate each member's share of an expense.
 *
 * @param expense - The expense to calculate splits for
 * @returns Map of member ID to amount they owe
 */
export function calculateSplit(expense: SharedExpense): Map<string, number> {
  const splits = new Map<string, number>();
  const perPersonShare = expense.amount / Math.max(expense.split_among.length, 1);

  for (const memberId of expense.split_among) {
    if (memberId !== expense.paid_by) {
      // Members who didn't pay owe their share to the payer
      splits.set(memberId, perPersonShare);
    }
    // The payer doesn't owe themselves anything
  }

  return splits;
}

/**
 * Split an expense and generate settlement transactions.
 *
 * FIX #7: This function iterates over expense.split_among and SKIPS
 * any member where memberId === expense.paid_by (the payer doesn't owe
 * themselves). If splitAmong only contained the payer, the loop would
 * skip the only member and produce zero transactions.
 *
 * Now properly handles the case where splitAmong includes all group members.
 *
 * @param expense - The expense to split
 * @returns Array of settlement transactions to process
 */
export function splitExpense(expense: SharedExpense): SettlementTransaction[] {
  const transactions: SettlementTransaction[] = [];
  const perPersonShare = expense.amount / Math.max(expense.split_among.length, 1);

  for (const memberId of expense.split_among) {
    // Skip the payer - they don't owe themselves money
    if (memberId === expense.paid_by) continue;

    transactions.push({
      from_member: memberId,
      to_member: expense.paid_by,
      amount: perPersonShare,
      completed: false,
    });
  }

  return transactions;
}

/**
 * Handle the settlement of a shared expense.
 *
 * FIX #7: The original handleSettle passed splitAmong: [from] (only the payer),
 * which caused splitExpense() to produce zero transactions. Now properly includes
 * ALL group members in splitAmong before calling splitExpense().
 *
 * @param groupId - The trip group identifier
 * @param payerId - The member who paid for the expense
 * @param memberIds - ALL member IDs in the group (including the payer)
 * @param amount - The expense amount
 * @param description - Description of the expense
 * @returns The created SharedExpense with settlement transactions
 */
export function handleSettle(
  groupId: string,
  payerId: string,
  memberIds: string[],
  amount: number,
  description: string
): { expense: SharedExpense; transactions: SettlementTransaction[] } {
  // FIX #7: Include ALL group members in splitAmong, not just the payer
  // This ensures splitExpense() processes transactions for everyone except the payer
  const expense: SharedExpense = {
    expense_id: uuidv4(),
    group_id: groupId,
    description,
    amount,
    paid_by: payerId,
    split_among: memberIds, // ALL members, not just [payerId]
    settled: false,
    created_at: new Date().toISOString(),
  };

  const transactions = splitExpense(expense);

  return { expense, transactions };
}

/**
 * Mark an expense as settled and record the settlement transaction.
 */
export function markSettled(
  expense: SharedExpense,
  txHash: string
): SharedExpense {
  return {
    ...expense,
    settled: true,
    settlement_tx: txHash,
    settled_at: new Date().toISOString(),
  };
}
