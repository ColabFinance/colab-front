import Link from "next/link";
import type { TradeStrategyRow } from "../types";
import { ActionBadge } from "@/presentation/components/ActionBadge";

type Props = {
  rows: TradeStrategyRow[];
  lastUpdatedLabel: string;
};

function statusMeta(status: string) {
  const raw = String(status || "").trim().toUpperCase();

  if (raw === "ACTIVE") {
    return {
      label: "Active",
      className: "bg-green-500/10 text-green-400 border border-green-500/20",
    };
  }

  if (raw === "PAUSED" || raw === "INACTIVE") {
    return {
      label: raw === "PAUSED" ? "Paused" : "Inactive",
      className: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    };
  }

  if (raw === "FAILED") {
    return {
      label: "Failed",
      className: "bg-red-500/10 text-red-400 border border-red-500/20",
    };
  }

  return {
    label: raw || "-",
    className: "bg-slate-500/10 text-slate-300 border border-slate-500/20",
  };
}

export function ActiveTradeStrategiesTable({ rows, lastUpdatedLabel }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
      <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-bold text-white text-lg">Active Trade Strategies</h3>
        <div className="text-xs text-slate-400">
          Last updated: <span className="text-slate-300 font-mono">{lastUpdatedLabel}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Trade Strategy</th>
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4">Stream Key</th>
              <th className="px-6 py-4">Strategy Type</th>
              <th className="px-6 py-4">Execution Account</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Updated At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700">
            {rows.map((row) => {
              const meta = statusMeta(row.status);

              return (
                <tr key={row.id} className="group hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-white">{row.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">{row.symbol}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 font-mono">{row.streamKey}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{row.strategyType}</td>
                  <td className="px-6 py-4 text-sm font-mono">
                    {row.executionAccount ? (
                      <span className="text-slate-400">{row.executionAccount}</span>
                    ) : (
                      <span className="text-orange-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium ${meta.className}`}
                    >
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{row.updatedAtLabel}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <ActionBadge href={row.detailsHref} label="Details" tone="cyan" />
                      <ActionBadge href={row.monitorHref} label="Trade Monitor" tone="blue" />
                    </div>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-500">
                  No trade strategies found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}