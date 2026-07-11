"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [reportId, setReportId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chat, setChat] = useState<{ q: string; a: string }[]>([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((d) => {
        if (d.reports?.length > 0) setReportId(d.reports[0].report_id);
      })
      .catch(() => setError("Failed to load reports"));
  }, []);

  const handleSubmit = async () => {
    if (!question.trim() || !reportId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, report_id: reportId }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setChat((prev) => [...prev, { q: question, a: data.answer }]);
        setQuestion("");
      }
    } catch {
      setError("Failed to get answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "Why was any claim marked as unsupported?",
    "Which sources conflict with each other?",
    "Why is the trust score not higher?",
    "What should the requesting agent change?",
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <PageHeader icon={MessageSquare} title="Ask SourceBouncer" subtitle="Get grounded answers about verification results" />

      {!reportId && !error && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-8 text-yellow-300 text-sm">
          Loading reports...
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 text-red-300 text-sm">
          {error}
        </div>
      )}

      {reportId && (
        <div className="flex flex-wrap gap-2 mb-6">
          {suggestedQuestions.map((q, i) => (
            <button key={i} onClick={() => setQuestion(q)} className="text-xs bg-[#12121a] border border-[#1e293b] hover:border-blue-500/30 text-[#a0a0b0] hover:text-white px-3 py-1.5 rounded-full transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="bg-[#12121a] border border-[#1e293b] rounded-xl p-6 mb-6 min-h-[200px] max-h-[400px] overflow-y-auto">
        {chat.length === 0 && !error && (
          <div className="text-center text-[#6b7280] py-8">
            Ask a question about the verification results above.
          </div>
        )}
        {chat.map((c, i) => (
          <div key={i} className="mb-4 last:mb-0">
            <div className="text-sm text-blue-400 mb-1">Q: {c.q}</div>
            <div className="text-sm text-[#a0a0b0]">A: {c.a}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Why was this claim marked weak?"
          className="flex-1 bg-[#0a0a0f] border border-[#1e293b] rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
          disabled={!reportId || loading}
        />
        <button
          onClick={handleSubmit}
          disabled={!question.trim() || loading || !reportId}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-6 py-3 rounded-xl transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
