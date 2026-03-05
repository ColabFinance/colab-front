import React from "react";
import { Badge } from "@/presentation/components/Badge";

export function PageHeader({
  title,
  subtitle,
  right,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: { label: string; tone?: "cyan" | "blue" | "green" | "amber" | "red" | "slate" };
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
          {badge && <Badge tone={badge.tone ?? "cyan"}>{badge.label}</Badge>}
        </div>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {right && <div className="flex flex-wrap items-center gap-3">{right}</div>}
    </div>
  );
}