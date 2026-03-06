"use client";

import React from "react";
import { Surface, SurfaceBody, SurfaceFooter, SurfaceHeader } from "@/presentation/components/Surface";
import { Button } from "@/presentation/components/Button";
import { cn } from "@/shared/utils/cn";

export function DepositModal({
  open,
  onClose,
  amount,
  onChangeAmount,
  onMax,
  onConfirm,
  tokenSymbol = "USDC",
  poolLabel = "USDC-ETH Pool",
  dexLabel = "Uniswap V3",
  balanceLabel = "Balance: 1,420.50 USDC",
  gasLabel = "Estimated Gas: 0.004 ETH (~$8.50)",
}: {
  open: boolean;
  onClose: () => void;

  amount: string;
  onChangeAmount: (v: string) => void;
  onMax: () => void;
  onConfirm: () => void;

  tokenSymbol?: string;
  poolLabel?: string;
  dexLabel?: string;

  balanceLabel?: string;
  gasLabel?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Surface variant="panel" className="rounded-2xl shadow-2xl overflow-hidden">
          <SurfaceHeader className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Deposit Assets</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </SurfaceHeader>

          <SurfaceBody className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full border border-slate-800 bg-slate-900 grid place-items-center text-[10px] font-bold text-slate-200">
                    US
                  </div>
                  <div className="h-6 w-6 rounded-full border border-slate-800 bg-slate-900 grid place-items-center text-[10px] font-bold text-slate-200">
                    ET
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-200">{poolLabel}</span>
              </div>
              <span className="text-xs text-slate-500">{dexLabel}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Amount ({tokenSymbol})
              </label>

              <div className="relative">
                <input
                  value={amount}
                  onChange={(e) => onChangeAmount(e.target.value)}
                  inputMode="decimal"
                  className={cn(
                    "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 pr-16",
                    "text-white text-lg font-mono outline-none focus:border-cyan-500 transition-colors"
                  )}
                  placeholder="0.0"
                />
                <button
                  type="button"
                  onClick={onMax}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium bg-slate-900 border border-slate-700 text-cyan-300 hover:bg-slate-800 transition-colors"
                >
                  MAX
                </button>
              </div>

              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>{balanceLabel}</span>
                <span>~${amount || "0.00"}</span>
              </div>
            </div>

            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-100/80">
              <span className="font-medium text-blue-200">Gas</span>:{" "}
              <span className="font-mono text-blue-100">{gasLabel}</span>
            </div>
          </SurfaceBody>

          <SurfaceFooter>
            <Button variant="primary" className="w-full" onClick={onConfirm}>
              Confirm Deposit
            </Button>
          </SurfaceFooter>
        </Surface>
      </div>
    </div>
  );
}