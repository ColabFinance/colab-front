import React from "react";
import { Surface } from "@/presentation/components/Surface";
import { cn } from "@/shared/utils/cn";
import { PortfolioKpis } from "../types";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPct(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

type Tone = "blue" | "green" | "cyan" | "violet";

function accent(tone: Tone) {
  if (tone === "blue") return "hover:border-blue-500/30";
  if (tone === "green") return "hover:border-green-500/30";
  if (tone === "cyan") return "hover:border-cyan-500/30";
  return "hover:border-violet-500/30";
}

function cornerGlow(tone: Tone) {
  if (tone === "blue") return "bg-blue-500/5";
  if (tone === "green") return "bg-green-500/5";
  if (tone === "cyan") return "bg-cyan-500/5";
  return "bg-violet-500/5";
}

export function KpiGrid({ kpis }: { kpis: PortfolioKpis }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Surface className={cn("p-5 relative overflow-hidden group transition-all", accent("blue"))} variant="card">
        <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110", cornerGlow("blue"))} />
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Total Deposited
          </div>
          <div className="text-2xl font-bold text-white font-mono mb-2">
            {formatUsd(kpis.totalDepositedUsd)}
          </div>
          <div className="flex items-center text-xs text-slate-400">
            <span className="bg-slate-950/40 px-1.5 py-0.5 rounded text-[10px] border border-slate-700 mr-2">
              Principal
            </span>
            Across {kpis.activePositions} vaults
          </div>
        </div>
      </Surface>

      <Surface className={cn("p-5 relative overflow-hidden group transition-all", accent("green"))} variant="card">
        <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110", cornerGlow("green"))} />
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start mb-1">
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Current Value</div>
            <div className="flex items-center gap-1 text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded text-[10px] font-medium border border-green-500/10">
              {formatUsd(kpis.netProfitUsd)}
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono mb-2">
            {formatUsd(kpis.currentValueUsd)}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Net Profit</span>
            <span className={cn("font-mono font-bold", kpis.netProfitPct >= 0 ? "text-green-400" : "text-red-400")}>
              {formatPct(kpis.netProfitPct)}
            </span>
          </div>
        </div>
      </Surface>

      <Surface className={cn("p-5 relative overflow-hidden group transition-all", accent("cyan"))} variant="card">
        <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110", cornerGlow("cyan"))} />
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Unclaimed Rewards
          </div>
          <div className="text-2xl font-bold text-cyan-300 font-mono mb-2">
            {formatUsd(kpis.unclaimedRewardsUsd)}
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div className="text-xs text-slate-400">Across active positions</div>
            <button
              type="button"
              className="text-[10px] font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 px-2.5 py-1 rounded transition-colors shadow-[0_0_20px_-10px_rgba(34,211,238,0.55)]"
            >
              Claim All
            </button>
          </div>
        </div>
      </Surface>

      <Surface className={cn("p-5 relative overflow-hidden group transition-all", accent("violet"))} variant="card">
        <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110", cornerGlow("violet"))} />
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Avg. Performance
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-white font-mono">{kpis.avgApyPct.toFixed(1)}%</span>
            <span className="text-xs text-slate-500 font-medium">APY</span>
          </div>
          <div className="w-full bg-slate-950/60 rounded-full h-1.5 mb-2 overflow-hidden border border-slate-800/60">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
              style={{ width: `${Math.min(100, Math.max(0, kpis.avgApyPct * 5))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>
              APR: <span className="text-slate-200 font-mono">{kpis.avgAprPct.toFixed(1)}%</span>
            </span>
            <span>
              Positions: <span className="text-white">{kpis.activePositions} Active</span>
            </span>
          </div>
        </div>
      </Surface>
    </div>
  );
}