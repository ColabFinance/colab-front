"use client";

import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import type { StrategyDetails } from "../types";

export function StrategyTiersTable({ strategy }: { strategy: StrategyDetails }) {
  return (
    <Surface variant="panel" className="bg-slate-900 border-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
      <SurfaceHeader>
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <i className="fa-solid fa-layer-group text-cyan-400" aria-hidden="true" />
            Position Tiers
          </h2>
          <p className="text-xs text-slate-400 mt-1">Configured from strategy params</p>
        </div>
      </SurfaceHeader>

      <SurfaceBody>
        {strategy.tiers.length === 0 ? (
          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-6 text-sm text-slate-400">
            No tiers configured for this strategy.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[860px]">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">ATR Up Threshold</th>
                  <th className="px-4 py-3">ATR Down Threshold</th>
                  <th className="px-4 py-3">Bars Required</th>
                  <th className="px-4 py-3">Max Width</th>
                  <th className="px-4 py-3">Allowed From</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {strategy.tiers.map((tier, index) => (
                  <tr key={`${tier.name}-${index}`} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{tier.name || `Tier ${index + 1}`}</div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-300">
                      {String(tier.atrPctThreshold)}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-300">
                      {String(tier.atrPctThresholdDown)}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-300">
                      {String(tier.barsRequired)}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-300">
                      {String(tier.maxMajorSidePct)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {tier.allowedFrom.length ? tier.allowedFrom.join(", ") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SurfaceBody>
    </Surface>
  );
}