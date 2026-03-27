"use client";

import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import type { StrategyDetails } from "../types";

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-slate-800 last:border-b-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-xs text-right text-white ${mono ? "font-mono break-all" : ""}`}>{value}</span>
    </div>
  );
}

export function StrategyParamsPanel({ strategy }: { strategy: StrategyDetails }) {
  return (
    <Surface variant="panel" className="bg-slate-900 border-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
      <SurfaceHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <i className="fa-solid fa-sliders text-cyan-400" aria-hidden="true" />
            Strategy Parameters
          </h2>
          <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-500 font-mono">
            READ-ONLY
          </span>
        </div>
      </SurfaceHeader>

      <SurfaceBody>
        <div className="space-y-4">
          <div className="bg-slate-950/50 rounded border border-slate-800 p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Identity</h3>
            <div>
              <Row label="Status" value={strategy.status} />
              <Row label="Public Strategy" value={strategy.isPublic ? "Yes" : "No"} />
              <Row label="Symbol" value={strategy.symbol} mono />
              <Row label="Updated" value={strategy.updatedAtLabel} />
            </div>
          </div>

          <div className="bg-slate-950/50 rounded border border-slate-800 p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Core Params</h3>
            <div>
              <Row label="EPS" value={String(strategy.rawParams?.eps ?? "-")} mono />
              <Row label="Skew Low %" value={String(strategy.rawParams?.skew_low_pct ?? "-")} mono />
              <Row label="Skew High %" value={String(strategy.rawParams?.skew_high_pct ?? "-")} mono />
              <Row label="Cooloff Bars" value={String(strategy.rawParams?.cooloff_bars ?? "-")} mono />
              <Row
                label="Breakout Confirm Bars"
                value={String(strategy.rawParams?.breakout_confirm_bars ?? "-")}
                mono
              />
              <Row
                label="Gauge Flow Enabled"
                value={strategy.rawParams?.gauge_flow_enabled ? "Enabled" : "Disabled"}
              />
            </div>
          </div>

          <div className="bg-slate-950/50 rounded border border-slate-800 p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">High Vol Params</h3>
            <div>
              <Row
                label="Block High Vol Up ATR %"
                value={String(strategy.rawParams?.block_high_vol_up_atr_pct ?? "-")}
                mono
              />
              <Row
                label="High Vol Base Below %"
                value={String(strategy.rawParams?.high_vol_base_below_pct ?? "-")}
                mono
              />
              <Row
                label="High Vol Base Above %"
                value={String(strategy.rawParams?.high_vol_base_above_pct ?? "-")}
                mono
              />
              <Row
                label="Invert On Trend Up"
                value={strategy.rawParams?.high_vol_invert_on_trend_up ? "Yes" : "No"}
              />
              <Row
                label="High Vol Max Width"
                value={String(strategy.rawParams?.high_vol_max_major_side_pct ?? "-")}
                mono
              />
            </div>
          </div>
        </div>
      </SurfaceBody>
    </Surface>
  );
}