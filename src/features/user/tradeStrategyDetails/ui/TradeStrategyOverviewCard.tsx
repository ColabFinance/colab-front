"use client";

import type { TradeStrategyDetailsRecord } from "../types";

type Props = {
  strategy: TradeStrategyDetailsRecord;
  onCopy: (value: string) => void;
};

function titleCase(value: string) {
  const raw = String(value || "").trim();
  if (!raw) return "-";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function StatusPill({ status }: { status: string }) {
  const className =
    status === "ACTIVE"
      ? "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20 w-fit"
      : "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20 w-fit";

  return <span className={className}>{status === "ACTIVE" ? "Active" : "Inactive"}</span>;
}

function CopyableValue({
  value,
  onCopy,
}: {
  value: string;
  onCopy: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-200 font-mono">{value}</span>
      <button
        type="button"
        className="text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
        onClick={() => onCopy(value)}
      >
        <i className="fa-regular fa-copy text-xs" />
      </button>
    </div>
  );
}

export function TradeStrategyOverviewCard({ strategy, onCopy }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-slate-700">
        <h3 className="font-bold text-white text-lg">Strategy Overview</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">ID</span>
            <CopyableValue value={strategy.id} onCopy={onCopy} />
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Name</span>
            <span className="text-sm text-slate-200 font-medium">{strategy.name}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Symbol</span>
            <span className="text-sm text-slate-200 font-mono">{strategy.symbol}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Source</span>
            <span className="text-sm text-slate-200">{titleCase(strategy.source)}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Interval</span>
            <span className="text-sm text-slate-200 font-mono">{strategy.interval}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Stream Key</span>
            <CopyableValue value={strategy.streamKey} onCopy={onCopy} />
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Strategy Type</span>
            <span className="text-sm text-slate-200">{strategy.strategyType}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</span>
            <StatusPill status={strategy.status} />
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Execution Target</span>
            <span className="text-sm text-slate-200">{strategy.executionTarget}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Execution Account ID</span>
            <CopyableValue value={strategy.executionAccountId || "-"} onCopy={onCopy} />
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Created At</span>
            <span className="text-sm text-slate-200 font-mono">{strategy.createdAtIso || "-"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Updated At</span>
            <span className="text-sm text-slate-200 font-mono">{strategy.updatedAtIso || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}