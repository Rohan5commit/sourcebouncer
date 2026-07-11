import { NextResponse } from "next/server";
import { getAllTasks, getAllReports, initializeDemoData } from "@/lib/store";

initializeDemoData();

export async function GET() {
  const tasks = getAllTasks();
  const reports = getAllReports();
  return NextResponse.json({ tasks, reports });
}
