import React from "react";
import { Surface, SurfaceHeader } from "@/presentation/components/Surface";
import { AddressPill } from "@/presentation/components/AddressPill";
import { Badge } from "@/presentation/components/Badge";
import { cn } from "@/shared/utils/cn";
import { VaultUsingStrategy } from "../types";

function fmtUsd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function fmtPct(n: number) {
  return `${n.toFixed(1)}%`;
}

export function VaultsUsingStrategyTable({
  vaults,
  filter,
  onChangeFilter,
}: {
  vaults: VaultUsingStrategy[];
  filter: string;
  onChangeFilter: (v: string) => void;
}) {
  return (
    <Surface variant="table">
      <SurfaceHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">Vaults Using This Strategy</h3>
          <p className="text-sm text-slate-400">
            Active client vaults currently deployed with this strategy logic.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <div className="relative w-full sm:w-56">
            <input
              value={filter}
              onChange={(e) => onChangeFilter(e.target.value)}
              placeholder="Filter vaults..."
              className={cn(
                "w-full rounded-lg border border-slate-700 bg-slate-900",
                "px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500",
                "focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30"
              )}
            />
          </div>
        </div>
      </SurfaceHeader>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[860px]">
          <thead>
            <tr className="bg-slate-950/40 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Vault Name</th>
              <th className="px-6 py-4">Pair</th>
              <th className="px-6 py-4 text-right">TVL</th>
              <th className="px-6 py-4 text-right">APR</th>
              <th className="px-6 py-4 text-right">APY</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {vaults.map((v, idx) => (
              <tr key={v.id} className="group hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded grid place-items-center text-xs font-bold text-white shadow-sm",
                        idx % 3 === 0
                          ? "bg-gradient-to-br from-blue-600 to-indigo-600"
                          : idx % 3 === 1
                          ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                          : "bg-gradient-to-br from-slate-600 to-slate-500"
                      )}
                      aria-hidden="true"
                    >
                      V{idx + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="font-medium text-white group-hover:text-cyan-300 transition-colors">
                        {v.name}
                      </div>
                      <div className="mt-1">
                        <AddressPill address={v.address} withCopy className="bg-slate-900/60" />
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">{v.pairLabel}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-950/40 border border-slate-700 text-[10px] text-slate-400">
                      {v.feeTierLabel}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="font-mono text-slate-200">{fmtUsd(v.tvlUsd)}</div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="font-mono text-slate-300">{fmtPct(v.aprPct)}</div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="font-mono font-semibold text-green-400">{fmtPct(v.apyPct)}</div>
                </td>

                <td className="px-6 py-4 text-center">
                  {v.status === "active" ? (
                    <Badge tone="green" className="gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      Active
                    </Badge>
                  ) : (
                    <Badge tone="amber" className="gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Paused
                    </Badge>
                  )}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    className="text-slate-400 hover:text-white transition-colors"
                    title="View vault"
                  >
                    →
                  </button>
                </td>
              </tr>
            ))}

            {vaults.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-500">
                  No vaults found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}