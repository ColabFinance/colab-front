"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { BacktestSummary } from "../types";

function fmtUsd(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export function SummaryCards({ summary }: { summary: BacktestSummary }) {
  const items = [
    { label: "Episodes", value: String(summary.episodes), tone: "neutral" as const },
    { label: "Bars", value: summary.bars.toLocaleString(), tone: "neutral" as const },
    { label: "Final Equity", value: fmtUsd(summary.finalEquityUsd), tone: "good" as const },
    { label: "Fees Collected", value: fmtUsd(summary.feesCollectedUsd), tone: "cyan" as const },
    { label: "Max Drawdown", value: `${summary.maxDrawdownPct.toFixed(1)}%`, tone: "bad" as const },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((it) => (
        <div key={it.label} className="rounded-lg border border-slate-700 bg-slate-900 p-4">
          <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">{it.label}</div>
          <div
            className={cn(
              "text-xl font-mono font-bold",
              it.tone === "good" && "text-green-300",
              it.tone === "bad" && "text-red-300",
              it.tone === "cyan" && "text-cyan-300",
              it.tone === "neutral" && "text-white"
            )}
          >
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}