"use client";

import React, { useMemo } from "react";
import type { StrategyDetails, StrategyEditDraft } from "../types";

export function StrategyEditDrawer({
  open,
  loading = false,
  saving = false,
  errorMessage = "",
  strategy,
  draft,
  onDraft,
  onClose,
  onSave,
}: {
  open: boolean;
  loading?: boolean;
  saving?: boolean;
  errorMessage?: string;
  strategy: StrategyDetails | null;
  draft: StrategyEditDraft | null;
  onDraft: (value: StrategyEditDraft) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const jsonValid = useMemo(() => {
    if (!draft) return false;

    try {
      JSON.parse(draft.tiersJson);
      return true;
    } catch {
      return false;
    }
  }, [draft]);

  if (!open) return null;

  function formatJson() {
    if (!draft) return;

    try {
      const parsed = JSON.parse(draft.tiersJson);
      onDraft({
        ...draft,
        tiersJson: JSON.stringify(parsed, null, 2),
      });
    } catch {
      // keep text as is
    }
  }

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close drawer"
        className="absolute inset-0 w-full h-full cursor-default"
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-slate-900 border-l border-slate-700 shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-lg font-semibold text-white">Edit Strategy Params</h3>
            <p className="text-sm text-slate-400 mt-1">
              {strategy ? `Strategy #${strategy.strategyId} — ${strategy.name}` : ""}
            </p>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-xl" aria-hidden="true" />
          </button>
        </div>

        {loading || !draft ? (
          <div className="p-6">
            <div className="rounded-xl border border-slate-700 bg-slate-800/30 px-4 py-6 text-sm text-slate-400">
              Loading strategy data...
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-8">
              {errorMessage ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {errorMessage}
                </div>
              ) : null}

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Identity</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Status</label>
                    <select
                      value={draft.status}
                      onChange={(e) =>
                        onDraft({
                          ...draft,
                          status: e.target.value as "ACTIVE" | "INACTIVE",
                        })
                      }
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Symbol</label>
                    <input
                      value={draft.symbol}
                      onChange={(e) => onDraft({ ...draft, symbol: e.target.value.toUpperCase() })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={draft.isPublic}
                        onChange={(e) => onDraft({ ...draft, isPublic: e.target.checked })}
                        disabled={saving}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 rounded-full peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                    </div>
                    <span className="text-sm text-slate-300">Public Strategy</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Indicator Set</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Source</label>
                    <input
                      value={draft.indicatorSource}
                      onChange={(e) => onDraft({ ...draft, indicatorSource: e.target.value })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">EMA Fast</label>
                    <input
                      type="number"
                      value={draft.emaFast}
                      onChange={(e) => onDraft({ ...draft, emaFast: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">EMA Slow</label>
                    <input
                      type="number"
                      value={draft.emaSlow}
                      onChange={(e) => onDraft({ ...draft, emaSlow: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">ATR Window</label>
                    <input
                      type="number"
                      value={draft.atrWindow}
                      onChange={(e) => onDraft({ ...draft, atrWindow: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Core Parameters</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Skew Low %</label>
                    <input
                      type="number"
                      step="0.01"
                      value={draft.skewLowPct}
                      onChange={(e) => onDraft({ ...draft, skewLowPct: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Skew High %</label>
                    <input
                      type="number"
                      step="0.01"
                      value={draft.skewHighPct}
                      onChange={(e) => onDraft({ ...draft, skewHighPct: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">EPS</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={draft.eps}
                      onChange={(e) => onDraft({ ...draft, eps: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Cooloff Bars</label>
                    <input
                      type="number"
                      value={draft.cooloffBars}
                      onChange={(e) => onDraft({ ...draft, cooloffBars: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Breakout Confirm Bars</label>
                    <input
                      type="number"
                      value={draft.breakoutConfirmBars}
                      onChange={(e) => onDraft({ ...draft, breakoutConfirmBars: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={draft.gaugeEnabled}
                        onChange={(e) => onDraft({ ...draft, gaugeEnabled: e.target.checked })}
                        disabled={saving}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 rounded-full peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                    </div>
                    <span className="text-sm text-slate-300">Gauge Flow Enabled</span>
                  </label>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tiers JSON</h4>
                  <button
                    type="button"
                    onClick={formatJson}
                    disabled={saving}
                    className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-xs text-slate-300 rounded transition-all"
                  >
                    Format JSON
                  </button>
                </div>

                <textarea
                  value={draft.tiersJson}
                  onChange={(e) => onDraft({ ...draft, tiersJson: e.target.value })}
                  disabled={saving}
                  spellCheck={false}
                  className="w-full min-h-[220px] bg-slate-800/50 border border-slate-700 rounded-lg p-4 font-mono text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                />

                <div className="mt-2 text-xs">
                  {jsonValid ? (
                    <span className="text-green-400">Valid JSON</span>
                  ) : (
                    <span className="text-red-400">Invalid JSON</span>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 px-6 py-4 flex items-center justify-between gap-3">
              <button onClick={onClose} className="px-5 py-2 text-slate-400 hover:text-white transition-colors">
                Close
              </button>

              <button
                type="button"
                onClick={onSave}
                disabled={!jsonValid || saving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all"
              >
                {saving ? "Saving..." : "Save Params"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}