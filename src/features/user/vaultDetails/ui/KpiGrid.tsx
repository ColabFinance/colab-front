import React from "react";
import { Surface } from "@/presentation/components/Surface";
import { cn } from "@/shared/utils/cn";
import { VaultKpis } from "../types";

function usd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
function usd2(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
}
function pct(n: number) {
  return `${n.toFixed(2)}%`;
}

function KpiCard({
  label,
  value,
  sub,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <Surface variant="card" className="p-4 hover:border-slate-600 transition-colors">
      <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">{label}</div>
      <div className={cn("text-xl font-semibold text-white mb-1", valueClassName)}>{value}</div>
      {sub ? <div className="text-[11px] text-slate-500">{sub}</div> : null}
    </Surface>
  );
}

export function KpiGrid({ kpis }: { kpis: VaultKpis }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <KpiCard
        label="TVL"
        value={usd(kpis.tvlUsd)}
        sub={
          <span className={kpis.tvlChange24hPct >= 0 ? "text-green-400" : "text-red-400"}>
            {kpis.tvlChange24hPct >= 0 ? "+" : ""}
            {pct(kpis.tvlChange24hPct)} (24h)
          </span>
        }
      />

      <KpiCard
        label="APY / APR"
        value={
          <span className="inline-flex items-baseline gap-2">
            <span className="text-green-400">{pct(kpis.apyPct)}</span>
            <span className="text-xs text-slate-400">{pct(kpis.aprPct)}</span>
          </span>
        }
        sub="Annualized returns"
      />

      <KpiCard
        label="Profit To-Date"
        value={usd(kpis.profitToDateUsd)}
        sub={<span className="text-cyan-300">+{pct(kpis.profitToDatePct)} return</span>}
      />

      <KpiCard
        label="Uncollected Fees"
        value={usd2(kpis.uncollectedFeesUsd)}
        sub={`Last 24h: ${usd2(kpis.uncollectedFees24hUsd)}`}
      />

      <Surface variant="card" className="p-4 hover:border-slate-600 transition-colors sm:col-span-2 lg:col-span-1">
        <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Utilization</div>
        <div className="text-xl font-semibold text-white mb-2">{pct(kpis.utilizationPct)}</div>
        <div className="h-1.5 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
            style={{ width: `${Math.max(0, Math.min(100, kpis.utilizationPct))}%` }}
          />
        </div>
      </Surface>
    </div>
  );
}