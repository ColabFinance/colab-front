"use client";

import type { TradeStrategyDetailsRecord } from "../types";

type Props = {
  strategy: TradeStrategyDetailsRecord;
};

export function TradeStrategyParamsCard({ strategy }: Props) {
  const allowedWeekdays = strategy.params.allowedWeekdays?.length
    ? strategy.params.allowedWeekdays.join(", ")
    : "-";

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-slate-700">
        <h3 className="font-bold text-white text-lg">Strategy Params</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">ATR Window</span>
            <span className="text-sm text-slate-200 font-mono">{strategy.params.atrWindow}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">ATR Low Threshold</span>
            <span className="text-sm text-slate-200 font-mono">{strategy.params.atrLowThreshold}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">ATR High Threshold</span>
            <span className="text-sm text-slate-200 font-mono">{strategy.params.atrHighThreshold}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">ATR Threshold Mode</span>
            <span className="text-sm text-slate-200">{strategy.params.atrThresholdMode}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Cooloff Bars</span>
            <span className="text-sm text-slate-200 font-mono">{strategy.params.cooloffBars}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Trade Mode</span>
            <span className="text-sm text-slate-200">{strategy.params.tradeMode}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Reverse Signal</span>
            <span className="text-sm text-slate-200">{String(strategy.params.reverseSignal)}</span>
          </div>

          <div className="flex flex-col md:col-span-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Allowed Weekdays</span>
            <span className="text-sm text-slate-200 font-mono">{allowedWeekdays}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Max Loss Pct</span>
            <span className="text-sm text-slate-200 font-mono">
              {strategy.params.maxLossPct !== null ? strategy.params.maxLossPct : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}