"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";

export function ChartPlaceholder({
  title,
  height = 260,
  subtitle,
}: {
  title: string;
  subtitle?: string;
  height?: number;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-white uppercase tracking-wide">{title}</div>
          {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
        </div>
        <div className="text-[10px] text-slate-500">mock</div>
      </div>

      <div
        className={cn("relative", "bg-[radial-gradient(circle_at_30%_0%,rgba(34,211,238,0.12),transparent_45%)]")}
        style={{ height }}
      >
        <div className="absolute inset-0 opacity-40 [background-size:28px_28px] [background-image:linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)]" />
        <svg className="absolute inset-0" viewBox="0 0 600 240" preserveAspectRatio="none">
          <path
            d="M0,190 C60,175 120,210 180,165 C240,120 300,150 360,110 C420,70 480,120 540,85 C570,70 585,65 600,60 L600,240 L0,240 Z"
            fill="rgba(34,211,238,0.14)"
          />
          <path
            d="M0,190 C60,175 120,210 180,165 C240,120 300,150 360,110 C420,70 480,120 540,85 C570,70 585,65 600,60"
            fill="none"
            stroke="rgba(34,211,238,0.7)"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}