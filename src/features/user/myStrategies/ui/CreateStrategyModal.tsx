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

  if (!open) return null;

  const canPickPool = Boolean(draft.dexId);
  const canConfirm = Boolean(draft.dexId && draft.poolId && draft.name.trim() && draft.symbol.trim() && !submitting);

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close create drawer"
        onClick={onClose}
        className="absolute inset-0 w-full h-full cursor-default"
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-slate-900 border-l border-slate-700/60 shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700/60 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Create Strategy</h2>
            <p className="text-sm text-slate-400 mt-1">Register a new strategy configuration</p>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close">
            <i className="fa-solid fa-xmark text-xl" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-6">
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

          {selectedPool && (
            <div className="p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Derived Wiring
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Adapter:</span>
                  <span className="text-slate-300 ml-2 font-mono text-[11px]">{selectedPool.adapterAddress}</span>
                </div>

                <div>
                  <span className="text-slate-500">Router:</span>
                  <span className="text-slate-300 ml-2 font-mono text-[11px]">{selectedPool.routerAddress}</span>
                </div>

                <div>
                  <span className="text-slate-500">Token0:</span>
                  <span className="text-slate-300 ml-2">{selectedPool.token0Symbol}</span>
                </div>

                <div>
                  <span className="text-slate-500">Token1:</span>
                  <span className="text-slate-300 ml-2">{selectedPool.token1Symbol}</span>
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

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Strategy Name <span className="text-red-400">*</span>
            </label>
            <input
              value={draft.name}
              onChange={(e) => onDraft({ ...draft, name: e.target.value })}
              disabled={submitting}
              className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
              placeholder="e.g. ETH-USDC Momentum"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => onDraft({ ...draft, description: e.target.value })}
              disabled={submitting}
              className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all min-h-[80px] resize-none disabled:opacity-60"
              placeholder="Short description..."
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
              placeholder="MOM-ALPHA"
            />
          </div>

          <div className="border-t border-slate-700/60 pt-6">
            <div className="text-sm font-semibold text-white mb-4">Indicator Set Configuration</div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Source</label>
                <input
                  value={draft.indicatorSource}
                  onChange={(e) => onDraft({ ...draft, indicatorSource: e.target.value })}
                  disabled={submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">EMA Fast</label>
                <input
                  type="number"
                  value={draft.emaFast}
                  onChange={(e) => onDraft({ ...draft, emaFast: Number(e.target.value) })}
                  disabled={submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">EMA Slow</label>
                <input
                  type="number"
                  value={draft.emaSlow}
                  onChange={(e) => onDraft({ ...draft, emaSlow: Number(e.target.value) })}
                  disabled={submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">ATR Window</label>
                <input
                  type="number"
                  value={draft.atrWindow}
                  onChange={(e) => onDraft({ ...draft, atrWindow: Number(e.target.value) })}
                  disabled={submitting}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60"
                />
              </div>
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