"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import type { MyStrategyRow } from "../types";

function tokenTone(symbol: string) {
  const s = symbol.toLowerCase();

  if (s.includes("eth")) return "bg-slate-700 text-white";
  if (s.includes("btc") || s.includes("wbtc")) return "bg-orange-500 text-white";
  if (s.includes("usdc")) return "bg-blue-500 text-white";
  if (s.includes("usdt")) return "bg-green-500 text-white";

  return "bg-cyan-600 text-white";
}

function tokenLetter(symbol: string) {
  return symbol.slice(0, 1).toUpperCase();
}

export function StrategiesTable({
  rows,
  onEditParams,
}: {
  rows: MyStrategyRow[];
  onEditParams: (row: MyStrategyRow) => void;
}) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1320px]">
          <thead className="bg-slate-950/40 text-[10px] uppercase text-slate-500 font-semibold tracking-wider">
            <tr>
              <th className="px-5 py-3.5 border-b border-slate-800">Strategy</th>
              <th className="px-5 py-3.5 border-b border-slate-800">Routing</th>
              <th className="px-5 py-3.5 border-b border-slate-800">LP Model</th>
              <th className="px-5 py-3.5 border-b border-slate-800">Vault Link</th>
              <th className="px-5 py-3.5 border-b border-slate-800 text-center">Visibility</th>
              <th className="px-5 py-3.5 border-b border-slate-800 text-center">Status</th>
              <th className="px-5 py-3.5 border-b border-slate-800">Updated</th>
              <th className="px-5 py-3.5 border-b border-slate-800 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {rows.map((row) => (
              <tr key={row.id} className="group hover:bg-slate-800/20 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center border font-mono text-xs font-bold",
                        row.status === "ACTIVE"
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                          : "bg-slate-800/50 text-slate-400 border-slate-700/50"
                      )}
                    >
                      #{row.id}
                    </div>

                    <div>
                      <div className="font-medium text-white text-sm">{row.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{row.symbol}</div>
                      <div className="text-[10px] text-slate-500 break-all">{row.indicatorSetId}</div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="space-y-1.5">
                    <div className="text-[10px] text-slate-400 bg-slate-800/60 w-fit px-2 py-0.5 rounded">
                      {row.dexName}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border border-slate-900 flex items-center justify-center text-[8px] font-bold",
                            tokenTone(row.token0Symbol)
                          )}
                        >
                          {tokenLetter(row.token0Symbol)}
                        </div>
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border border-slate-900 flex items-center justify-center text-[8px] font-bold",
                            tokenTone(row.token1Symbol)
                          )}
                        >
                          {tokenLetter(row.token1Symbol)}
                        </div>
                      </div>

                      <span className="text-xs text-slate-300">{row.poolPairLabel}</span>
                      <span className="text-[10px] text-slate-500">{row.feeLabel}</span>
                    </div>

                    <div className="text-[10px] text-slate-500">{row.chainName}</div>
                    <div className="text-[10px] text-slate-600 font-mono break-all">{row.streamKey || "-"}</div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="space-y-2">
                    <div className="text-xs text-slate-300">{row.strategyVersion}</div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] border border-slate-700 bg-slate-800/60 text-slate-300">
                        width {row.fixedRangeWidthPct}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] border border-slate-700 bg-slate-800/60 text-slate-300">
                        side {row.initialSide}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] border border-slate-700 bg-slate-800/60 text-slate-300">
                        breakout {row.breakoutConfirmBars}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] border border-slate-700 bg-slate-800/60 text-slate-300">
                        ATR {row.atrEnabled ? row.atrPeriod : "off"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] border",
                          row.atrRebalanceEnabled
                            ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
                            : "border-slate-700 bg-slate-800/60 text-slate-500"
                        )}
                      >
                        ATR rebalance
                      </span>

                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] border",
                          row.entryFiltersEnabled
                            ? "border-violet-500/20 bg-violet-500/10 text-violet-300"
                            : "border-slate-700 bg-slate-800/60 text-slate-500"
                        )}
                      >
                        entry filters
                      </span>

                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] border",
                          row.allowCashWhenFilterFails
                            ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                            : "border-slate-700 bg-slate-800/60 text-slate-500"
                        )}
                      >
                        cash fallback
                      </span>

                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] border",
                          row.gaugeEnabled
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                            : "border-slate-700 bg-slate-800/60 text-slate-500"
                        )}
                      >
                        gauge {row.gaugeEnabled ? "on" : "off"}
                      </span>

                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] border border-slate-700 bg-slate-800/60 text-slate-300">
                        {row.atrWidthRuleCount} ATR rules
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  {row.vaultLabel ? (
                    <div className="space-y-1">
                      <div className="text-xs text-cyan-400">{row.vaultLabel}</div>
                      <div className="text-[10px] text-slate-500">{row.dexName}</div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">Not linked</span>
                  )}
                </td>

                <td className="px-5 py-4 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-medium border",
                      row.isPublic
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                        : "bg-slate-700/20 text-slate-400 border-slate-600/20"
                    )}
                  >
                    {row.isPublic ? "PUBLIC" : "PRIVATE"}
                  </span>
                </td>

                <td className="px-5 py-4 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-medium border",
                      row.status === "ACTIVE"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-slate-700/20 text-slate-400 border-slate-600/20"
                    )}
                  >
                    {row.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="text-xs text-slate-400">{row.updatedAtLabel}</div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/strategies/${encodeURIComponent(String(row.id))}`}
                      className="px-3 py-1.5 text-xs rounded-full border border-slate-700 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                    >
                      Details
                    </Link>

                    <button
                      type="button"
                      onClick={() => onEditParams(row)}
                      className="px-3 py-1.5 text-xs rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/15 hover:text-cyan-300 transition-colors"
                    >
                      Edit Params
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                  No strategies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}