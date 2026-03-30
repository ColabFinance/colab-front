"use client";

import type { TradeStrategyDetailsRecord } from "../types";

type Props = {
  strategy: TradeStrategyDetailsRecord;
  onCopy: (value: string) => void;
};

export function TradeStrategyExecutionContextCard({ strategy, onCopy }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-slate-700">
        <h3 className="font-bold text-white text-lg">Execution Context</h3>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Execution Target</span>
            <span className="text-sm text-slate-200">{strategy.executionTarget}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Execution Account ID</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-200 font-mono">{strategy.executionAccountId || "-"}</span>
              {strategy.executionAccountId ? (
                <button
                  type="button"
                  className="text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
                  onClick={() => onCopy(strategy.executionAccountId || "")}
                >
                  <i className="fa-regular fa-copy text-xs" />
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
          <i className="fa-solid fa-info-circle text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-400 mb-1">Execution Sizing Note</h4>
            <p className="text-xs text-blue-300/80">
              Trade execution sizing is determined by the associated Execution Profile, not by
              strategy parameters. The strategy generates signals based on market conditions, while
              the Execution Profile controls how those signals are translated into actual orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}