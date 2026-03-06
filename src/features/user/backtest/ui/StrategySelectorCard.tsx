"use client";

import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import { Badge } from "@/presentation/components/Badge";
import { TokenPill } from "@/presentation/components/TokenPill";
import { STRATEGIES } from "../mock";

export function StrategySelectorCard({
  strategyId,
  onChange,
}: {
  strategyId: string;
  onChange: (id: string) => void;
}) {
  const selected = STRATEGIES.find((s) => s.id === strategyId) ?? STRATEGIES[0];

  return (
    <Surface variant="panel">
      <SurfaceHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-white">1 · Select Strategy</div>
          <Badge tone={selected?.gaugeActive ? "green" : "slate"}>
            {selected?.gaugeActive ? "Gauge Active" : "No Gauge"}
          </Badge>
        </div>
      </SurfaceHeader>

      <SurfaceBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Strategy</label>
            <select
              value={strategyId}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
            >
              {STRATEGIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.token0}/{s.token1})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Chain</div>
                <div className="text-sm text-slate-200 mt-0.5">{selected.chainName}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">DEX</div>
                <div className="text-sm text-slate-200 mt-0.5">{selected.dexName}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Pool</div>
                <div className="flex items-center gap-2 mt-1">
                  <TokenPill symbol={selected.token0} />
                  <span className="text-slate-600">/</span>
                  <TokenPill symbol={selected.token1} />
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Fee Tier</div>
                <div className="text-sm font-mono text-slate-200 mt-0.5">{selected.feeTierLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </SurfaceBody>
    </Surface>
  );
}