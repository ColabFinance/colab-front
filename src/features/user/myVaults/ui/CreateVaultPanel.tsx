"use client";

import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import { Button } from "@/presentation/components/Button";
import { cn } from "@/shared/utils/cn";
import { CreateVaultFormState } from "../hooks";
import { StrategyOption } from "../types";
import { IconChevronDown, IconInfo } from "./icons";

export function CreateVaultPanel({
  state,
  setState,
  strategies,
  selectedStrategy,
  onCancel,
}: {
  state: CreateVaultFormState;
  setState: React.Dispatch<React.SetStateAction<CreateVaultFormState>>;
  strategies: StrategyOption[];
  selectedStrategy?: StrategyOption;
  onCancel: () => void;
}) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Surface variant="panel">
            <SurfaceHeader>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs border border-blue-500/30">
                  1
                </span>
                <div className="text-white font-semibold">Vault Configuration</div>
              </div>
            </SurfaceHeader>

            <SurfaceBody className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Strategy</label>
                <div className="relative">
                  <select
                    value={state.strategyId}
                    onChange={(e) => setState((s) => ({ ...s, strategyId: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    {strategies.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.key})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <IconChevronDown className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Select one of your registered strategies to bind to this vault.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Vault Alias</label>
                  <input
                    value={state.alias}
                    onChange={(e) => setState((s) => ({ ...s, alias: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g. My Savings Vault"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Internal Name</label>
                  <input
                    value={state.internalName}
                    onChange={(e) => setState((s) => ({ ...s, internalName: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g. vault-01-alpha"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={state.description}
                  onChange={(e) => setState((s) => ({ ...s, description: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors min-h-[80px]"
                  placeholder="Purpose of this vault..."
                />
              </div>
            </SurfaceBody>
          </Surface>

          <Surface variant="panel" className="overflow-hidden">
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, advancedOpen: !s.advancedOpen }))}
              className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-700/30 text-slate-400 flex items-center justify-center text-xs border border-slate-700">
                  2
                </span>
                <span className="font-semibold text-white">Advanced Configuration</span>
                <span className="text-xs text-slate-500 ml-2 font-normal">(Optional)</span>
              </div>

              <IconChevronDown
                className={cn("h-4 w-4 text-slate-500 transition-transform", state.advancedOpen && "rotate-180")}
              />
            </button>

            {state.advancedOpen && (
              <div className="border-t border-slate-800 p-4 bg-slate-950/30">
                <label className="block text-sm font-medium text-slate-300 mb-2">Swap Pools JSON</label>
                <textarea
                  value={state.swapPoolsJson}
                  onChange={(e) => setState((s) => ({ ...s, swapPoolsJson: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 focus:outline-none focus:border-cyan-500 leading-relaxed min-h-[150px]"
                  spellCheck={false}
                  placeholder={`{
  "swapRouter": "0x...",
  "paths": [
    { "tokenIn": "0x...", "tokenOut": "0x...", "fee": 500 }
  ]
}`}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Override default swap paths for complex routing requirements.
                </p>
              </div>
            )}
          </Surface>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                // mock placeholder (wire backend later)
              }}
            >
              Create Vault
            </Button>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <Surface variant="panel" className="lg:sticky lg:top-24">
            <SurfaceHeader>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Derived Details</div>
            </SurfaceHeader>

            <SurfaceBody className="space-y-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Exchange</div>
                <div className="text-sm text-white font-medium">{selectedStrategy?.dexName ?? "—"}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Pool</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-300">{selectedStrategy?.poolAddressShort ?? "—"}</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                    {selectedStrategy?.pairLabel ?? "—"}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Adapter</div>
                <div className="text-sm text-slate-300">
                  {selectedStrategy?.adapterStatus === "ok" ? "Compatible Adapter Found" : "No Adapter Found"}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Gauge</div>
                <div className="text-sm text-slate-500">
                  {selectedStrategy?.gaugeStatus === "available" ? "Gauge Available" : "No Gauge Available"}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-2">
                  <IconInfo className="h-4 w-4 text-blue-300 mt-0.5" />
                  <p className="text-xs text-blue-200/80 leading-relaxed">
                    This vault will be deployed as a proxy contract owned by your wallet.
                  </p>
                </div>
              </div>
            </SurfaceBody>
          </Surface>
        </div>
      </div>
    </div>
  );
}