import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import { StrategyDetails } from "../types";

export function StrategyOptimizeCard({ strategy }: { strategy: StrategyDetails }) {
  return (
    <Surface variant="panel" className="h-full">
      <SurfaceHeader>
        <h3 className="text-sm font-semibold text-white">What It Optimizes</h3>
      </SurfaceHeader>

      <SurfaceBody>
        <ul className="space-y-3">
          {strategy.optimizes.map((x, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full border border-slate-700 bg-slate-950/40 grid place-items-center shrink-0">
                <span className="text-[10px] text-green-400">✓</span>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">{x.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{x.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </SurfaceBody>
    </Surface>
  );
}