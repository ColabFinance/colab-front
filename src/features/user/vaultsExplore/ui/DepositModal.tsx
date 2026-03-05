"use client";

import React, { useMemo, useState } from "react";
import { Surface, SurfaceHeader, SurfaceBody, SurfaceFooter } from "@/presentation/components/Surface";
import { Button } from "@/presentation/components/Button";
import { TokenPill } from "@/presentation/components/TokenPill";
import { VaultExploreItem } from "../types";

function formatUsd(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

export function DepositModal({
  open,
  vault,
  onClose,
}: {
  open: boolean;
  vault: VaultExploreItem | null;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");

  const parsed = useMemo(() => {
    const x = Number(amount);
    if (!amount) return null;
    if (!Number.isFinite(x)) return null;
    if (x < 0) return null;
    return x;
  }, [amount]);

  if (!open || !vault) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Surface variant="panel" className="rounded-2xl overflow-hidden">
          <SurfaceHeader className="bg-slate-900 flex items-center justify-between">
            <div>
              <div className="text-white font-bold">Deposit Assets</div>
              <div className="text-xs text-slate-500 mt-0.5">{vault.dexName}</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </SurfaceHeader>

          <SurfaceBody className="space-y-5 bg-slate-900">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <TokenPill symbol={vault.token0Symbol} />
                  <TokenPill symbol={vault.token1Symbol} />
                </div>
                <div className="text-sm font-medium text-slate-300">{vault.name}</div>
              </div>
              <div className="text-xs text-slate-500">{formatUsd(vault.tvlUsd)} TVL</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Amount ({vault.token0Symbol})
              </label>

              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-4 pr-16 py-3 text-white text-lg font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="0.0"
                />
                <button
                  type="button"
                  onClick={() => setAmount("1000")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-xs text-cyan-300 font-medium rounded hover:bg-slate-700 transition-colors"
                >
                  MAX
                </button>
              </div>

              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Balance: 1,420.50 {vault.token0Symbol}</span>
                <span>~${parsed ? parsed.toFixed(2) : "0.00"}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="text-xs text-blue-200/80">
                Estimated Gas: <span className="font-mono text-blue-100">0.004 ETH</span> (~$8.50)
              </div>
            </div>
          </SurfaceBody>

          <SurfaceFooter className="bg-slate-900">
            <Button
              variant="primary"
              className="w-full py-3"
              onClick={onClose}
              disabled={!parsed || parsed <= 0}
            >
              Confirm Deposit
            </Button>
          </SurfaceFooter>
        </Surface>
      </div>
    </div>
  );
}