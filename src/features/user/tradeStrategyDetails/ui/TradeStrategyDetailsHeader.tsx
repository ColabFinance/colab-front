"use client";

import { ActionBadge } from "@/presentation/components/ActionBadge";
import type { TradeStrategyDetailsRecord } from "../types";

type Props = {
  strategy: TradeStrategyDetailsRecord;
  onToggleStatus: () => void;
};

function statusTone(status: string): "green" | "slate" {
  return status === "ACTIVE" ? "green" : "slate";
}

export function TradeStrategyDetailsHeader({ strategy, onToggleStatus }: Props) {
  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {strategy.name}
            </h1>
            <ActionBadge
              label={strategy.status === "ACTIVE" ? "Active" : "Inactive"}
              tone={statusTone(strategy.status)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Symbol:</span>
              <span className="text-slate-200 font-mono font-medium">{strategy.symbol}</span>
            </div>

            <span className="text-slate-600">•</span>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Type:</span>
              <ActionBadge label={strategy.strategyType} tone="blue" />
            </div>

            <span className="text-slate-600">•</span>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Execution Account:</span>
              <ActionBadge label={strategy.executionAccountId || "-"} tone="cyan" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ActionBadge
            href={`/trade/monitor?strategyId=${encodeURIComponent(strategy.id)}`}
            label="Trade Monitor"
            tone="blue"
          />
          <ActionBadge
            label={strategy.status === "ACTIVE" ? "Deactivate" : "Activate"}
            tone={strategy.status === "ACTIVE" ? "red" : "green"}
            onClick={onToggleStatus}
          />
        </div>
      </div>
    </div>
  );
}