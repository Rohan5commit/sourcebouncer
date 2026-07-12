import { describe, it, expect, beforeEach } from "vitest";
import {
  createTask,
  getTask,
  updateTask,
  getAllTasks,
  createReport,
  getReport,
  getReportByTaskId,
  getAllReports,
  createDownstreamAction,
  getDownstreamActionsByReport,
  getAllDownstreamActions,
  addQAEntry,
  getQAHistory,
  initializeDemoData,
} from "@/lib/store";
import { VerificationTask, TrustReport, DownstreamAgentAction } from "@/lib/schemas";

// Reset the store between tests by reimporting (the store uses module-level state).
// Since vitest caches modules, we use initializeDemoData carefully.

describe("Task store operations", () => {
  const mockTask: VerificationTask = {
    task_id: "test-task-001",
    requester_id: "test-agent",
    claims: [{ claim_id: "c1", claim_text: "Test claim" }],
    pricing_tier: "quick",
    created_at: new Date().toISOString(),
    status: "pending",
  };

  it("creates and retrieves a task", () => {
    const created = createTask(mockTask);
    expect(created.task_id).toBe("test-task-001");
    const retrieved = getTask("test-task-001");
    expect(retrieved).toBeDefined();
    expect(retrieved!.requester_id).toBe("test-agent");
  });

  it("returns undefined for nonexistent task", () => {
    const result = getTask("nonexistent-id");
    expect(result).toBeUndefined();
  });

  it("updates a task", () => {
    const updated = updateTask("test-task-001", { status: "processing" });
    expect(updated).toBeDefined();
    expect(updated!.status).toBe("processing");
    const retrieved = getTask("test-task-001");
    expect(retrieved!.status).toBe("processing");
  });

  it("returns undefined when updating nonexistent task", () => {
    const result = updateTask("nonexistent-id", { status: "completed" });
    expect(result).toBeUndefined();
  });

  it("lists all tasks", () => {
    const allTasks = getAllTasks();
    expect(allTasks.length).toBeGreaterThanOrEqual(1);
    expect(allTasks.some((t) => t.task_id === "test-task-001")).toBe(true);
  });
});

describe("Report store operations", () => {
  const mockReport: TrustReport = {
    report_id: "test-report-001",
    task_id: "test-task-001",
    claim_verdicts: [],
    overall_trust_score: 0.85,
    overall_report_summary: "Test summary.",
    citation_presence_score: 0.9,
    source_relevance_score: 0.88,
    contradiction_risk: 0.1,
    unsupported_ratio: 0.05,
    completed_at: new Date().toISOString(),
  };

  it("creates and retrieves a report", () => {
    const created = createReport(mockReport);
    expect(created.report_id).toBe("test-report-001");
    const retrieved = getReport("test-report-001");
    expect(retrieved).toBeDefined();
    expect(retrieved!.overall_trust_score).toBe(0.85);
  });

  it("finds report by task_id", () => {
    const found = getReportByTaskId("test-task-001");
    expect(found).toBeDefined();
    expect(found!.report_id).toBe("test-report-001");
  });

  it("returns undefined for nonexistent report", () => {
    expect(getReport("nonexistent")).toBeUndefined();
    expect(getReportByTaskId("nonexistent")).toBeUndefined();
  });

  it("lists all reports", () => {
    const all = getAllReports();
    expect(all.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Downstream action store", () => {
  const mockAction: DownstreamAgentAction = {
    action_id: "test-action-001",
    report_id: "test-report-001",
    agent_name: "Test Agent",
    agent_type: "content-editor",
    action_taken: "revise",
    reasoning: "Need to revise.",
    timestamp: new Date().toISOString(),
  };

  it("creates and retrieves downstream actions by report", () => {
    createDownstreamAction(mockAction);
    const actions = getDownstreamActionsByReport("test-report-001");
    expect(actions.length).toBeGreaterThanOrEqual(1);
    expect(actions.some((a) => a.action_id === "test-action-001")).toBe(true);
  });

  it("returns empty array for report with no actions", () => {
    const actions = getDownstreamActionsByReport("no-actions-report");
    expect(actions).toHaveLength(0);
  });

  it("lists all downstream actions", () => {
    const all = getAllDownstreamActions();
    expect(all.length).toBeGreaterThanOrEqual(1);
  });
});

describe("QA history", () => {
  it("adds and retrieves QA entries", () => {
    addQAEntry("test-report-001", "Is claim A supported?", "Yes, it is supported.");
    addQAEntry("test-report-001", "What about claim B?", "Claim B is contradicted.");
    const history = getQAHistory("test-report-001");
    expect(history.length).toBeGreaterThanOrEqual(2);
    expect(history[0].question).toBe("Is claim A supported?");
    expect(history[0].answer).toBe("Yes, it is supported.");
  });

  it("returns empty array for report with no QA history", () => {
    const history = getQAHistory("no-qa-report");
    expect(history).toHaveLength(0);
  });

  it("each QA entry has a timestamp", () => {
    const history = getQAHistory("test-report-001");
    for (const entry of history) {
      expect(entry.timestamp).toBeDefined();
      expect(new Date(entry.timestamp).getTime()).toBeGreaterThan(0);
    }
  });
});

describe("Demo data initialization", () => {
  it("initializes demo data without error", () => {
    expect(() => initializeDemoData()).not.toThrow();
  });

  it("demo data includes at least one task", () => {
    const allTasks = getAllTasks();
    expect(allTasks.length).toBeGreaterThanOrEqual(1);
  });

  it("demo data includes at least one report", () => {
    const allReports = getAllReports();
    expect(allReports.length).toBeGreaterThanOrEqual(1);
  });

  it("demo report has claim verdicts", () => {
    const reports = getAllReports();
    const demoReport = reports.find((r) => r.claim_verdicts.length > 0);
    expect(demoReport).toBeDefined();
    expect(demoReport!.claim_verdicts.length).toBeGreaterThan(0);
  });
});
