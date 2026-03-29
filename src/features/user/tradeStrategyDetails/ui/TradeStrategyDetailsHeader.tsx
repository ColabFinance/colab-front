"use client";

import Link from "next/link";
import type { TradeStrategyDetailsRecord } from "../types";

type Props = {
  strategy: TradeStrategyDetailsRecord;
  onToggleStatus: () => void;
};

function statusClasses(status: string) {
  if (status === "ACTIVE") {
    return "inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20";
  }

  return "inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20";
}

export function TradeStrategyDetailsHeader({ strategy, onToggleStatus }: Props) {
  const isActive = strategy.status === "ACTIVE";

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {strategy.name}
            </h1>
            <span className={statusClasses(strategy.status)}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Symbol:</span>
              <span className="text-slate-200 font-mono font-medium">{strategy.symbol}</span>
            </div>

            <span className="text-slate-600">•</span>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Type:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {strategy.strategyType}
              </span>
            </div>

            <span className="text-slate-600">•</span>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Execution Account:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                {strategy.executionAccountId || "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 md:gap-3">
          <Link
            href={`/trade/monitor?strategyId=${encodeURIComponent(strategy.id)}`}
            className="w-full xs:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-desktop" /> Trade Monitor
          </Link>

          <button
            type="button"
            onClick={onToggleStatus}
            className={
              isActive
                ? "w-full xs:w-auto px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                : "w-full xs:w-auto px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            }
          >
            <i className={`fa-solid ${isActive ? "fa-pause" : "fa-play"}`} />
            {isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}