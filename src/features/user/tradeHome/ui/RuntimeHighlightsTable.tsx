import Link from "next/link";
import type { RuntimeHighlightRow } from "../types";
import { ActionBadge } from "@/presentation/components/ActionBadge";

type Props = {
  rows: RuntimeHighlightRow[];
  lastUpdatedLabel: string;
};

function runtimeStateClassName(value: string) {
  if (value === "in_position") return "text-cyan-400";
  if (value === "waiting_setup") return "text-blue-400";
  if (value === "stale_runtime") return "text-orange-400";
  if (value === "idle_no_account") return "text-yellow-400";
  return "text-slate-400";
}

function eventClassName(value: string) {
  if (value.includes("LONG")) return "text-green-400";
  if (value.includes("SHORT")) return "text-red-400";
  return "text-slate-400";
}

function sideClassName(value: string) {
  if (value === "long") return "text-green-400";
  if (value === "short") return "text-red-400";
  return "text-slate-500";
}

export function RuntimeHighlightsTable({ rows, lastUpdatedLabel }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
      <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-bold text-white text-lg">Latest Runtime Highlights</h3>
        <div className="text-xs text-slate-400">
          Last updated: <span className="text-slate-300 font-mono">{lastUpdatedLabel}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-left">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Strategy ID</th>
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4">Runtime State</th>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">ATR</th>
              <th className="px-6 py-4">ATR %</th>
              <th className="px-6 py-4 text-center">Setup Armed</th>
              <th className="px-6 py-4">Desired Side</th>
              <th className="px-6 py-4">Position Side</th>
              <th className="px-6 py-4">Bars Since Event</th>
              <th className="px-6 py-4">Updated At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700">
            {rows.map((row) => (
              <tr key={row.strategyId} className="group hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">#{row.strategyId}</td>
                <td className="px-6 py-4 text-sm text-slate-300 font-mono">{row.symbol}</td>
                <td className={`px-6 py-4 text-sm font-mono ${runtimeStateClassName(row.runtimeState)}`}>
                  {row.runtimeState}
                </td>
                <td className={`px-6 py-4 text-sm font-mono ${eventClassName(row.event)}`}>
                  {row.event}
                </td>
                <td className="px-6 py-4 text-sm text-slate-300 font-mono">{row.atr}</td>
                <td className="px-6 py-4 text-sm text-slate-300 font-mono">{row.atrPct}</td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium ${
                      row.setupArmed
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                    }`}
                  >
                    {row.setupArmed ? "Yes" : "No"}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm font-mono ${sideClassName(row.desiredSide)}`}>
                  {row.desiredSide}
                </td>
                <td className={`px-6 py-4 text-sm font-mono ${sideClassName(row.positionSide)}`}>
                  {row.positionSide}
                </td>
                <td className="px-6 py-4 text-sm text-slate-300 font-mono">{row.barsSinceEvent}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{row.updatedAtLabel}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <ActionBadge href={row.detailsHref} label="Details" tone="cyan" />
                    <ActionBadge href={row.monitorHref} label="Trade Monitor" tone="blue" />
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={12} className="px-6 py-10 text-center text-sm text-slate-500">
                  No runtime highlights available for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}