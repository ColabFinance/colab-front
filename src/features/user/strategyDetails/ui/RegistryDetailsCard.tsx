"use client";

import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import type { StrategyDetails } from "../types";

function Item({ label, value, mono = false }: { label: string; value?: string | null; mono?: boolean }) {
  return (
    <div className="bg-slate-950/50 rounded border border-slate-800 p-3">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`text-xs text-slate-300 ${mono ? "font-mono break-all" : ""}`}>{value || "-"}</div>
    </div>
  );
}

export function RegistryDetailsCard({ strategy }: { strategy: StrategyDetails }) {
  return (
    <Surface variant="panel" className="bg-slate-900 border-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
      <SurfaceHeader>
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <i className="fa-solid fa-database text-slate-400" aria-hidden="true" />
          Registry & Technical Details
        </h2>
      </SurfaceHeader>

      <SurfaceBody>
        <div className="grid grid-cols-1 gap-3">
          <Item label="Owner" value={strategy.owner} mono />
          <Item label="Strategy ID" value={String(strategy.strategyId)} mono />
          <Item label="Indicator Set ID" value={strategy.indicatorSetId} mono />
          <Item label="Tx Hash" value={strategy.txHash} mono />
          <Item label="Adapter" value={strategy.adapterAddress} mono />
          <Item label="Dex Router" value={strategy.dexRouterAddress} mono />
          <Item label="Token0" value={strategy.token0Address} mono />
          <Item label="Token1" value={strategy.token1Address} mono />
          <Item label="Created At" value={strategy.createdAtIso} />
          <Item label="Updated At" value={strategy.updatedAtIso} />
        </div>
      </SurfaceBody>
    </Surface>
  );
}