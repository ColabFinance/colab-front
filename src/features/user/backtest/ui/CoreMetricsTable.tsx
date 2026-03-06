"use client";

import React from "react";
import { Surface, SurfaceHeader } from "@/presentation/components/Surface";
import { BacktestCoreMetrics } from "../types";

export function CoreMetricsTable({
  metrics,
}: {
  metrics: BacktestCoreMetrics;
}) {
  const entries = Object.entries(metrics);

  return (
    <Surface variant="table">
      <SurfaceHeader className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-white">Core Metrics</div>
        <button type="button" className="text-xs text-cyan-300 hover:text-cyan-200 transition-colors">
          Download CSV
        </button>
      </SurfaceHeader>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[320px]">
          <tbody className="divide-y divide-slate-800">
            {entries.map(([k, v]) => (
              <tr key={k} className="hover:bg-slate-950/40">
                <td className="px-4 py-2 text-slate-400 font-mono text-xs">{k}</td>
                <td className="px-4 py-2 text-right text-slate-200 font-mono">{String(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}