"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";

export function ConfigFieldRow({
  label,
  currentLabel = "Current Value",
  currentValue,
  right,
  className,
}: {
  label: string;
  currentLabel?: string;
  currentValue: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </label>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1 rounded-lg border border-slate-700 bg-slate-950/50 p-3">
          <div className="text-[10px] text-slate-500 mb-1">{currentLabel}</div>
          <div className="text-sm text-slate-200">{currentValue}</div>
        </div>

        <div className="hidden md:block text-slate-600">→</div>

        <div className="flex-1">{right}</div>
      </div>
    </div>
  );
}