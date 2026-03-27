import React from "react";
import { Card } from "@/presentation/components/Card";

export function RegistryCountsCard() {
  return (
    <Card className="relative overflow-hidden p-5 hover:border-slate-600">
      <div className="pointer-events-none absolute right-0 top-0 h-16 w-16 rounded-bl-3xl bg-gradient-to-br from-cyan-500/10 to-transparent" />
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Registry Counts</h3>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2">
          <div className="text-2xl font-bold text-white">12</div>
          <div className="mt-1 text-[10px] uppercase text-slate-500">DEXes</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2">
          <div className="text-2xl font-bold text-white">84</div>
          <div className="mt-1 text-[10px] uppercase text-slate-500">Pools</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2">
          <div className="text-2xl font-bold text-cyan-300">156</div>
          <div className="mt-1 text-[10px] uppercase text-slate-500">Adapters</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
        <span className="text-slate-500">Last registered:</span>
        <span className="text-slate-300">Uniswap V3 (Base)</span>
      </div>
    </Card>
  );
}