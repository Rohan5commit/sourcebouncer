import { v4 as uuidv4 } from "uuid";
import {
  VerificationTask,
  TrustReport,
  DownstreamAgentAction,
} from "@/lib/schemas";

// In-memory store with persistent demo data
let tasks: Map<string, VerificationTask> = new Map();
let reports: Map<string, TrustReport> = new Map();
let downstreamActions: Map<string, DownstreamAgentAction> = new Map();
let qaHistory: Map<string, { question: string; answer: string; report_id: string; timestamp: string }[]> = new Map();

let initialized = false;

export function createTask(task: VerificationTask): VerificationTask {
  tasks.set(task.task_id, task);
  return task;
}

export function getTask(taskId: string): VerificationTask | undefined {
  return tasks.get(taskId);
}

export function updateTask(taskId: string, updates: Partial<VerificationTask>): VerificationTask | undefined {
  const task = tasks.get(taskId);
  if (!task) return undefined;
  const updated = { ...task, ...updates };
  tasks.set(taskId, updated);
  return updated;
}

export function getAllTasks(): VerificationTask[] {
  return Array.from(tasks.values());
}

export function createReport(report: TrustReport): TrustReport {
  reports.set(report.report_id, report);
  return report;
}

export function getReport(reportId: string): TrustReport | undefined {
  return reports.get(reportId);
}

export function getReportByTaskId(taskId: string): TrustReport | undefined {
  return Array.from(reports.values()).find((r) => r.task_id === taskId);
}

export function getAllReports(): TrustReport[] {
  return Array.from(reports.values());
}

export function createDownstreamAction(action: DownstreamAgentAction): DownstreamAgentAction {
  downstreamActions.set(action.action_id, action);
  return action;
}

export function getDownstreamActionsByReport(reportId: string): DownstreamAgentAction[] {
  return Array.from(downstreamActions.values()).filter((a) => a.report_id === reportId);
}

export function getAllDownstreamActions(): DownstreamAgentAction[] {
  return Array.from(downstreamActions.values());
}

export function addQAEntry(reportId: string, question: string, answer: string): void {
  const entries = qaHistory.get(reportId) || [];
  entries.push({ question, answer, report_id: reportId, timestamp: new Date().toISOString() });
  qaHistory.set(reportId, entries);
}

export function getQAHistory(reportId: string) {
  return qaHistory.get(reportId) || [];
}

export function initializeDemoData(): void {
  if (initialized) return;
  initialized = true;

  const demoTaskId = uuidv4();
  const demoTask: VerificationTask = {
    task_id: demoTaskId,
    requester_id: "demo-agent-001",
    claims: [
      { claim_id: "c1", claim_text: "Bitcoin was created by Satoshi Nakamoto in 2009", context: "Historical claim about cryptocurrency origins" },
      { claim_id: "c2", claim_text: "The Earth is flat and does not rotate", context: "Pseudoscientific claim" },
      { claim_id: "c3", claim_text: "OpenAI released GPT-4 in March 2023", context: "AI industry timeline claim" },
    ],
    sources: [
      { source_id: "s1", title: "Bitcoin Whitepaper", content: "Bitcoin: A Peer-to-Peer Electronic Cash System was published by Satoshi Nakamoto in 2008. The network went live in January 2009.", source_type: "academic" },
      { source_id: "s2", title: "NASA Earth Science", content: "Earth is an oblate spheroid that rotates on its axis, completing one rotation approximately every 24 hours.", source_type: "government" },
      { source_id: "s3", title: "OpenAI GPT-4 Announcement", content: "OpenAI announced GPT-4 on March 14, 2023. It is a multimodal large language model.", source_type: "industry" },
    ],
    pricing_tier: "deep",
    created_at: new Date(Date.now() - 300000).toISOString(),
    status: "completed",
  };
  tasks.set(demoTaskId, demoTask);

  const demoReport: TrustReport = {
    report_id: uuidv4(),
    task_id: demoTaskId,
    claim_verdicts: [
      {
        claim_id: "c1",
        claim_text: "Bitcoin was created by Satoshi Nakamoto in 2009",
        verdict: "supported",
        supporting_sources: [{ source_id: "s1", relevance_score: 0.95, supports_claim: true, excerpt: "published by Satoshi Nakamoto... network went live in January 2009" }],
        conflicting_sources: [],
        evidence_strength: 0.95,
        confidence: 0.95,
        reasoning: "Multiple authoritative sources confirm Satoshi Nakamoto published the Bitcoin whitepaper and launched the network in 2009.",
      },
      {
        claim_id: "c2",
        claim_text: "The Earth is flat and does not rotate",
        verdict: "contradicted",
        supporting_sources: [],
        conflicting_sources: [{ source_id: "s2", relevance_score: 0.98, supports_claim: false, excerpt: "Earth is an oblate spheroid that rotates on its axis" }],
        evidence_strength: 0.98,
        confidence: 0.98,
        reasoning: "Scientific evidence overwhelmingly confirms Earth is a rotating oblate spheroid.",
        revision_suggestion: "Remove this claim entirely. It contradicts established scientific fact.",
      },
      {
        claim_id: "c3",
        claim_text: "OpenAI released GPT-4 in March 2023",
        verdict: "supported",
        supporting_sources: [{ source_id: "s3", relevance_score: 0.99, supports_claim: true, excerpt: "OpenAI announced GPT-4 on March 14, 2023" }],
        conflicting_sources: [],
        evidence_strength: 0.99,
        confidence: 0.99,
        reasoning: "Official OpenAI announcement confirms the March 2023 release date.",
      },
    ],
    overall_trust_score: 0.74,
    overall_report_summary: "Two of three claims are well-supported by authoritative sources. One claim (Earth is flat) is definitively contradicted by scientific evidence and should be removed or corrected.",
    citation_presence_score: 1.0,
    source_relevance_score: 0.97,
    contradiction_risk: 0.33,
    unsupported_ratio: 0.0,
    completed_at: new Date(Date.now() - 240000).toISOString(),
  };
  reports.set(demoReport.report_id, demoReport);

  const demoAction: DownstreamAgentAction = {
    action_id: uuidv4(),
    report_id: demoReport.report_id,
    agent_name: "ResearchBrief Agent",
    agent_type: "content-editor",
    action_taken: "revise",
    reasoning: "One claim contradicted by evidence. Brief revised to remove unsupported statement.",
    timestamp: new Date(Date.now() - 180000).toISOString(),
  };
  downstreamActions.set(demoAction.action_id, demoAction);
}
