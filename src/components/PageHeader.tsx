"use client";

import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

export function PageHeader({ icon: Icon, title, subtitle }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Icon className="w-8 h-8 text-blue-400" />
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-[#6b7280]">{subtitle}</p>}
      </div>
    </div>
  );
}
