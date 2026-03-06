import React, { useMemo } from "react";
import { Surface } from "@/presentation/components/Surface";
import { Icon } from "@/presentation/icons/Icon";
import { cn } from "@/shared/utils/cn";
import { AllocationSlice, PortfolioKpis } from "../types";

function formatCompactUsd(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value.toFixed(0)}`;
}

function buildConicGradient(slices: AllocationSlice[]) {
  let acc = 0;
  const stops: string[] = [];

  for (const s of slices) {
    const start = acc;
    const end = acc + s.pct;
    stops.push(`${s.color} ${start}% ${end}%`);
    acc = end;
  }

  const bg = `conic-gradient(${stops.join(", ")})`;
  return bg;
}

export function AllocationCard({
  kpis,
  allocation,
}: {
  kpis: PortfolioKpis;
  allocation: AllocationSlice[];
}) {
  const donutBg = useMemo(() => buildConicGradient(allocation), [allocation]);

  return (
    <Surface className="p-5 flex flex-col h-full" variant="panel">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Icon name="chart" className="text-slate-400" />
          <h3 className="text-lg font-bold text-white">Allocation</h3>
        </div>

        <button type="button" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
          View Analysis
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-[260px] h-[260px]">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: donutBg }}
            aria-hidden="true"
          />
          <div className="absolute inset-6 rounded-full bg-slate-900 border border-slate-700" aria-hidden="true" />
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="text-xs text-slate-400">Total Value</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                {formatCompactUsd(kpis.currentValueUsd)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {allocation.map((a) => (
          <div key={a.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-3 h-3 rounded-full" style={{ background: a.color }} aria-hidden="true" />
              <span className="text-slate-300 truncate">{a.label}</span>
            </div>
            <span className="text-white font-mono">{a.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="p-3 bg-slate-950/40 border border-slate-700 rounded-lg flex items-start gap-3">
          <span className="text-yellow-400 text-sm mt-0.5" aria-hidden="true">
            💡
          </span>
          <div className="min-w-0">
            <p className="text-xs text-slate-300 mb-1">
              Your portfolio is heavily weighted towards ETH strategies.
            </p>
            <button type="button" className="text-xs text-cyan-400 hover:text-cyan-300 underline">
              Explore stablecoin vaults
            </button>
          </div>
        </div>
      </div>
    </Surface>
  );
}