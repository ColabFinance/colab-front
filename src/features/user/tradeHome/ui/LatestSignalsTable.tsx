import Link from "next/link";
import type { TradeSignalRow } from "../types";
import { ActionBadge } from "@/presentation/components/ActionBadge";

type Props = {
  rows: TradeSignalRow[];
  lastUpdatedLabel: string;
};

function signalTypeClassName(value: string) {
  const raw = String(value || "").toUpperCase();

  if (raw.includes("LONG")) return "text-green-400";
  if (raw.includes("SHORT")) return "text-red-400";
  return "text-slate-300";
}

function statusClassName(value: string) {
  const raw = String(value || "").toUpperCase();

  if (raw === "PENDING") return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
  if (raw === "FAILED") return "bg-red-500/10 text-red-400 border border-red-500/20";
  if (raw === "COMPLETED") return "bg-green-500/10 text-green-400 border border-green-500/20";
  return "bg-slate-500/10 text-slate-300 border border-slate-500/20";
}

export function LatestSignalsTable({ rows, lastUpdatedLabel }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
      <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-bold text-white text-lg">Latest Signals</h3>
        <div className="text-xs text-slate-400">
          Last updated: <span className="text-slate-300 font-mono">{lastUpdatedLabel}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Strategy ID</th>
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4">Signal Type</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Attempts</th>
              <th className="px-6 py-4">Last Error</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700">
            {rows.map((row) => (
              <tr key={row.id} className="group hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">#{row.strategyId}</td>
                <td className="px-6 py-4 text-sm text-slate-300 font-mono">{row.symbol}</td>
                <td className={`px-6 py-4 text-sm font-mono ${signalTypeClassName(row.signalType)}`}>
                  {row.signalType}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium ${statusClassName(row.status)}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{row.timestamp}</td>
                <td className="px-6 py-4 text-sm text-slate-300 font-mono">{row.attempts}</td>
                <td className={`px-6 py-4 text-sm ${row.lastError !== "-" ? "text-red-400 font-mono text-xs" : "text-slate-500"}`}>
                  {row.lastError}
                </td>
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
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-500">
                  No signals found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}