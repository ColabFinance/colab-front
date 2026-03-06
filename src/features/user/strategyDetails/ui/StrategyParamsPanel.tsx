import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import { cn } from "@/shared/utils/cn";
import { StrategyDetails } from "../types";

export function StrategyParamsPanel({ strategy }: { strategy: StrategyDetails }) {
  return (
    <Surface variant="panel" className="h-full sticky top-24">
      <SurfaceHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Parameters</h3>
          <span className="px-2 py-0.5 rounded border border-slate-700 bg-slate-950/40 text-[10px] text-slate-500 font-mono">
            READ-ONLY
          </span>
        </div>
      </SurfaceHeader>

      <SurfaceBody>
        <div className="space-y-6">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Tiers Configuration
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/30 p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Total Tiers</span>
                <span className="text-sm font-mono text-white">{strategy.params.tiers.total}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {strategy.params.tiers.labels.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 rounded border border-slate-700 bg-slate-900 text-xs text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Rebalance Thresholds
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/30 divide-y divide-slate-800">
              {strategy.params.thresholds.map((x) => (
                <div key={x.label} className="p-3 flex justify-between items-center">
                  <span className="text-sm text-slate-400">{x.label}</span>
                  <span
                    className={cn(
                      "text-sm font-mono",
                      x.tone === "amber"
                        ? "text-amber-400"
                        : x.tone === "cyan"
                        ? "text-cyan-300"
                        : "text-white"
                    )}
                  >
                    {x.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Operational Limits
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/30">
              {strategy.params.limits.map((x) => (
                <div key={x.label} className="p-3 flex justify-between items-center">
                  <span className="text-sm text-slate-400">{x.label}</span>
                  <span className="text-sm font-mono text-white">{x.value}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="w-full py-2 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            View Contract Code
          </button>
        </div>
      </SurfaceBody>
    </Surface>
  );
}