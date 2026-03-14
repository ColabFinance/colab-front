"use client";

import React from "react";
import { VaultExploreItem } from "../types";
import { ArrowRightIcon, PiggyBankIcon } from "./icons";
import { TokenPairAvatar } from "./TokenPairAvatar";

function formatUsd(n?: number | null) {
  if (n == null) return "—";

  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

function shortAddress(address: string) {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function MyVaultsSnapshot({
  items,
  onOpenMyVaults,
  onOpenVault,
}: {
  items: VaultExploreItem[];
  onOpenMyVaults: () => void;
  onOpenVault: (vault: VaultExploreItem) => void;
}) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <PiggyBankIcon className="h-4 w-4 text-cyan-400" />
          My Vaults
        </h2>

        <button
          type="button"
          onClick={onOpenMyVaults}
          className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
        >
          Open My Vaults
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-8 text-center">
          <div className="text-white font-semibold">No positions yet</div>
          <div className="text-sm text-slate-500 mt-1">
            When you create or join vaults, your snapshot will appear here.
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((vault) => (
            <button
              key={vault.id}
              type="button"
              onClick={() => onOpenVault(vault)}
              className="text-left bg-slate-950 border border-slate-700 rounded-lg p-4 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <TokenPairAvatar
                  token0Symbol={vault.token0Symbol}
                  token1Symbol={vault.token1Symbol}
                  size="sm"
                />

                <div className="min-w-0">
                  <div className="font-bold text-white text-sm truncate">
                    {vault.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {shortAddress(vault.address)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-slate-500 text-[10px] mb-1">Value</div>
                  <div className="text-white font-mono">
                    {formatUsd(vault.myPositionUsd ?? null)}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-[10px] mb-1">APY</div>
                  <div className="text-green-400 font-bold">
                    {vault.apyPct == null ? "—" : `${vault.apyPct.toFixed(1)}%`}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}