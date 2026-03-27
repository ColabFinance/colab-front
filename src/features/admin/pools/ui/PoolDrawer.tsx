"use client";

import type { ChainOption, DexOption, PoolDraft, PoolType } from "../types";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  titleSuffix?: string | null;
  chainOptions: ChainOption[];
  dexOptions: DexOption[];
  draft: PoolDraft;
  submitting?: boolean;
  error?: string;
  onChange: (patch: Partial<PoolDraft>) => void;
  onClose: () => void;
  onValidate: () => void;
  onSave: () => void;
};

const FEE_OPTIONS = [
  { value: "100", label: "0.01% (100)" },
  { value: "500", label: "0.05% (500)" },
  { value: "3000", label: "0.3% (3000)" },
  { value: "10000", label: "1% (10000)" },
];

const TYPE_OPTIONS: PoolType[] = ["CONCENTRATED", "VOLATILE", "STABLE", "WEIGHTED"];

export function PoolDrawer({
  open,
  mode,
  titleSuffix,
  chainOptions,
  dexOptions,
  draft,
  submitting = false,
  error = "",
  onChange,
  onClose,
  onValidate,
  onSave,
}: Props) {
  if (!open) return null;

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-950/70" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-2xl border-l border-slate-800 bg-slate-900 shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isEdit ? "Edit Pool" : "Add Pool"}
              {titleSuffix ? <span className="text-slate-400"> · {titleSuffix}</span> : null}
            </h2>
            <p className="text-sm text-slate-400">
              {isEdit
                ? "Update the manual registry fields for this pool."
                : "Create a new pool record for the selected chain and DEX."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:text-white hover:border-slate-500"
          >
            Close
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {error ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Chain
              </label>
              <select
                value={draft.chain}
                onChange={(e) => onChange({ chain: e.target.value })}
                disabled
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white disabled:opacity-60"
              >
                {chainOptions.map((chain) => (
                  <option key={chain.key} value={chain.key}>
                    {chain.name} ({chain.key})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                DEX Key
              </label>
              <select
                value={draft.dexKey}
                onChange={(e) => onChange({ dexKey: e.target.value })}
                disabled={isEdit || submitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white disabled:opacity-60"
              >
                <option value="">Select a DEX</option>
                {dexOptions.map((dex) => (
                  <option key={dex.key} value={dex.key}>
                    {dex.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Pool Address
              </label>
              <input
                value={draft.poolAddress}
                onChange={(e) => onChange({ poolAddress: e.target.value })}
                disabled={isEdit || submitting}
                placeholder="0x..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                NFPM
              </label>
              <input
                value={draft.nfpm}
                onChange={(e) => onChange({ nfpm: e.target.value })}
                placeholder="0x..."
                disabled={submitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Gauge
              </label>
              <input
                value={draft.gauge}
                onChange={(e) => onChange({ gauge: e.target.value })}
                placeholder="0x..."
                disabled={submitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Token 0
              </label>
              <input
                value={draft.token0Address}
                onChange={(e) => onChange({ token0Address: e.target.value })}
                placeholder="0x..."
                disabled={submitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Token 1
              </label>
              <input
                value={draft.token1Address}
                onChange={(e) => onChange({ token1Address: e.target.value })}
                placeholder="0x..."
                disabled={submitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Pair
              </label>
              <input
                value={draft.pair}
                onChange={(e) => onChange({ pair: e.target.value })}
                placeholder="WETH-USDC"
                disabled={submitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Symbol
              </label>
              <input
                value={draft.symbol}
                onChange={(e) => onChange({ symbol: e.target.value })}
                placeholder="ETHUSDT"
                disabled={submitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Fee Tier
              </label>
              <select
                value={draft.feeTier}
                onChange={(e) => onChange({ feeTier: e.target.value })}
                disabled={submitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white disabled:opacity-60"
              >
                {FEE_OPTIONS.map((fee) => (
                  <option key={fee.value} value={fee.value}>
                    {fee.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Tick Spacing
              </label>
              <input
                value={draft.tickSpacing}
                onChange={(e) => onChange({ tickSpacing: e.target.value })}
                placeholder="e.g. 1, 10, 60"
                disabled={submitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Pool Type
              </label>
              <select
                value={draft.poolType}
                onChange={(e) => onChange({ poolType: e.target.value as PoolType })}
                disabled={submitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white disabled:opacity-60"
              >
                {TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Adapter
              </label>
              <input
                value={draft.adapterAddress}
                onChange={(e) => onChange({ adapterAddress: e.target.value })}
                placeholder="0x..."
                disabled={submitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Reward Token
              </label>
              <input
                value={draft.rewardToken}
                onChange={(e) => onChange({ rewardToken: e.target.value })}
                placeholder="0x..."
                disabled={submitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 disabled:opacity-60"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Reward Swap Pool
              </label>
              <input
                value={draft.rewardSwapPool}
                onChange={(e) => onChange({ rewardSwapPool: e.target.value })}
                placeholder="0x..."
                disabled={submitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-white">Active</div>
                <div className="text-xs text-slate-500">
                  Inactive pools stay registered but are shown as paused.
                </div>
              </div>

              <button
                type="button"
                onClick={() => onChange({ isActive: !draft.isActive })}
                disabled={submitting}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-60 ${
                  draft.isActive ? "bg-cyan-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    draft.isActive ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4">
          <button
            type="button"
            onClick={onValidate}
            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300 hover:text-cyan-300 hover:border-slate-500"
          >
            Validate
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:border-slate-500"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={
                submitting ||
                !draft.chain.trim() ||
                !draft.dexKey.trim() ||
                !draft.poolAddress.trim() ||
                !draft.nfpm.trim() ||
                !draft.token0Address.trim() ||
                !draft.token1Address.trim() ||
                !draft.rewardToken.trim()
              }
              className="rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-60"
            >
              {submitting ? "Saving..." : isEdit ? "Save changes" : "Create pool"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}