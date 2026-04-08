"use client";

import React, { useMemo } from "react";
import { Button } from "@/presentation/components/Button";
import type { EditParamsDraft, MyStrategyRow } from "../types";

export function EditParamsDrawer({
  open,
  loading = false,
  saving = false,
  errorMessage = "",
  onClose,
  selected,
  draft,
  onDraft,
  onSave,
}: {
  open: boolean;
  loading?: boolean;
  saving?: boolean;
  errorMessage?: string;
  onClose: () => void;
  selected: MyStrategyRow | null;
  draft: EditParamsDraft | null;
  onDraft: (v: EditParamsDraft) => void;
  onSave: () => void;
}) {
  const jsonValid = useMemo(() => {
    if (!draft) return false;

    try {
      const parsed = JSON.parse(draft.atrWidthRulesJson);
      return Array.isArray(parsed) || Array.isArray(parsed?.atr_width_rules);
    } catch {
      return false;
    }
  }, [draft]);

  function formatJson() {
    if (!draft) return;

    try {
      const parsed = JSON.parse(draft.atrWidthRulesJson);
      onDraft({
        ...draft,
        atrWidthRulesJson: JSON.stringify(parsed, null, 2),
      });
    } catch {
      // keep as is
    }
  }

  if (!open || !selected) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close edit drawer"
        onClick={onClose}
        className="absolute inset-0 w-full h-full cursor-default"
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-slate-900 border-l border-slate-700/60 shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700/60 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Strategy Params</h2>
            <p className="text-sm text-slate-400 mt-1">
              Strategy #{selected.id} — {selected.name}
            </p>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-xl" aria-hidden="true" />
          </button>
        </div>

        {loading || !draft ? (
          <div className="p-6">
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 px-4 py-6 text-sm text-slate-400">
              Loading strategy params...
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
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Identity</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={draft.isPublic}
                          onChange={(e) => onDraft({ ...draft, isPublic: e.target.checked })}
                          disabled={saving}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-800/60 rounded-full peer peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                      </div>

                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        Public strategy
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Symbol</label>
                    <input
                      type="text"
                      value={draft.symbol}
                      onChange={(e) => onDraft({ ...draft, symbol: e.target.value.toUpperCase() })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-4 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Indicator Set ID</label>
                    <input
                      type="text"
                      value={draft.indicatorSetId}
                      readOnly
                      className="w-full bg-slate-800/30 border border-slate-700/30 rounded-lg px-4 py-2.5 text-slate-500 font-mono text-sm cursor-not-allowed"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-2">Stream Key</label>
                    <input
                      type="text"
                      value={draft.streamKey}
                      readOnly
                      className="w-full bg-slate-800/30 border border-slate-700/30 rounded-lg px-4 py-2.5 text-slate-500 font-mono text-sm cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Range and Breakout</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Fixed Range Width %</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={draft.fixedRangeWidthPct}
                      onChange={(e) => onDraft({ ...draft, fixedRangeWidthPct: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Initial Side</label>
                    <select
                      value={draft.initialSide}
                      onChange={(e) => onDraft({ ...draft, initialSide: e.target.value as "down" | "up" })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    >
                      <option value="down">down</option>
                      <option value="up">up</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Breakout Confirm Bars</label>
                    <input
                      type="number"
                      value={draft.breakoutConfirmBars}
                      onChange={(e) => onDraft({ ...draft, breakoutConfirmBars: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Breakout Down Below Share</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={draft.breakoutDownBelowShare}
                      onChange={(e) => onDraft({ ...draft, breakoutDownBelowShare: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Breakout Down Above Share</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={draft.breakoutDownAboveShare}
                      onChange={(e) => onDraft({ ...draft, breakoutDownAboveShare: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Breakout Up Below Share</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={draft.breakoutUpBelowShare}
                      onChange={(e) => onDraft({ ...draft, breakoutUpBelowShare: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Breakout Up Above Share</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={draft.breakoutUpAboveShare}
                      onChange={(e) => onDraft({ ...draft, breakoutUpAboveShare: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={draft.breakoutUseHighLow}
                          onChange={(e) => onDraft({ ...draft, breakoutUseHighLow: e.target.checked })}
                          disabled={saving}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-800/60 rounded-full peer peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                      </div>

                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        Use high/low for breakout
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">ATR Regime</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={draft.atrEnabled}
                          onChange={(e) => onDraft({ ...draft, atrEnabled: e.target.checked })}
                          disabled={saving}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-800/60 rounded-full peer peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                      </div>

                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">ATR enabled</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">ATR Period</label>
                    <input
                      type="number"
                      value={draft.atrPeriod}
                      onChange={(e) => onDraft({ ...draft, atrPeriod: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={draft.atrRebalanceEnabled}
                          onChange={(e) => onDraft({ ...draft, atrRebalanceEnabled: e.target.checked })}
                          disabled={saving}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-800/60 rounded-full peer peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                      </div>

                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        ATR rebalance enabled
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">
                      ATR Rebalance Min Width Delta %
                    </label>
                    <input
                      type="number"
                      step="0.000000000001"
                      value={draft.atrRebalanceMinWidthDeltaPct}
                      onChange={(e) => onDraft({ ...draft, atrRebalanceMinWidthDeltaPct: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={draft.atrHysteresisEnabled}
                          onChange={(e) => onDraft({ ...draft, atrHysteresisEnabled: e.target.checked })}
                          disabled={saving}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-800/60 rounded-full peer peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                      </div>

                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        ATR hysteresis enabled
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">ATR Hysteresis Gap %</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={draft.atrHysteresisGapPct}
                      onChange={(e) => onDraft({ ...draft, atrHysteresisGapPct: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">ATR Rebalance Cooldown Bars</label>
                    <input
                      type="number"
                      value={draft.atrRebalanceCooldownBars}
                      onChange={(e) => onDraft({ ...draft, atrRebalanceCooldownBars: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">ATR Rebalance Min Age Bars</label>
                    <input
                      type="number"
                      value={draft.atrRebalanceMinAgeBars}
                      onChange={(e) => onDraft({ ...draft, atrRebalanceMinAgeBars: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Entry Filters</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={draft.entryFiltersEnabled}
                          onChange={(e) => onDraft({ ...draft, entryFiltersEnabled: e.target.checked })}
                          disabled={saving}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-800/60 rounded-full peer peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                      </div>

                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        Entry filters enabled
                      </span>
                    </label>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={draft.allowCashWhenFilterFails}
                          onChange={(e) => onDraft({ ...draft, allowCashWhenFilterFails: e.target.checked })}
                          disabled={saving}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-800/60 rounded-full peer peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                      </div>

                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        Allow cash when filter fails
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Entry Cooldown Bars</label>
                    <input
                      type="number"
                      value={draft.entryCooldownBars}
                      onChange={(e) => onDraft({ ...draft, entryCooldownBars: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Entry ATR Quantile Window</label>
                    <input
                      type="number"
                      value={draft.entryAtrQuantileWindow}
                      onChange={(e) => onDraft({ ...draft, entryAtrQuantileWindow: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Entry ATR Quantile</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={draft.entryAtrQuantile}
                      onChange={(e) => onDraft({ ...draft, entryAtrQuantile: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Entry Trend MA Window</label>
                    <input
                      type="number"
                      value={draft.entryTrendMaWindow}
                      onChange={(e) => onDraft({ ...draft, entryTrendMaWindow: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Entry Max MA Distance %</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={draft.entryMaxMaDistancePct}
                      onChange={(e) => onDraft({ ...draft, entryMaxMaDistancePct: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Entry Max MA Slope %</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={draft.entryMaxMaSlopePct}
                      onChange={(e) => onDraft({ ...draft, entryMaxMaSlopePct: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Entry Channel Window</label>
                    <input
                      type="number"
                      value={draft.entryChannelWindow}
                      onChange={(e) => onDraft({ ...draft, entryChannelWindow: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Entry Channel Pos Min</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={draft.entryChannelPosMin}
                      onChange={(e) => onDraft({ ...draft, entryChannelPosMin: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Entry Channel Pos Max</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={draft.entryChannelPosMax}
                      onChange={(e) => onDraft({ ...draft, entryChannelPosMax: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Compatibility</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Swap Fee Percent</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={draft.swapFeePercent}
                      onChange={(e) => onDraft({ ...draft, swapFeePercent: Number(e.target.value) })}
                      disabled={saving}
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
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
                      className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={draft.gaugeEnabled}
                          onChange={(e) => onDraft({ ...draft, gaugeEnabled: e.target.checked })}
                          disabled={saving}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-800/60 rounded-full peer peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                      </div>

                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        Gauge flow enabled
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">ATR Width Rules</h3>

                <div className="relative">
                  <textarea
                    value={draft.atrWidthRulesJson}
                    onChange={(e) => onDraft({ ...draft, atrWidthRulesJson: e.target.value })}
                    disabled={saving}
                    className="w-full min-h-[220px] bg-slate-800/50 border border-slate-700/60 rounded-lg p-4 font-mono text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 transition-all leading-relaxed resize-none disabled:opacity-60"
                    spellCheck={false}
                  />

                  <button
                    type="button"
                    onClick={formatJson}
                    disabled={saving}
                    className="absolute top-3 right-3 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-xs text-slate-300 rounded transition-all disabled:opacity-60"
                  >
                    Format JSON
                  </button>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs">
                  {jsonValid ? (
                    <>
                      <i className="fa-solid fa-check-circle text-green-400" aria-hidden="true" />
                      <span className="text-green-400">Valid JSON</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-circle-exclamation text-red-400" aria-hidden="true" />
                      <span className="text-red-400">Invalid JSON</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700/60 px-6 py-4 flex items-center justify-between gap-3">
              <button onClick={onClose} className="px-5 py-2 text-slate-400 hover:text-white transition-colors">
                Close
              </button>

              <Button
                variant="primary"
                onClick={onSave}
                disabled={!jsonValid || saving}
                leftIcon={<i className="fa-solid fa-save" aria-hidden="true" />}
              >
                {saving ? "Saving..." : "Save Params"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}