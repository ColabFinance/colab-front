"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { VaultExploreItem } from "../types";
import { ExternalLinkIcon, StarIcon } from "./icons";
import { TokenPairAvatar } from "./TokenPairAvatar";

function formatUsd(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

function statusClasses(status: VaultExploreItem["status"]) {
  if (status === "active") {
    return "bg-green-500/10 text-green-400 border border-green-500/20";
  }

  if (status === "paused") {
    return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
  }

  return "bg-red-500/10 text-red-400 border border-red-500/20";
}

function rangeClasses(rangeStatus: VaultExploreItem["rangeStatus"]) {
  if (rangeStatus === "inside") {
    return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
  }

  return "bg-red-500/10 text-red-400 border border-red-500/20";
}

function rangeLabel(rangeStatus: VaultExploreItem["rangeStatus"]) {
  if (rangeStatus === "inside") return "In Range";
  if (rangeStatus === "below") return "Below Range";
  return "Above Range";
}

function shortAddress(address: string) {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function VaultsExploreGrid({
  items,
  onToggleFavorite,
  onDetails,
  onOpenExplorer,
}: {
  items: VaultExploreItem[];
  onToggleFavorite: (id: string) => void;
  onDetails: (v: VaultExploreItem) => void;
  onOpenExplorer: (v: VaultExploreItem) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="p-8 md:p-12 text-center">
        <div className="text-white font-semibold">No Vaults Found</div>
        <div className="text-sm text-slate-500 mt-1">
          No vaults match your current filters. Try adjusting your criteria.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((v) => (
          <div
            key={v.id}
            className="bg-slate-950 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <TokenPairAvatar
                  token0Symbol={v.token0Symbol}
                  token1Symbol={v.token1Symbol}
                  size="sm"
                />

                <div className="min-w-0">
                  <div className="font-bold text-white text-sm truncate">{v.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {shortAddress(v.address)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleFavorite(v.id)}
                className={cn(
                  "transition-colors shrink-0",
                  v.favorited
                    ? "text-yellow-400 hover:text-yellow-300"
                    : "text-slate-600 hover:text-yellow-400"
                )}
                aria-label="Toggle favorite vault"
              >
                <StarIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-medium">
                {v.token0Symbol}/{v.token1Symbol}
              </span>

              <span className="text-[10px] text-slate-500">
                {v.pairType === "stable" ? "Stable" : "Volatile"}
              </span>

              {v.hasGauge && (
                <span className="text-[10px] px-2 py-0.5 rounded border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 font-medium">
                  Gauge
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">TVL</div>
                <div className="mt-1 text-sm font-mono text-white">{formatUsd(v.tvlUsd)}</div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">APY</div>
                <div className="mt-1 text-sm font-bold text-green-400">{v.apyPct.toFixed(2)}%</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide",
                  statusClasses(v.status)
                )}
              >
                {v.status}
              </span>

              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium",
                  rangeClasses(v.rangeStatus)
                )}
              >
                {rangeLabel(v.rangeStatus)}
              </span>

              <span className="text-[10px] text-slate-500">
                {v.chainName} • {v.dexName}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onDetails(v)}
                className="flex-1 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                Details
              </button>

              <button
                type="button"
                onClick={() => onOpenExplorer(v)}
                className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-300 bg-transparent hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                title="View contract on explorer"
              >
                <ExternalLinkIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}