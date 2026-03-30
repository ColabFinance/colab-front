"use client";

import { ActionBadge } from "@/presentation/components/ActionBadge";
import type {
  TradeStrategySignalRecord,
  TradeStrategySignalsPagination,
} from "../types";
import { TradeStrategySignalsPagination as TradeStrategySignalsPaginationBar } from "./TradeStrategySignalsPagination";

type Props = {
  strategyId: string;
  signals: TradeStrategySignalRecord[];
  pagination: TradeStrategySignalsPagination;
  onPageChange: (page: number) => void;
  onOpenDetails: (signal: TradeStrategySignalRecord) => void;
  onOpenExecutionResponse: (payload: Record<string, unknown> | null) => void;
};

function signalTypeTone(signalType: string): string {
  const raw = String(signalType || "").toUpperCase();
  if (raw.includes("OPEN_LONG")) return "text-green-400";
  if (raw.includes("OPEN_SHORT")) return "text-orange-400";
  if (raw.includes("CLOSE")) return "text-red-400";
  return "text-slate-300";
}

function statusClasses(status: string) {
  const raw = String(status || "").toUpperCase();

  if (raw.includes("SUCCESS") || raw.includes("EXECUTED")) {
    return "bg-green-500/10 text-green-400 border border-green-500/20";
  }

  if (raw.includes("FAIL")) {
    return "bg-red-500/10 text-red-400 border border-red-500/20";
  }

  return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
}

function executionSummary(payload: Record<string, unknown> | null): string {
  if (!payload) return "—";

  const reason = typeof payload.reason === "string" ? payload.reason : "";
  const order =
    payload.order && typeof payload.order === "object"
      ? (payload.order as Record<string, unknown>)
      : null;

  if (reason) return reason;
  if (order?.status) return String(order.status);
  return "Available";
}

export function TradeStrategyRecentSignalsCard({
  strategyId,
  signals,
  pagination,
  onPageChange,
  onOpenDetails,
  onOpenExecutionResponse,
}: Props) {
  const totalPages = Math.max(
    1,
    Math.ceil(Number(pagination.total || 0) / Math.max(1, Number(pagination.limit || 10)))
  );

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-slate-700">
        <h3 className="font-bold text-white text-lg">Recent Signals</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Signal Type</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Idempotency Key</th>
              <th className="px-6 py-4">Attempts</th>
              <th className="px-6 py-4">Last Error</th>
              <th className="px-6 py-4">Execution Response</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700">
            {signals.map((signal) => (
              <tr key={signal.id} className="group hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-sm font-mono text-slate-400">{signal.id}</td>
                <td className="px-6 py-4 text-sm text-slate-300 font-mono">{signal.ts}</td>
                <td className={`px-6 py-4 text-sm font-medium ${signalTypeTone(signal.signalType)}`}>
                  {signal.signalType}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${statusClasses(
                      signal.status
                    )}`}
                  >
                    {signal.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">{signal.idempotencyKey}</td>
                <td className="px-6 py-4 text-sm text-slate-300 font-mono">{signal.attempts}</td>
                <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">{signal.lastError || "—"}</td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  {signal.executionResponse ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{executionSummary(signal.executionResponse)}</span>
                      <button
                        type="button"
                        onClick={() => onOpenExecutionResponse(signal.executionResponse)}
                        className="text-cyan-400 hover:text-cyan-300 text-xs cursor-pointer"
                      >
                        <i className="fa-solid fa-external-link" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">{signal.createdAtIso || "-"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <ActionBadge label="Details" tone="cyan" onClick={() => onOpenDetails(signal)} />
                    <ActionBadge
                      href={`/trade/monitor?strategyId=${encodeURIComponent(strategyId)}`}
                      label="Trade Monitor"
                      tone="blue"
                    />
                  </div>
                </td>
              </tr>
            ))}

            {signals.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-10 text-center text-sm text-slate-500">
                  No recent signals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TradeStrategySignalsPaginationBar
        page={pagination.page}
        totalPages={totalPages}
        limit={pagination.limit}
        total={pagination.total}
        onChangePage={onPageChange}
        onChangeLimit={() => {}}
      />
    </div>
  );
}