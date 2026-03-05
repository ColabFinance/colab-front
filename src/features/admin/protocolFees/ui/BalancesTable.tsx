import React from "react";
import { AddressPill } from "@/presentation/components/AddressPill";
import { Surface, SurfaceHeader } from "@/presentation/components/Surface";
import { cn } from "@/shared/utils/cn";
import { ProtocolFeeBalanceItem } from "../types";

export function BalancesTable({
  items,
  tokenQuery,
  onTokenQueryChange,
  onRefresh,
  onWithdraw,
  className,
}: {
  items: ProtocolFeeBalanceItem[];
  tokenQuery: string;
  onTokenQueryChange: (v: string) => void;
  onRefresh: () => void;
  onWithdraw: (balanceId: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-white">Balances</h3>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh"
          >
            ↻
          </button>

          <div className="relative w-full sm:w-60">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
              🔎
            </span>
            <input
              value={tokenQuery}
              onChange={(e) => onTokenQueryChange(e.target.value)}
              placeholder="Filter tokens..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-8 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <Surface variant="table">
        <SurfaceHeader className="bg-slate-950/40">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Collector balances
          </div>
        </SurfaceHeader>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left border-collapse">
            <thead className="bg-slate-950/40 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-slate-700">Token</th>
                <th className="px-6 py-4 border-b border-slate-700">Address</th>
                <th className="px-6 py-4 border-b border-slate-700 text-right">Balance</th>
                <th className="px-6 py-4 border-b border-slate-700 text-right">Value (USD)</th>
                <th className="px-6 py-4 border-b border-slate-700 text-right">Last Updated</th>
                <th className="px-6 py-4 border-b border-slate-700 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700 bg-slate-900">
              {items.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full border border-slate-700 bg-slate-950 grid place-items-center">
                        <span className="text-xs font-semibold text-slate-200">
                          {row.symbol.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{row.symbol}</div>
                        <div className="text-xs text-slate-500">{row.name}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <AddressPill address={row.tokenAddress} />
                  </td>

                  <td className="px-6 py-4 text-right font-mono text-sm text-slate-200">
                    {row.balanceLabel}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-medium text-white">{row.valueUsdLabel}</div>
                  </td>

                  <td className="px-6 py-4 text-right text-xs text-slate-500">
                    {row.updatedAtLabel}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onWithdraw(row.id)}
                        className="rounded-md border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-500 hover:text-white transition-colors"
                      >
                        Withdraw
                      </button>
                      {row.tokenExplorerUrl && (
                        <a
                          href={row.tokenExplorerUrl}
                          className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View on explorer"
                        >
                          ↗
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <div className="inline-flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full border border-slate-700 bg-slate-950 grid place-items-center text-slate-500">
                        ⓘ
                      </div>
                      <div className="text-sm text-slate-300 font-medium">No balances found</div>
                      <div className="text-xs text-slate-500">
                        The collector contract currently holds no tokens.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Surface>
    </div>
  );
}