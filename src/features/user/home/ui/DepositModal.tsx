"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { Surface } from "@/presentation/components/Surface";
import { Button } from "@/presentation/components/Button";
import type { TopVaultRow } from "../types";

export function DepositModal({
  open,
  vault,
  onClose,
  onConfirm,
  onLogin,
  canConfirm,
}: {
  open: boolean;
  vault: TopVaultRow | null;
  onClose: () => void;
  onConfirm: () => void;
  onLogin: () => void;
  canConfirm: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-0 grid place-items-center p-4">
        <Surface
          variant="panel"
          className={cn("w-full max-w-md shadow-2xl")}
        >
          <div className="p-6 border-b border-slate-700 bg-slate-950/40 rounded-t-xl flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-white">Deposit into Vault</div>
              <div className="text-xs text-cyan-300 mt-0.5">{vault?.name ?? "-"}</div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 grid place-items-center border border-slate-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <div className="font-semibold text-slate-500 uppercase tracking-wider">Amount</div>
                <div className="text-slate-400">
                  Balance: <span className="text-white">12.45 ETH</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 focus-within:border-cyan-600 transition-all">
                <div className="flex justify-between items-center mb-2 gap-3">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="bg-transparent text-2xl font-bold text-white placeholder:text-slate-600 focus:outline-none w-full appearance-none"
                  />
                  <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700 shrink-0">
                    <div className="w-5 h-5 rounded-full bg-slate-700" />
                    <span className="text-sm font-medium text-white">ETH</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">≈ $0.00 USD</span>
                  <div className="flex gap-2">
                    <button className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-[10px] border border-slate-700">
                      25%
                    </button>
                    <button className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-[10px] border border-slate-700">
                      50%
                    </button>
                    <button className="px-2 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold rounded text-[10px] uppercase border border-cyan-500/20">
                      Max
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-lg p-4 space-y-3 border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Gas Estimate</span>
                <span className="text-slate-200">~ $4.50</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Deposit Fee</span>
                <span className="text-slate-200">0.00%</span>
              </div>
              <div className="h-px bg-slate-800" />
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-300">You Receive</span>
                <span className="text-white">0.00 vTokens</span>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-amber-500/5 border border-amber-500/15 rounded-lg">
              <div className="text-amber-300 text-sm mt-0.5">⚠</div>
              <div className="text-[10px] text-amber-100/80 leading-relaxed">
                By depositing, you agree to the protocol terms. Smart contracts are audited but risks remain.
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-700 bg-slate-950 rounded-b-xl">
            {canConfirm ? (
              <Button variant="primary" className="w-full py-3.5" onClick={onConfirm}>
                Confirm Deposit
              </Button>
            ) : (
              <Button variant="primary" className="w-full py-3.5" onClick={onLogin}>
                Connect Wallet to Deposit
              </Button>
            )}
          </div>
        </Surface>
      </div>
    </div>
  );
}