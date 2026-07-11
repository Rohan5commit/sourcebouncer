import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { VerificationTaskSchema } from "@/lib/schemas";
import {
  createTask,
  updateTask,
  createReport,
  initializeDemoData,
} from "@/lib/store";
import {
  createInvocation,
  escrowFunds,
  completeAndSettle,
  getTierById,
} from "@/lib/cap/provider";
import { runVerification } from "@/lib/verification/engine";

// Ensure demo data is loaded
initializeDemoData();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = VerificationTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid task data", details: parsed.error.issues }, { status: 400 });
    }

    const task = parsed.data;
    
    // Create and store task
    const created = createTask({ ...task, status: "processing" });

    // Get pricing tier
    const tier = getTierById(task.pricing_tier);
    if (!tier) {
      return NextResponse.json({ error: "Invalid pricing tier" }, { status: 400 });
    }

    // CAP: Create invocation and escrow funds
    const invocation = createInvocation(task.task_id, task.requester_id, tier);
    escrowFunds(invocation.invocation_id);

    // Run verification
    const report = await runVerification(created);
    createReport(report);

    // CAP: Complete and settle payment
    const { settlement } = completeAndSettle(invocation.invocation_id, report);

    // Update task status
    updateTask(task.task_id, { status: "completed" });

    return NextResponse.json({
      success: true,
      task: created,
      report,
      invocation,
      settlement,
    });
  } catch (error) {
    console.error("Verification failed:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: "SourceBouncer Verification API",
    status: "operational",
    endpoints: {
      POST: "/api/verify - Submit verification task",
      GET: "/api/verify - List all tasks",
    },
  });
}
