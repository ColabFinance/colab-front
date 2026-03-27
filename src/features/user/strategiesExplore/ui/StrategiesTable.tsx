import React from "react";
import Link from "next/link";
import { Button } from "@/presentation/components/Button";
import { cn } from "@/shared/utils/cn";
import { chainLabel, computeMonogram, monogramTone, statusLabel } from "../hooks";
import { StrategiesExploreItem } from "../types";

function chainShortLabel(chain: StrategiesExploreItem["chain"]) {
  if (chain === "base") return "BASE";
  return "BNB";
}

export function StrategiesTable({ items }: { items: StrategiesExploreItem[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1000px] text-left border-collapse">
        <thead>
          <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500 font-semibold">
            <th className="px-6 py-4">Strategy ID</th>
            <th className="px-6 py-4">Name / Symbol</th>
            <th className="px-6 py-4">Indicator Set</th>
            <th className="px-6 py-4 text-center">Chain</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Vault Link</th>
            <th className="px-6 py-4 text-center">Updated</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800">
          {items.map((item) => {
            const mono = computeMonogram(item);

            return (
              <tr key={item.id} className="group hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-mono text-xs text-slate-400">{item.strategyIdLabel}</div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-lg",
                        monogramTone(item)
                      )}
                    >
                      <span className="text-white text-xs font-bold">{mono}</span>
                    </div>

                    <div>
                      <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">{item.code}</div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm text-slate-300">{item.indicatorSetName}</div>
                  {item.indicatorSetCode && item.indicatorSetCode !== item.indicatorSetName ? (
                    <div className="text-xs text-slate-500 font-mono">{item.indicatorSetCode}</div>
                  ) : null}
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-md">
                    <span className="text-xs text-slate-300">{chainShortLabel(item.chain)}</span>
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1">{chainLabel(item.chain)}</div>
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      item.status === "active"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    )}
                  >
                    {statusLabel(item.status)}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
                      item.linkedVault
                        ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                        : "bg-slate-500/10 border-slate-500/20 text-slate-400"
                    )}
                  >
                    {item.linkedVault ? "Linked" : "No Vault"}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="text-xs text-slate-400">{item.updatedAtLabel}</div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end">
                    <Link
                      href={`/strategies/${encodeURIComponent(item.id)}`}
                      className="inline-flex"
                      title="Details"
                    >
                      <Button variant="secondary" className="px-3 py-2 text-xs">
                        Details
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}

          {items.length === 0 && (
            <tr>
              <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                No public strategies found for the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}