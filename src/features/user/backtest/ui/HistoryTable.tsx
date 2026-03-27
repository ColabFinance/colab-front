"use client";

import React, { useMemo } from "react";
import { Surface, SurfaceHeader } from "@/presentation/components/Surface";
import { Badge } from "@/presentation/components/Badge";
import { BacktestRun } from "../types";
import { STRATEGIES } from "../mock";

export function HistoryTable({
  runs,
  onViewResults,
  onDelete,
}: {
  runs: BacktestRun[];
  onViewResults: (run: BacktestRun) => void;
  onDelete: (runId: string) => void;
}) {
  const byId = useMemo(() => new Map(STRATEGIES.map((s) => [s.id, s])), []);

  function tone(status: BacktestRun["status"]) {
    if (status === "completed") return "green";
    if (status === "failed") return "red";
    return "amber";
  }

  return (
    <Surface variant="table">
      <SurfaceHeader>
        <div className="text-sm font-semibold text-white">Runs</div>
      </SurfaceHeader>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-slate-950/40 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Run ID</th>
              <th className="px-6 py-4">Strategy</th>
              <th className="px-6 py-4">Date Range</th>
              <th className="px-6 py-4">Timeframe</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {runs.map((r) => {
              const s = byId.get(r.strategyId);
              return (
                <tr key={r.id} className="hover:bg-slate-950/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-slate-400">{r.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-white">{s ? s.name : r.strategyId}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{r.dateRangeLabel}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{r.timeframeLabel}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge tone={tone(r.status) as any}>{r.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{r.createdAtLabel}</td>
                  <td className="px-6 py-4 text-right">
                    {r.status !== "failed" ? (
                      <button
                        type="button"
                        onClick={() => onViewResults(r)}
                        className="text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors mr-3"
                      >
                        View Results
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="text-slate-400 hover:text-white text-sm font-medium transition-colors mr-3"
                      >
                        View Logs
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDelete(r.id)}
                      className="text-slate-500 hover:text-red-300 transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}