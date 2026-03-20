"use client";

import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import type { StrategyDetails } from "../types";

export function StrategyOverviewCard({ strategy }: { strategy: StrategyDetails }) {
  const paragraphs = [
    `${strategy.name} is registered on ${strategy.chainName} and currently uses ${strategy.dexName} for the ${strategy.pairLabel} market on fee tier ${strategy.feeTierLabel}.`,
    `The current indicator set tracks ${strategy.marketSymbol || strategy.pairLabel} from ${strategy.indicatorSource} using EMA ${strategy.emaFast}/${strategy.emaSlow} with ATR window ${strategy.atrWindow}.`,
    strategy.vaultAlias
      ? `This strategy is currently linked to vault ${strategy.vaultAlias}, which can be opened directly from this page.`
      : `This strategy is not currently linked to a vault.`,
  ];

  return (
    <Surface variant="panel" className="bg-slate-900 border-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
      <SurfaceHeader>
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <i className="fa-solid fa-info-circle text-slate-400" aria-hidden="true" />
          Strategy Overview
        </h2>
      </SurfaceHeader>

      <SurfaceBody>
        <div className="space-y-3">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-sm text-slate-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </SurfaceBody>
    </Surface>
  );
}