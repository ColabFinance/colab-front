"use client";

import type { TradeStrategySignalRecord } from "../types";

type Props = {
  signal: TradeStrategySignalRecord | null;
  onClose: () => void;
};

export function TradeStrategySignalDetailsDrawer({ signal, onClose }: Props) {
  if (!signal) return null;

  const hasExecutionResponse = Boolean(signal.executionResponse);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-slate-900 border-l border-slate-700 shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Signal Details</h2>
            <p className="text-sm text-slate-400 mt-1 font-mono">{signal.id}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-950/50 border border-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">Signal Information</h3>

            <div className="space-y-2.5">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-500">ID:</span>
                <span className="text-sm text-slate-200 font-mono text-right">{signal.id}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-500">Timestamp:</span>
                <span className="text-sm text-slate-200 font-mono text-right">{signal.ts}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-500">Signal Type:</span>
                <span className="text-sm text-slate-200 text-right">{signal.signalType}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-500">Status:</span>
                <span className="text-sm text-slate-200 text-right">{signal.status}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-500">Idempotency Key:</span>
                <span className="text-sm text-slate-200 font-mono text-right">{signal.idempotencyKey}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-500">Attempts:</span>
                <span className="text-sm text-slate-200 font-mono text-right">{signal.attempts}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-500">Last Error:</span>
                <span className="text-sm text-slate-200 text-right">{signal.lastError || "—"}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-500">Created At:</span>
                <span className="text-sm text-slate-200 font-mono text-right">{signal.createdAtIso || "-"}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/50 border border-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">Execution Response Summary</h3>

            <div className="space-y-2.5">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-500">Available:</span>
                <span className="text-sm text-slate-200 text-right">{hasExecutionResponse ? "true" : "false"}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-500">Summary:</span>
                <span className="text-sm text-slate-200 text-right">
                  {hasExecutionResponse ? "Execution response attached" : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 p-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}