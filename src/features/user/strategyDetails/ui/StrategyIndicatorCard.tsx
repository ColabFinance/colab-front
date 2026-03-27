"use client";

import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import type { StrategyDetails } from "../types";

function Metric({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-slate-950/50 rounded border border-slate-800 p-3">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`text-sm font-semibold text-white ${mono ? "font-mono break-all" : ""}`}>{value}</div>
    </div>
  );
}

export function StrategyIndicatorCard({ strategy }: { strategy: StrategyDetails }) {
  return (
    <Surface variant="panel" className="bg-slate-900 border-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
      <SurfaceHeader>
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <i className="fa-solid fa-chart-line text-cyan-400" aria-hidden="true" />
          Indicator Set & Market Data
        </h2>
      </SurfaceHeader>

      <SurfaceBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Metric label="Indicator Set ID" value={strategy.indicatorSetId || "-"} mono />
          <Metric label="Source" value={strategy.indicatorSource || "-"} />
          <Metric label="Market Symbol" value={strategy.marketSymbol || "-"} />
          <Metric label="Stream Key" value={strategy.indicatorStreamKey || "-"} mono />
          <Metric label="EMA Fast / EMA Slow" value={`${strategy.emaFast} / ${strategy.emaSlow}`} />
          <Metric label="ATR Window" value={String(strategy.atrWindow || "-")} />
          <Metric label="Market Pair" value={strategy.pairLabel || "-"} />
          <Metric label="Fee Tier" value={strategy.feeTierLabel || "-"} />
        </div>
      </SurfaceBody>
    </Surface>
  );
}