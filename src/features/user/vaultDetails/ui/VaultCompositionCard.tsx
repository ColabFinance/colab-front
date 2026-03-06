import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import { TokenPill } from "@/presentation/components/TokenPill";
import { VaultComposition, VaultDetails } from "../types";

function usd(n: number, maxFrac = 0) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: maxFrac }).format(n);
}
function num(n: number, maxFrac = 2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: maxFrac }).format(n);
}

function RowBox({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3">
      <div className="text-sm text-slate-300">{left}</div>
      <div className="text-right">{right}</div>
    </div>
  );
}

export function VaultCompositionCard({
  composition,
  token0,
  token1,
}: {
  composition: VaultComposition;
  token0: VaultDetails["token0"];
  token1: VaultDetails["token1"];
}) {
  return (
    <Surface variant="panel" className="overflow-hidden shadow-sm">
      <SurfaceHeader className="flex items-center justify-between bg-slate-950/40">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Vault Composition</h3>
        <span className="text-xs text-slate-500">
          Total: <span className="font-mono text-slate-200">{usd(composition.totalUsd)}</span>
        </span>
      </SurfaceHeader>

      <SurfaceBody className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div className="text-sm font-medium text-slate-300">In Position (Active Liquidity)</div>
            <div className="text-sm font-mono text-white">
              {usd(composition.inPositionUsd)}{" "}
              <span className="text-xs text-slate-500">({composition.inPositionPct}%)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-3">
              <TokenPill symbol={token0.symbol} />
              <div>
                <div className="text-xs text-slate-500">{token0.symbol} Amount</div>
                <div className="text-sm font-mono text-white">{num(composition.inPositionToken0Amount, 2)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <TokenPill symbol={token1.symbol} />
              <div>
                <div className="text-xs text-slate-500">{token1.symbol} Amount</div>
                <div className="text-sm font-mono text-white">{num(composition.inPositionToken1Amount, 2)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div className="text-sm font-medium text-slate-300">Vault Idle (Unused)</div>
            <div className="text-sm font-mono text-white">
              {usd(composition.idleUsd)}{" "}
              <span className="text-xs text-slate-500">({composition.idlePct}%)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-3">
              <TokenPill symbol={token0.symbol} />
              <div>
                <div className="text-xs text-slate-500">{token0.symbol} Idle</div>
                <div className="text-sm font-mono text-slate-200">{num(composition.idleToken0Amount, 2)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <TokenPill symbol={token1.symbol} />
              <div>
                <div className="text-xs text-slate-500">{token1.symbol} Idle</div>
                <div className="text-sm font-mono text-slate-200">{num(composition.idleToken1Amount, 2)}</div>
              </div>
            </div>
          </div>
        </div>

        <RowBox
          left={<span className="text-xs text-slate-500">Note</span>}
          right={<span className="text-xs text-slate-500">Mock values (API later)</span>}
        />
      </SurfaceBody>
    </Surface>
  );
}