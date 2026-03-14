"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { VaultExploreItem } from "../types";
import { CopyIcon, ExternalLinkIcon, StarIcon } from "./icons";
import { TokenPairAvatar } from "./TokenPairAvatar";

function formatUsd(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

function formatPct(n: number) {
  const sign = n > 0 ? "+" : n < 0 ? "" : "";
  return `${sign}${n.toFixed(1)}%`;
}

function shortAddress(address: string) {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
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

export function VaultsExploreTable({
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
  function copyAddress(address: string) {
    void navigator.clipboard?.writeText(address);
  }

  return (
    <div className="flex-1 overflow-auto relative">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-950/80 sticky top-0 z-10 backdrop-blur-sm">
          <tr>
            <th className="px-6 py-4 text-[11px] uppercase text-slate-500 font-bold tracking-wider border-b border-slate-700 w-[280px]">
              Vault
            </th>
            <th className="px-6 py-4 text-[11px] uppercase text-slate-500 font-bold tracking-wider border-b border-slate-700">
              Market Context
            </th>
            <th className="px-6 py-4 text-[11px] uppercase text-slate-500 font-bold tracking-wider border-b border-slate-700 text-right">
              Value
            </th>
            <th className="px-6 py-4 text-[11px] uppercase text-slate-500 font-bold tracking-wider border-b border-slate-700 text-right">
              APR / APY
            </th>
            <th className="px-6 py-4 text-[11px] uppercase text-slate-500 font-bold tracking-wider border-b border-slate-700 text-center">
              State
            </th>
            <th className="px-6 py-4 text-[11px] uppercase text-slate-500 font-bold tracking-wider border-b border-slate-700 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-700/50 bg-slate-900">
          {items.map((v) => {
            const changeTone =
              v.tvlChange24hPct > 0
                ? "text-green-400"
                : v.tvlChange24hPct < 0
                ? "text-red-400"
                : "text-slate-500";

            return (
              <tr key={v.id} className="group hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(v.id)}
                      className={cn(
                        "transition-colors",
                        v.favorited
                          ? "text-yellow-400 hover:text-yellow-300"
                          : "text-slate-600 hover:text-yellow-400"
                      )}
                      aria-label={v.favorited ? "Unfavorite vault" : "Favorite vault"}
                    >
                      <StarIcon className="h-4 w-4" />
                    </button>

                    <TokenPairAvatar
                      token0Symbol={v.token0Symbol}
                      token1Symbol={v.token1Symbol}
                      size="sm"
                    />

                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                        {v.name}
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-mono text-slate-500">
                          {shortAddress(v.address)}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyAddress(v.address)}
                          className="text-slate-600 hover:text-slate-400 transition-colors"
                          title="Copy address"
                        >
                          <CopyIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
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

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span>{v.chainName}</span>
                      <span className="text-slate-700">•</span>
                      <span>{v.dexName}</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="text-sm font-mono text-white">{formatUsd(v.tvlUsd)}</div>
                  <div className={cn("text-[10px] font-medium", changeTone)}>
                    {formatPct(v.tvlChange24hPct)} <span className="text-slate-600">(24h)</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wide">APY</span>
                      <span className="text-sm font-bold text-green-400">{v.apyPct.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-600 uppercase tracking-wide">APR</span>
                      <span className="text-xs font-medium text-slate-400">{v.aprPct.toFixed(1)}%</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col items-center gap-1.5">
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
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onDetails(v)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                    >
                      Details
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenExplorer(v)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-300 bg-transparent hover:bg-slate-800 border border-transparent hover:border-slate-700 rounded-lg transition-colors"
                      title="View contract on explorer"
                    >
                      <ExternalLinkIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {items.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-16 text-center">
                <div className="mx-auto max-w-sm">
                  <div className="text-white font-semibold">No Vaults Found</div>
                  <div className="text-sm text-slate-500 mt-1">
                    No vaults match your current filters. Try adjusting your criteria.
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}