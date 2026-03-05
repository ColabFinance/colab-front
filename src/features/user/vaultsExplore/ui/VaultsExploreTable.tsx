"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/presentation/components/Button";
import { Badge } from "@/presentation/components/Badge";
import { AddressPill } from "@/presentation/components/AddressPill";
import { Surface } from "@/presentation/components/Surface";
import { VaultExploreItem } from "../types";
import { StarIcon } from "./icons";

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

function statusTone(status: VaultExploreItem["status"]) {
  if (status === "active") return "green";
  if (status === "paused") return "amber";
  return "red";
}

export function VaultsExploreTable({
  items,
  onToggleFavorite,
  onDeposit,
  onDetails,
}: {
  items: VaultExploreItem[];
  onToggleFavorite: (id: string) => void;
  onDeposit: (v: VaultExploreItem) => void;
  onDetails: (v: VaultExploreItem) => void;
}) {
  return (
    <Surface variant="table" className="bg-slate-900">
      <div className="overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-950/80 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="px-6 py-4 text-[11px] uppercase text-slate-500 font-bold tracking-wider border-b border-slate-800 w-[320px]">
                Vault
              </th>
              <th className="px-6 py-4 text-[11px] uppercase text-slate-500 font-bold tracking-wider border-b border-slate-800">
                Pair / Chain
              </th>
              <th className="px-6 py-4 text-[11px] uppercase text-slate-500 font-bold tracking-wider border-b border-slate-800 text-right">
                TVL (USD)
              </th>
              <th className="px-6 py-4 text-[11px] uppercase text-slate-500 font-bold tracking-wider border-b border-slate-800 text-right">
                APR / APY
              </th>
              <th className="px-6 py-4 text-[11px] uppercase text-slate-500 font-bold tracking-wider border-b border-slate-800 text-center">
                Status
              </th>
              <th className="px-6 py-4 text-[11px] uppercase text-slate-500 font-bold tracking-wider border-b border-slate-800 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800 bg-slate-900">
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
                          v.favorited ? "text-yellow-400 hover:text-yellow-300" : "text-slate-600 hover:text-yellow-400"
                        )}
                        aria-label={v.favorited ? "Unfavorite" : "Favorite"}
                        title={v.favorited ? "Favorited" : "Favorite"}
                      >
                        <StarIcon className="h-4 w-4" />
                      </button>

                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 grid place-items-center text-[10px] font-semibold text-slate-200">
                          {v.token0Symbol.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="-ml-3 h-8 w-8 rounded-full bg-slate-800 border border-slate-700 grid place-items-center text-[10px] font-semibold text-slate-200">
                          {v.token1Symbol.slice(0, 2).toUpperCase()}
                        </div>
                      </div>

                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                          {v.name}
                        </div>
                        <div className="mt-0.5">
                          <AddressPill address={v.address} withCopy className="bg-slate-900/60" />
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-slate-300 font-medium">
                        {v.pairType === "stable" ? "Stable" : "Volatile"}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
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
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide">APY</span>
                        <span className="text-sm font-bold text-green-400">{v.apyPct.toFixed(2)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-600 uppercase tracking-wide">APR</span>
                        <span className="text-xs font-medium text-slate-400">{v.aprPct.toFixed(1)}%</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <Badge tone={statusTone(v.status)} className="uppercase tracking-wide text-[10px] font-bold">
                      {v.status}
                    </Badge>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => onDetails(v)}>
                        Details
                      </Button>

                      <Button
                        variant="primary"
                        className={cn("px-3 py-1.5 text-xs", v.status !== "active" && "opacity-60 cursor-not-allowed")}
                        onClick={() => v.status === "active" && onDeposit(v)}
                        disabled={v.status !== "active"}
                      >
                        Deposit
                      </Button>
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
    </Surface>
  );
}