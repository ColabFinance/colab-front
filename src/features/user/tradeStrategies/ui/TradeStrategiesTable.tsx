import Link from "next/link";
import { ActionBadge } from "@/presentation/components/ActionBadge";
import type { TradeStrategyRow } from "../types";
import { TradeStrategiesPagination } from "./TradeStrategiesPagination";

type Props = {
  rows: TradeStrategyRow[];
  lastUpdatedLabel: string;
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
  onToggleStatus: (row: TradeStrategyRow) => void;
};

function statusClasses(status: string) {
  if (status === "ACTIVE") {
    return "bg-green-500/10 text-green-400 border border-green-500/20";
  }

  return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
}

function sourceLabel(value: string) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "-";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function TradeStrategiesTable({
  rows,
  lastUpdatedLabel,
  page,
  totalPages,
  limit,
  total,
  onChangePage,
  onChangeLimit,
  onToggleStatus,
}: Props) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-bold text-white text-lg">Trade Strategies</h3>
        <div className="text-xs text-slate-400">
          Last updated: <span className="text-slate-300 font-mono">{lastUpdatedLabel}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Trade Strategy</th>
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Interval</th>
              <th className="px-6 py-4">Stream Key</th>
              <th className="px-6 py-4">Strategy Type</th>
              <th className="px-6 py-4">Execution Target</th>
              <th className="px-6 py-4">Execution Account</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Updated At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700">
            {rows.map((row) => (
              <tr key={row.id} className="group hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-white">{row.name}</td>
                <td className="px-6 py-4 text-sm text-slate-300 font-mono">{row.symbol}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{sourceLabel(row.source)}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{row.interval}</td>
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">{row.streamKey}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{row.strategyType}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{row.executionTarget}</td>
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                  {row.executionAccountId || "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${statusClasses(row.status)}`}>
                    {row.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{row.updatedAtIso}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <ActionBadge href={`/trade/strategies/${row.id}`} label="Details" tone="cyan" />
                    <ActionBadge
                      href={`/trade/monitor?strategyId=${encodeURIComponent(row.id)}`}
                      label="Trade Monitor"
                      tone="blue"
                    />
                    <ActionBadge
                      label={row.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      tone={row.status === "ACTIVE" ? "red" : "green"}
                      onClick={() => onToggleStatus(row)}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={11} className="px-6 py-12 text-center text-sm text-slate-500">
                  No trade strategies found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TradeStrategiesPagination
        page={page}
        totalPages={totalPages}
        limit={limit}
        total={total}
        onChangePage={onChangePage}
        onChangeLimit={onChangeLimit}
      />
    </div>
  );
}