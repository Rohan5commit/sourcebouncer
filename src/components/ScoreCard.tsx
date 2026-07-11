"use client";

interface ScoreCardProps {
  label: string;
  value: string | number;
  color?: string;
  className?: string;
}

export function ScoreCard({ label, value, color = "text-white", className }: ScoreCardProps) {
  return (
    <div className={`bg-[#12121a] border border-[#1e293b] rounded-xl p-4 text-center ${className || ""}`}>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-[#6b7280]">{label}</div>
    </div>
  );
}

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

export function ProgressBar({ label, value, max = 100, color = "bg-blue-500" }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div>
      <span className="text-[#6b7280] text-xs">{label}</span>
      <div className="mt-1 h-2 bg-[#1e293b] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
