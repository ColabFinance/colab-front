"use client";

import { ActionBadge } from "@/presentation/components/ActionBadge";
import type { TradeStrategyRuntimeRecord } from "../types";

type Props = {
  strategyId: string;
  runtime: TradeStrategyRuntimeRecord | null;
};

function boolPill(value: number) {
  const truthy = Number(value) === 1;

  return (
    <span
      className={
        truthy
          ? "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-green-500/10 text-green-400 border border-green-500/20"
          : "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-red-500/10 text-red-400 border border-red-500/20"
      }
    >
      {truthy ? "true" : "false"}
    </span>
  );
}

export function TradeStrategyLatestRuntimeCard({ strategyId, runtime }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-bold text-white text-lg">Latest Runtime Summary</h3>

        <div className="flex items-center gap-2">
          <ActionBadge
            href={`/trade/monitor?strategyId=${encodeURIComponent(strategyId)}`}
            label="Trade Monitor"
            tone="blue"
          />
        </div>
      </div>

      {!runtime ? (
        <div className="p-6 text-sm text-slate-500">No runtime snapshot available yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Open Time</th>
                <th className="px-4 py-3">Close Time</th>
                <th className="px-4 py-3">ATR</th>
                <th className="px-4 py-3">ATR %</th>
                <th className="px-4 py-3">ATR Value</th>
                <th className="px-4 py-3">Low Hit</th>
                <th className="px-4 py-3">High Hit</th>
                <th className="px-4 py-3">Setup Armed</th>
                <th className="px-4 py-3">Ref Price</th>
                <th className="px-4 py-3">Desired Side</th>
                <th className="px-4 py-3">Position Side</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Signal Up</th>
                <th className="px-4 py-3">Signal Down</th>
                <th className="px-4 py-3">Up First</th>
                <th className="px-4 py-3">Down First</th>
                <th className="px-4 py-3">Exit</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Bars Since</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 text-xs text-slate-300 font-mono">{runtime.ts}</td>
                <td className="px-4 py-3 text-xs text-slate-300 font-mono">{runtime.openTime}</td>
                <td className="px-4 py-3 text-xs text-slate-300 font-mono">{runtime.closeTime}</td>
                <td className="px-4 py-3 text-xs text-slate-300 font-mono">{runtime.atr}</td>
                <td className="px-4 py-3 text-xs text-slate-300 font-mono">{runtime.atrPct}</td>
                <td className="px-4 py-3 text-xs text-slate-300 font-mono">{runtime.atrValueForThreshold}</td>
                <td className="px-4 py-3 text-xs text-center">{boolPill(runtime.lowAtrHit)}</td>
                <td className="px-4 py-3 text-xs text-center">{boolPill(runtime.highAtrHit)}</td>
                <td className="px-4 py-3 text-xs text-center">{boolPill(runtime.setupArmed)}</td>
                <td className="px-4 py-3 text-xs text-slate-300 font-mono">{runtime.setupReferencePrice ?? "-"}</td>
                <td className="px-4 py-3 text-xs text-slate-300">{runtime.desiredSide || "-"}</td>
                <td className="px-4 py-3 text-xs text-slate-300">{runtime.positionSide || "-"}</td>
                <td className="px-4 py-3 text-xs text-cyan-400">{runtime.event || "-"}</td>
                <td className="px-4 py-3 text-xs text-center">{boolPill(runtime.signalUp)}</td>
                <td className="px-4 py-3 text-xs text-center">{boolPill(runtime.signalDown)}</td>
                <td className="px-4 py-3 text-xs text-center">{boolPill(runtime.signalUpFirst)}</td>
                <td className="px-4 py-3 text-xs text-center">{boolPill(runtime.signalDownFirst)}</td>
                <td className="px-4 py-3 text-xs text-center">{boolPill(runtime.exitSignal)}</td>
                <td className="px-4 py-3 text-xs text-slate-300 font-mono">{runtime.runtimeState || "-"}</td>
                <td className="px-4 py-3 text-xs text-slate-300 font-mono">{runtime.barsSinceLastEvent}</td>
                <td className="px-4 py-3 text-xs text-slate-400 font-mono">{runtime.updatedAtIso || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}