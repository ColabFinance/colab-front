import React from "react";
import { Badge } from "@/presentation/components/Badge";
import { Button } from "@/presentation/components/Button";
import { cn } from "@/shared/utils/cn";
import { StrategyDetails } from "../types";
import { Icon } from "@/presentation/icons/Icon";

function riskTone(risk: StrategyDetails["risk"]) {
  if (risk === "low") return "green" as const;
  if (risk === "high") return "red" as const;
  return "amber" as const;
}

function riskLabel(risk: StrategyDetails["risk"]) {
  if (risk === "low") return "Low Risk";
  if (risk === "high") return "High Risk";
  return "Medium Risk";
}

export function StrategyIdentityHeader({ strategy }: { strategy: StrategyDetails }) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 pb-4 border-b border-slate-800/60">
      <div className="flex gap-4">
        <div
          className={cn(
            "w-14 h-14 md:w-16 md:h-16 rounded-xl shrink-0",
            "bg-gradient-to-br from-blue-600 to-cyan-500",
            "grid place-items-center shadow-[0_10px_30px_-18px_rgba(34,211,238,0.55)]"
          )}
          aria-hidden="true"
        >
          <Icon name="layerGroup" className="h-7 w-7 text-white" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {strategy.name}
            </h1>
            <span className="px-2 py-1 rounded border border-slate-700 bg-slate-950/40 text-xs font-mono text-slate-400">
              {strategy.symbol}
            </span>
            <Badge tone={riskTone(strategy.risk)}>{riskLabel(strategy.risk)}</Badge>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-700 bg-slate-900 text-xs text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" aria-hidden="true" />
              {strategy.chainName}
            </span>

            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-700 bg-slate-900 text-xs text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
              {strategy.dexName}
            </span>

            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-slate-700 bg-slate-900 text-xs text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300/70" aria-hidden="true" />
              {strategy.pairLabel}
              <span className="ml-1 px-1.5 py-0.5 rounded border border-slate-700 bg-slate-950/40 text-[10px] text-slate-400">
                {strategy.feeTierLabel}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto mt-2 xl:mt-0">
        <Button
          href={`/backtest?strategyId=${encodeURIComponent(strategy.id)}`}
          variant="secondary"
          className="w-full sm:w-auto justify-center"
        >
          Run Backtest
        </Button>

        <Button
          href={`/my/vaults?createFromStrategy=${encodeURIComponent(strategy.id)}`}
          variant="primary"
          className="w-full sm:w-auto justify-center"
        >
          Create Vault from Strategy
        </Button>
      </div>
    </div>
  );
}