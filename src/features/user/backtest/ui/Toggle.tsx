"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950/40 p-3">
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-200">{label}</div>
        {description && <div className="text-xs text-slate-500">{description}</div>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full border transition-colors",
          checked ? "bg-cyan-500/30 border-cyan-500/40" : "bg-slate-800 border-slate-700"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}