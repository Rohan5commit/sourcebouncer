import { SettlementRecord } from "@/lib/schemas";
import { v4 as uuidv4 } from "uuid";

const settlements: Map<string, SettlementRecord> = new Map();

export function recordSettlement(data: Omit<SettlementRecord, "settlement_id">): SettlementRecord {
  const settlement: SettlementRecord = {
    ...data,
    settlement_id: uuidv4(),
  };
  settlements.set(settlement.settlement_id, settlement);
  return settlement;
}

export function getSettlement(id: string): SettlementRecord | undefined {
  return settlements.get(id);
}

export function getSettlementsByInvocation(invocationId: string): SettlementRecord[] {
  return Array.from(settlements.values()).filter(s => s.invocation_id === invocationId);
}

export function getAllSettlements(): SettlementRecord[] {
  return Array.from(settlements.values());
}
