"use client";

import React, { useMemo } from "react";
import { Surface } from "@/presentation/components/Surface";
import { Button } from "@/presentation/components/Button";
import type { CreateStrategyDraft, DexOption, PoolOption } from "../types";
import { Badge } from "@/presentation/components/Badge";

export function CreateStrategyModal({
  open,
  onClose,
  onConfirm,
  dexOptions,
  poolOptions,
  draft,
  onDraft,
}: {
  open: boolean;
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
  const canConfirm = Boolean(draft.dexId && draft.poolId && draft.name.trim() && draft.symbol.trim());

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Surface variant="panel" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">Create Strategy</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close">
            <i className="fa-solid fa-xmark text-xl" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* DEX */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              DEX <span className="text-red-400">*</span>
            </label>
            <select
              value={draft.dexId}
              onChange={(e) => onDraft({ ...draft, dexId: e.target.value, poolId: "" })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="">Select DEX...</option>
              {dexOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pool */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Pool <span className="text-red-400">*</span>
            </label>
            <select
              value={draft.poolId}
              onChange={(e) => onDraft({ ...draft, poolId: e.target.value })}
              disabled={!canPickPool}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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

          {/* Pool preview */}
          {selectedPool && (
            <div className="p-4 bg-slate-950 border border-slate-700 rounded-lg space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Pool Details
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Adapter:</span>
                  <span className="text-slate-300 ml-2 font-mono">{selectedPool.adapterAddress}</span>
                </div>
                <div>
                  <span className="text-slate-500">Router:</span>
                  <span className="text-slate-300 ml-2 font-mono">{selectedPool.routerAddress}</span>
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

              <div className="pt-2">
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

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Strategy Name <span className="text-red-400">*</span>
            </label>
            <input
              value={draft.name}
              onChange={(e) => onDraft({ ...draft, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="e.g. ETH-USDC Momentum"
            />
          </div>

          {/* Desc */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => onDraft({ ...draft, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors min-h-[80px]"
              placeholder="Short description of strategy logic..."
            />
          </div>

          {/* Symbol */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Symbol <span className="text-red-400">*</span>
            </label>
            <input
              value={draft.symbol}
              onChange={(e) => onDraft({ ...draft, symbol: e.target.value.toUpperCase() })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors uppercase font-mono"
              placeholder="MOM-ALPHA"
            />
          </div>

          {/* Indicator set */}
          <div className="border-t border-slate-700 pt-6">
            <div className="text-sm font-semibold text-white mb-4">Indicator Set Configuration</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Source</label>
                <input
                  value={draft.indicatorSource}
                  onChange={(e) => onDraft({ ...draft, indicatorSource: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">EMA Fast</label>
                <input
                  type="number"
                  value={draft.emaFast}
                  onChange={(e) => onDraft({ ...draft, emaFast: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">EMA Slow</label>
                <input
                  type="number"
                  value={draft.emaSlow}
                  onChange={(e) => onDraft({ ...draft, emaSlow: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">ATR Window</label>
                <input
                  type="number"
                  value={draft.atrWindow}
                  onChange={(e) => onDraft({ ...draft, atrWindow: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 px-6 py-4 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-slate-400 hover:text-white transition-colors">
            Cancel
          </button>

          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={!canConfirm}
            leftIcon={<i className="fa-solid fa-check" aria-hidden="true" />}
          >
            Create
          </Button>
        </div>
      </Surface>
    </div>
  );
}