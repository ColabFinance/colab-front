import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import { Badge } from "@/presentation/components/Badge";
import { VaultRange } from "../types";

function usdPrice(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

export function CurrentRangeCard({ range }: { range: VaultRange }) {
  const pct = (() => {
    const denom = range.maxPrice - range.minPrice;
    if (denom <= 0) return 0.5;
    return clamp01((range.currentPrice - range.minPrice) / denom);
  })();

  const markerLeft = `${pct * 100}%`;

  return (
    <Surface variant="panel" className="overflow-hidden shadow-sm">
      <SurfaceHeader className="flex items-center justify-between bg-slate-950/40">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Current Range</h3>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Last Rebalance: <span className="text-slate-200">{range.lastRebalanceLabel}</span>
          </span>
          <Badge tone={range.inRange ? "green" : "amber"} className="uppercase">
            {range.inRange ? "In Range" : "Out of Range"}
          </Badge>
        </div>
      </SurfaceHeader>

      <SurfaceBody>
        <div className="relative mb-6 h-16 overflow-hidden rounded-lg border border-slate-800 bg-slate-950 px-4 flex items-center">
          <div className="absolute left-[10%] right-[10%] h-2 rounded-full bg-slate-800" />
          <div
            className="absolute h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.25)]"
            style={{
              left: `${range.bandStartPct}%`,
              right: `${100 - range.bandEndPct}%`,
            }}
          />

          <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: markerLeft }}>
            <div className="h-4 w-4 rounded-full border-4 border-slate-900 bg-white shadow-lg z-10" />
            <div className="absolute top-6 whitespace-nowrap rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
              {usdPrice(range.currentPrice)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <div className="mb-1 text-xs text-slate-500">Min Price</div>
            <div className="text-sm font-mono text-slate-200">{usdPrice(range.minPrice)}</div>
          </div>

          <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-b from-slate-800 to-slate-900 p-3 shadow-[0_0_16px_-10px_rgba(34,211,238,0.35)]">
            <div className="mb-1 text-xs text-cyan-300 font-medium">Current Price</div>
            <div className="text-base font-mono font-semibold text-white">{usdPrice(range.currentPrice)}</div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <div className="mb-1 text-xs text-slate-500">Max Price</div>
            <div className="text-sm font-mono text-slate-200">{usdPrice(range.maxPrice)}</div>
          </div>
        </div>
      </SurfaceBody>
    </Surface>
  );
}