"use client";

import { cn } from "@/lib/utils";

interface VerdictBadgeProps {
  verdict: string;
  className?: string;
}

const verdictStyles: Record<string, string> = {
  supported: "bg-green-500/10 text-green-400 border-green-500/20",
  partially_supported: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  unsupported: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  contradicted: "bg-red-500/10 text-red-400 border-red-500/20",
  unverifiable: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export function VerdictBadge({ verdict, className }: VerdictBadgeProps) {
  return (
    <span className={cn(
      "text-sm font-medium px-3 py-1 rounded-full border",
      verdictStyles[verdict] || verdictStyles.unverifiable,
      className
    )}>
      {verdict.replace(/_/g, " ")}
    </span>
  );
}
