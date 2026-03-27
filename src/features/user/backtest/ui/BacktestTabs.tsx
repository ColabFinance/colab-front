"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { BacktestTab } from "../types";

export function BacktestTabs({
  value,
  onChange,
}: {
  value: BacktestTab;
  onChange: (v: BacktestTab) => void;
}) {
  const items: { id: BacktestTab; label: string }[] = [
    { id: "setup", label: "Setup" },
    { id: "results", label: "Results" },
    { id: "history", label: "History" },
  ];

  return (
    <div className="border-b border-slate-800">
      <div className="-mb-px flex gap-6">
        {items.map((it) => {
          const active = it.id === value;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => onChange(it.id)}
              className={cn(
                "py-3 px-1 border-b-2 text-sm font-medium transition-colors",
                active
                  ? "border-cyan-500 text-cyan-300"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500"
              )}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}