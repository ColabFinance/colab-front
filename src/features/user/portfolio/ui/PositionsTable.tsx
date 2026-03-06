import React from "react";
import { Surface, SurfaceHeader } from "@/presentation/components/Surface";
import { Badge } from "@/presentation/components/Badge";
import { Icon } from "@/presentation/icons/Icon";
import { cn } from "@/shared/utils/cn";
import { PortfolioPosition, PortfolioTab, RiskLevel } from "../types";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function riskBadge(risk: RiskLevel) {
  if (risk === "low") return { tone: "green" as const, label: "Low Risk" };
  if (risk === "high") return { tone: "red" as const, label: "High Risk" };
  return { tone: "amber" as const, label: "Med Risk" };
}

function statusBadge(status: PortfolioPosition["status"]) {
  if (status === "active") return { tone: "green" as const, label: "Active" };
  if (status === "paused") return { tone: "amber" as const, label: "Paused" };
  return { tone: "slate" as const, label: "Closed" };
}

function iconBoxClasses(v: PortfolioPosition["iconVariant"]) {
  if (v === "blueCyan") return "bg-gradient-to-br from-blue-600 to-cyan-500";
  if (v === "orangeRed") return "bg-gradient-to-br from-orange-500 to-red-500";
  if (v === "purpleIndigo") return "bg-gradient-to-br from-purple-600 to-indigo-600";
  return "bg-gradient-to-br from-slate-600 to-slate-500";
}

export function PositionsTable({
  tab,
  onTabChange,
  query,
  onQueryChange,
  positions,
}: {
  tab: PortfolioTab;
  onTabChange: (t: PortfolioTab) => void;
  query: string;
  onQueryChange: (q: string) => void;
  positions: PortfolioPosition[];
}) {
  return (
    <Surface variant="table" className="flex flex-col min-w-0">
      <SurfaceHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Icon name="layerGroup" className="text-slate-400" />
          <h3 className="text-lg font-bold text-white">My Positions</h3>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex bg-slate-950/60 rounded-lg p-0.5 border border-slate-700 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onTabChange("active")}
              className={cn(
                "flex-1 sm:flex-none px-3 py-1 text-xs font-medium rounded-md transition-colors",
                tab === "active"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              )}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => onTabChange("history")}
              className={cn(
                "flex-1 sm:flex-none px-3 py-1 text-xs font-medium rounded-md transition-colors",
                tab === "history"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              )}
            >
              History
            </button>
          </div>

          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="search" className="h-4 w-4 text-slate-500" />
            </div>
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search positions..."
              className={cn(
                "w-[260px] pl-9 pr-3 py-2 text-sm rounded-lg",
                "border border-slate-700 bg-slate-900 text-slate-200 placeholder:text-slate-500",
                "focus:outline-none focus:ring-1 focus:ring-cyan-500/60 focus:border-cyan-500/40"
              )}
            />
          </div>
        </div>
      </SurfaceHeader>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[780px] lg:min-w-0">
          <thead>
            <tr className="bg-slate-950/40 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-5 py-4">Vault / Strategy</th>
              <th className="px-5 py-4 text-right">Deposited</th>
              <th className="px-5 py-4 text-right">Current Value</th>
              <th className="px-5 py-4 text-right">Profit</th>
              <th className="px-5 py-4 text-right">APY</th>
              <th className="px-5 py-4 text-center">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {positions.map((p) => {
              const risk = riskBadge(p.risk);
              const st = statusBadge(p.status);
              const profitGood = p.profitUsd >= 0;

              return (
                <tr key={p.id} className="group hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0",
                          iconBoxClasses(p.iconVariant)
                        )}
                        aria-hidden="true"
                      >
                        <Icon name="water" className="h-4 w-4 opacity-90" />
                      </div>

                      <div>
                        <div className="font-medium text-white text-sm group-hover:text-cyan-300 transition-colors">
                          {p.vaultName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-950/40 px-1.5 rounded border border-slate-700">
                            {p.pairLabel}
                          </span>
                          <span className={cn("text-[10px] font-medium", risk.tone === "green" ? "text-green-400" : risk.tone === "red" ? "text-red-400" : "text-amber-400")}>
                            {risk.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="text-sm font-mono text-slate-300">{formatUsd(p.depositedUsd)}</div>
                    {p.depositedSubLabel && <div className="text-[10px] text-slate-500">{p.depositedSubLabel}</div>}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="text-sm font-mono text-white font-medium">{formatUsd(p.currentValueUsd)}</div>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className={cn("text-sm font-mono", profitGood ? "text-green-400" : "text-red-400")}>
                      {profitGood ? "+" : "-"}
                      {formatUsd(Math.abs(p.profitUsd))}
                    </div>
                    <div className={cn("text-[10px] font-medium", profitGood ? "text-green-500/80" : "text-red-500/80")}>
                      {(profitGood ? "+" : "-") + Math.abs(p.profitPct).toFixed(2)}%
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="text-sm font-mono text-slate-200">{p.apyPct.toFixed(1)}%</div>
                    <div className="text-[10px] text-slate-500">APR: {p.aprPct.toFixed(1)}%</div>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <Badge tone={st.tone} className="text-[10px] px-2 py-0.5">
                      {st.label}
                    </Badge>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                        title="Manage Vault"
                      >
                        <Icon name="vault" className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
                        title="Claim Rewards"
                      >
                        <Icon name="fees" className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                        title="View Details"
                      >
                        <Icon name="chevronDown" className="h-4 w-4 -rotate-90" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {positions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                  No positions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}