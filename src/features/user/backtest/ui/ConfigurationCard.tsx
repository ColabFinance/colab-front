"use client";

import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import { BacktestConfig } from "../types";
import { TIMEFRAME_OPTIONS } from "../mock";
import { Toggle } from "./Toggle";

export function ConfigurationCard({
  config,
  onChange,
}: {
  config: BacktestConfig;
  onChange: (patch: Partial<BacktestConfig>) => void;
}) {
  return (
    <Surface variant="panel">
      <SurfaceHeader>
        <div className="text-sm font-semibold text-white">2 · Configuration</div>
      </SurfaceHeader>

      <SurfaceBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Date Range</label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="date"
                value={config.startDate}
                onChange={(e) => onChange({ startDate: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
              />
              <span className="text-slate-500 text-xs px-1">to</span>
              <input
                type="date"
                value={config.endDate}
                onChange={(e) => onChange({ endDate: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Candle Timeframe</label>
            <select
              value={config.timeframe}
              onChange={(e) => onChange({ timeframe: e.target.value as BacktestConfig["timeframe"] })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
            >
              {TIMEFRAME_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Initial Capital (USD)</label>
            <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30">
              <span className="text-slate-500 text-sm mr-2">$</span>
              <input
                type="number"
                value={config.initialCapitalUsd}
                onChange={(e) => onChange({ initialCapitalUsd: Number(e.target.value) })}
                className="w-full bg-transparent outline-none text-sm font-mono text-slate-200"
              />
            </div>
          </div>

          <Toggle
            checked={config.includeFees}
            onChange={(v) => onChange({ includeFees: v })}
            label="Fee Model"
            description="Include trading fees"
          />

          <Toggle
            checked={config.includeSlippage}
            onChange={(v) => onChange({ includeSlippage: v })}
            label="Slippage Model"
            description="Basic slippage simulation"
          />
        </div>
      </SurfaceBody>
    </Surface>
  );
}