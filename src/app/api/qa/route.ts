import { NextRequest, NextResponse } from "next/server";
import { getReport, addQAEntry, getQAHistory, initializeDemoData } from "@/lib/store";
import { answerSourceQuestion } from "@/lib/ai/nvidia-nim";

initializeDemoData();

export async function POST(request: NextRequest) {
  try {
    const { question, report_id } = await request.json();
    if (!question || !report_id) {
      return NextResponse.json({ error: "question and report_id required" }, { status: 400 });
    }
    const report = getReport(report_id);
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    const answer = await answerSourceQuestion(
      question,
      report.overall_report_summary,
      report.claim_verdicts.map((v) => ({ claim_text: v.claim_text, verdict: v.verdict, reasoning: v.reasoning }))
    );
    addQAEntry(report_id, question, answer);
    return NextResponse.json({ question, answer, report_id });
  } catch (error) {
    return NextResponse.json({ error: "QA failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get("report_id");
  if (!reportId) {
    return NextResponse.json({ error: "report_id required" }, { status: 400 });
  }
  return NextResponse.json({ history: getQAHistory(reportId) });
}
