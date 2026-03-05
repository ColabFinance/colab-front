"use client";

import { PoolDraft } from "../types";
import { Surface } from "@/presentation/components/Surface";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  titleSuffix?: string | null;

  draft: PoolDraft;
  onChange: (patch: Partial<PoolDraft>) => void;

  onClose: () => void;
  onValidate: () => void;
  onSave: () => void;
};

export function PoolDrawer({
  open,
  mode,
  titleSuffix,
  draft,
  onChange,
  onClose,
  onValidate,
  onSave,
}: Props) {
  return (
    <>
      <div
        className={[
          "fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={onClose}
      />

      <div
        className={[
          "fixed inset-y-0 right-0 z-[70] w-full max-w-lg border-l border-slate-700 bg-slate-900 shadow-2xl flex flex-col",
          "transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Pool Drawer"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-950/50">
          <div>
            <h3 className="text-xl font-bold text-white">
              {mode === "edit" ? `Edit ${titleSuffix ?? ""}` : "Add New Pool"}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Configure a liquidity pool for strategy execution.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white transition-colors px-3 py-2 hover:bg-slate-800 rounded-lg border border-slate-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Pool Identification
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  DEX Key <span className="text-red-400">*</span>
                </label>
                <select
                  value={draft.dexKey}
                  onChange={(e) => onChange({ dexKey: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                >
                  <option value="" disabled>
                    Select DEX...
                  </option>
                  <option value="uniswap_v3">uniswap_v3</option>
                  <option value="curve_v2">curve_v2</option>
                  <option value="balancer_v2">balancer_v2</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Pool Address <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    value={draft.poolAddress}
                    onChange={(e) => onChange({ poolAddress: e.target.value })}
                    placeholder="0x..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white font-mono focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none placeholder-slate-500"
                  />
                  <button
                    type="button"
                    className="px-3 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-lg hover:border-cyan-400/40 transition-all whitespace-nowrap text-xs"
                    title="Fetch Metadata"
                    onClick={() => {
                      // futuramente: fetch metadata onchain
                    }}
                  >
                    Fetch
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">
                  Enter address and click Fetch to auto-populate tokens.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Token Configuration
            </h4>

            <div className="grid grid-cols-1 gap-4">
              <Surface variant="inset" className="p-3">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Token 0 Address <span className="text-red-400">*</span>
                </label>
                <input
                  value={draft.token0Address}
                  onChange={(e) => onChange({ token0Address: e.target.value })}
                  placeholder="0x..."
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white font-mono mb-2 focus:border-cyan-400 focus:outline-none placeholder-slate-500"
                />
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Symbol: <span className="text-slate-200 font-mono">--</span></span>
                </div>
              </Surface>

              <Surface variant="inset" className="p-3">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Token 1 Address <span className="text-red-400">*</span>
                </label>
                <input
                  value={draft.token1Address}
                  onChange={(e) => onChange({ token1Address: e.target.value })}
                  placeholder="0x..."
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white font-mono mb-2 focus:border-cyan-400 focus:outline-none placeholder-slate-500"
                />
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Symbol: <span className="text-slate-200 font-mono">--</span></span>
                </div>
              </Surface>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Pool Parameters
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Fee Tier <span className="text-red-400">*</span>
                </label>
                <select
                  value={draft.feeTier}
                  onChange={(e) => onChange({ feeTier: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                >
                  <option value="100">100 (0.01%)</option>
                  <option value="500">500 (0.05%)</option>
                  <option value="3000">3000 (0.3%)</option>
                  <option value="10000">10000 (1%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">Tick Spacing</label>
                <input
                  value={draft.tickSpacing}
                  onChange={(e) => onChange({ tickSpacing: e.target.value })}
                  type="number"
                  placeholder="e.g. 10"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none placeholder-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-700">
              <div>
                <span className="block text-sm font-medium text-white">Stable Pair</span>
                <span className="text-xs text-slate-500">Is this a stablecoin pair? (e.g. USDC/DAI)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.isStablePair}
                  onChange={(e) => onChange({ isStablePair: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:bg-cyan-500" />
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-700">
              <div>
                <span className="block text-sm font-medium text-white">Pool Status</span>
                <span className="text-xs text-slate-500">Enable or pause interactions with this pool</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.isActive}
                  onChange={(e) => onChange({ isActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:bg-cyan-500" />
              </label>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3 items-start">
            <div className="text-amber-300 mt-0.5">⚠</div>
            <div className="text-xs text-amber-200">
              <p className="font-bold mb-1">Validation Required</p>
              <p className="opacity-80">
                Before saving, please validate that the pool parameters match the on-chain contract state.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700 bg-slate-950/50 flex flex-col gap-3">
          <button
            onClick={onValidate}
            className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-400/40 rounded-lg text-sm font-medium transition-all"
          >
            Validate Pool Match
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-sm font-medium transition-all"
            >
              Save Pool
            </button>
          </div>
        </div>
      </div>
    </>
  );
}