"use client";

import React, { useMemo } from "react";
import { Button } from "@/presentation/components/Button";
import { Badge } from "@/presentation/components/Badge";
import type { CreateStrategyDraft, DexOption, PoolOption } from "../types";

export function CreateStrategyModal({
  open,
  loading = false,
  submitting = false,
  errorMessage = "",
  onClose,
  onConfirm,
  dexOptions,
  poolOptions,
  draft,
  onDraft,
}: {
  open: boolean;
  loading?: boolean;
  submitting?: boolean;
  errorMessage?: string;
  onClose: () => void;
  onConfirm: () => void;
  dexOptions: DexOption[];
  poolOptions: PoolOption[];
  draft: CreateStrategyDraft;
  onDraft: (v: CreateStrategyDraft) => void;
}) {
  const poolsForDex = useMemo(() => {
    if (!draft.dexId) return [];
    return poolOptions.filter((p) => p.dexId === draft.dexId);
  }, [draft.dexId, poolOptions]);

  const selectedPool = useMemo(() => {
    if (!draft.poolId) return null;
    return poolOptions.find((p) => p.id === draft.poolId) ?? null;
  }, [draft.poolId, poolOptions]);

  const jsonValid = useMemo(() => {
    try {
      const parsed = JSON.parse(draft.atrWidthRulesJson);
      return Array.isArray(parsed) || Array.isArray(parsed?.atr_width_rules);
    } catch {
      return false;
    }
  }, [draft.atrWidthRulesJson]);

  function formatJson() {
    try {
      const parsed = JSON.parse(draft.atrWidthRulesJson);
      onDraft({
        ...draft,
        atrWidthRulesJson: JSON.stringify(parsed, null, 2),
      });
    } catch {
      // noop
    }
  }

  if (!open) return null;

  const canPickPool = Boolean(draft.dexId);
  const canConfirm = Boolean(
    draft.dexId &&
      draft.poolId &&
      draft.name.trim() &&
      draft.symbol.trim() &&
      jsonValid &&
      !submitting
  );

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close create drawer"
        onClick={onClose}
        className="absolute inset-0 w-full h-full cursor-default"
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-slate-900 border-l border-slate-700/60 shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700/60 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Create Strategy</h2>
            <p className="text-sm text-slate-400 mt-1">Register a new live LP strategy</p>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close">
            <i className="fa-solid fa-xmark text-xl" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {errorMessage ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 px-4 py-6 text-sm text-slate-400">
              Loading DEX and pool options...
            </div>
          ) : null}

          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Registry</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  DEX <span className="text-red-400">*</span>
                </label>
                <select
                  value={draft.dexId}
                  onChange={(e) => onDraft({ ...draft, dexId: e.target.value, poolId: "" })}
                  disabled={loading || submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                >
                  <option value="">Select DEX...</option>
                  {dexOptions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Pool <span className="text-red-400">*</span>
                </label>
                <select
                  value={draft.poolId}
                  onChange={(e) => onDraft({ ...draft, poolId: e.target.value })}
                  disabled={!canPickPool || loading || submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {!canPickPool ? (
                    <option value="">Select DEX first...</option>
                  ) : (
                    <>
                      <option value="">Select pool...</option>
                      {poolsForDex.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.pairLabel} ({p.feeLabel})
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            {selectedPool && (
              <div className="mt-4 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Derived Wiring</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Adapter:</span>
                    <span className="text-slate-300 ml-2 font-mono text-[11px] break-all">
                      {selectedPool.adapterAddress}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Router:</span>
                    <span className="text-slate-300 ml-2 font-mono text-[11px] break-all">
                      {selectedPool.routerAddress}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Token0:</span>
                    <span className="text-slate-300 ml-2">{selectedPool.token0Symbol}</span>
                  </div>

                  <div>
                    <span className="text-slate-500">Token1:</span>
                    <span className="text-slate-300 ml-2">{selectedPool.token1Symbol}</span>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-slate-500">Stream Key:</span>
                    <span className="text-slate-300 ml-2 font-mono text-[11px] break-all">
                      {selectedPool.streamKey || selectedPool.poolAddress}
                    </span>
                  </div>
                </div>

                <div>
                  {selectedPool.gaugeAvailable ? (
                    <Badge tone="blue" className="text-[10px]">
                      <i className="fa-solid fa-trophy" aria-hidden="true" /> Gauge Available
                    </Badge>
                  ) : (
                    <Badge tone="slate" className="text-[10px] text-slate-400">
                      Gauge Unavailable
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Identity</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Strategy Name <span className="text-red-400">*</span>
                </label>
                <input
                  value={draft.name}
                  onChange={(e) => onDraft({ ...draft, name: e.target.value })}
                  disabled={submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                  placeholder="e.g. ETH-USDC Wide Range"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Symbol <span className="text-red-400">*</span>
                </label>
                <input
                  value={draft.symbol}
                  onChange={(e) => onDraft({ ...draft, symbol: e.target.value.toUpperCase() })}
                  disabled={submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all uppercase font-mono disabled:opacity-60"
                  placeholder="ETHUSDC"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Initial Status</label>
                <select
                  value={draft.status}
                  onChange={(e) => onDraft({ ...draft, status: e.target.value as "ACTIVE" | "INACTIVE" })}
                  disabled={submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                >
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="ACTIVE">ACTIVE</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={draft.isPublic}
                      onChange={(e) => onDraft({ ...draft, isPublic: e.target.checked })}
                      disabled={submitting}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800/60 rounded-full peer peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                  </div>

                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    Public strategy
                  </span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-2">Description</label>
                <textarea
                  value={draft.description}
                  onChange={(e) => onDraft({ ...draft, description: e.target.value })}
                  disabled={submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all min-h-[80px] resize-none disabled:opacity-60"
                  placeholder="Short description..."
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
                  disabled={submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Initial Side</label>
                <select
                  value={draft.initialSide}
                  onChange={(e) => onDraft({ ...draft, initialSide: e.target.value as "down" | "up" })}
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                      disabled={submitting}
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
                      disabled={submitting}
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
                  disabled={submitting}
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
                      disabled={submitting}
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
                  disabled={submitting}
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
                      disabled={submitting}
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
                  disabled={submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">ATR Rebalance Cooldown Bars</label>
                <input
                  type="number"
                  value={draft.atrRebalanceCooldownBars}
                  onChange={(e) => onDraft({ ...draft, atrRebalanceCooldownBars: Number(e.target.value) })}
                  disabled={submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">ATR Rebalance Min Age Bars</label>
                <input
                  type="number"
                  value={draft.atrRebalanceMinAgeBars}
                  onChange={(e) => onDraft({ ...draft, atrRebalanceMinAgeBars: Number(e.target.value) })}
                  disabled={submitting}
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
                      disabled={submitting}
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
                      disabled={submitting}
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
                  disabled={submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Entry ATR Quantile Window</label>
                <input
                  type="number"
                  value={draft.entryAtrQuantileWindow}
                  onChange={(e) => onDraft({ ...draft, entryAtrQuantileWindow: Number(e.target.value) })}
                  disabled={submitting}
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
                  disabled={submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Entry Trend MA Window</label>
                <input
                  type="number"
                  value={draft.entryTrendMaWindow}
                  onChange={(e) => onDraft({ ...draft, entryTrendMaWindow: Number(e.target.value) })}
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Entry Channel Window</label>
                <input
                  type="number"
                  value={draft.entryChannelWindow}
                  onChange={(e) => onDraft({ ...draft, entryChannelWindow: Number(e.target.value) })}
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                      disabled={submitting}
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
                disabled={submitting}
                className="w-full min-h-[220px] bg-slate-800/50 border border-slate-700/60 rounded-lg p-4 font-mono text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 transition-all leading-relaxed resize-none disabled:opacity-60"
                spellCheck={false}
              />

              <button
                type="button"
                onClick={formatJson}
                disabled={submitting}
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

        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700/60 px-6 py-4 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-slate-400 hover:text-white transition-colors">
            Cancel
          </button>

          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={!canConfirm}
            leftIcon={<i className="fa-solid fa-check" aria-hidden="true" />}
          >
            {submitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}