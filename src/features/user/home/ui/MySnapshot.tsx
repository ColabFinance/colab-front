import React from "react";
import { Surface } from "@/presentation/components/Surface";
import type { HomeSnapshot } from "../types";

export function MySnapshot({ data }: { data: HomeSnapshot }) {
  return (
    <Surface variant="panel" className="p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative">
        <div className="space-y-1">
          <div className="text-slate-400 text-xs font-medium">Total Deposited</div>
          <div className="text-2xl font-bold text-white">{data.totalDepositedUsd}</div>
          <div className="text-[10px] text-slate-500 font-mono">{data.totalDepositedLabel}</div>
        </div>

        <div className="space-y-1">
          <div className="text-slate-400 text-xs font-medium">Current Value</div>
          <div className="text-2xl font-bold text-white">{data.currentValueUsd}</div>
          <div className="text-[10px] text-green-300 flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
            {data.currentValueHint}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-slate-400 text-xs font-medium">Total Profit</div>
          <div className="text-2xl font-bold text-green-300">{data.totalProfitUsd}</div>
          <div className="text-[10px] text-slate-500">{data.totalProfitHint}</div>
        </div>

        <div className="space-y-1">
          <div className="text-slate-400 text-xs font-medium">Avg APR</div>
          <div className="text-2xl font-bold text-white">{data.avgApr.value}</div>
          <div className="w-full bg-slate-800 rounded-full h-1 mt-2">
            <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${data.avgApr.progressPct}%` }} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-slate-400 text-xs font-medium">Avg APY</div>
          <div className="text-2xl font-bold text-white">{data.avgApy.value}</div>
          <div className="w-full bg-slate-800 rounded-full h-1 mt-2">
            <div className="bg-cyan-500 h-1 rounded-full" style={{ width: `${data.avgApy.progressPct}%` }} />
          </div>
        </div>
      </div>
    </Surface>
  );
}