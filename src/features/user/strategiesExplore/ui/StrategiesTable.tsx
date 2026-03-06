import React from "react";
import Link from "next/link";
import { Badge } from "@/presentation/components/Badge";
import { Button } from "@/presentation/components/Button";
import { cn } from "@/shared/utils/cn";
import { computeMonogram, riskLabel, strategyRiskTone, typeLabel } from "../hooks";
import { StrategiesExploreItem } from "../types";

function fmtPct(v: number) {
  return `${v.toFixed(1)}%`;
}

function fmtUsd(v: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}

export function StrategiesTable({ items }: { items: StrategiesExploreItem[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[960px]">
        <thead>
          <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500 font-semibold">
            <th className="px-6 py-4 w-[280px]">Strategy</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4 text-center w-[120px]">Risk</th>
            <th className="px-6 py-4 text-center w-[110px]">Vaults</th>
            <th className="px-6 py-4 text-right w-[110px]">APR</th>
            <th className="px-6 py-4 text-right w-[110px]">APY</th>
            <th className="px-6 py-4 text-right w-[190px]">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800">
          {items.map((d) => {
            const mono = computeMonogram(d);
            return (
              <tr key={d.id} className="group hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg border border-slate-700 bg-gradient-to-br",
                        d.risk === "high"
                          ? "from-red-600/80 to-orange-500/70"
                          : d.risk === "medium"
                          ? "from-purple-600/70 to-pink-500/60"
                          : "from-blue-600/70 to-cyan-500/60"
                      )}
                    >
                      <div className="h-full w-full grid place-items-center text-white text-xs font-bold">
                        {mono}
                      </div>
                    </div>

                    <div>
                      <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {d.name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">{d.code}</div>
                      <div className="mt-1 text-[10px] text-slate-600">{typeLabel(d.type)}</div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <p className="text-sm text-slate-400 line-clamp-2">{d.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {d.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] rounded border border-slate-700 bg-slate-950 px-1.5 py-0.5 text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <Badge tone={strategyRiskTone(d.risk) as any}>{riskLabel(d.risk)}</Badge>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-950 text-slate-300 border border-slate-700">
                    {d.vaults}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="font-mono text-slate-300">{fmtPct(d.aprPct)}</div>
                  <div className="text-[10px] text-slate-600">{fmtUsd(d.tvlUsd)} TVL</div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="font-mono font-bold text-green-300">{fmtPct(d.apyPct)}</div>
                  <div className="text-[10px] text-slate-600">{d.updatedAtLabel}</div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/strategies/${encodeURIComponent(d.id)}`}
                      className="inline-flex"
                      title="View details"
                    >
                      <Button variant="ghost" className="px-3 py-2">
                        Details
                      </Button>
                    </Link>

                    <Link
                      href={`/vaults?strategyId=${encodeURIComponent(d.id)}`}
                      className="inline-flex"
                      title="Explore vaults using this strategy"
                    >
                      <Button variant="secondary" className="px-3 py-2 text-cyan-300">
                        Vaults →
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}

          {items.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                No strategies found for the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}