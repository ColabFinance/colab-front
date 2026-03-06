import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import { StrategyDetails } from "../types";

export function StrategyOverviewCard({ strategy }: { strategy: StrategyDetails }) {
  return (
    <Surface variant="panel">
      <SurfaceHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-base font-semibold text-white">Strategy Overview</h2>
          <span className="text-[11px] text-slate-500">Read-only</span>
        </div>
      </SurfaceHeader>

      <SurfaceBody>
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          {strategy.overview.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </SurfaceBody>
    </Surface>
  );
}