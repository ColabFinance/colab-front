import React from "react";
import { Card } from "@/presentation/components/Card";

function fmtPct(v: number) {
  return `${v.toFixed(1)}%`;
}

function fmtInt(v: number) {
  return new Intl.NumberFormat("en-US").format(v);
}

export function StatsRow({
  totalStrategies,
  activeVaults,
  avgApy,
}: {
  totalStrategies: number;
  activeVaults: number;
  avgApy: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Total Strategies</div>
          <div className="text-xl font-bold text-white">{fmtInt(totalStrategies)}</div>
        </div>
        <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 grid place-items-center text-blue-300">
          <span className="text-sm font-semibold">S</span>
        </div>
      </Card>

      <Card className="p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Active Vaults</div>
          <div className="text-xl font-bold text-white">{fmtInt(activeVaults)}</div>
        </div>
        <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 grid place-items-center text-cyan-300">
          <span className="text-sm font-semibold">V</span>
        </div>
      </Card>

      <Card className="p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Avg Protocol APY</div>
          <div className="text-xl font-bold text-green-300">{fmtPct(avgApy)}</div>
        </div>
        <div className="h-10 w-10 rounded-lg bg-green-500/10 border border-green-500/20 grid place-items-center text-green-300">
          <span className="text-sm font-semibold">%</span>
        </div>
      </Card>
    </div>
  );
}