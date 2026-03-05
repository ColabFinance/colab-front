"use client";

import React, { useMemo, useState } from "react";
import { AddressPill } from "@/presentation/components/AddressPill";
import { Badge } from "@/presentation/components/Badge";
import { Button } from "@/presentation/components/Button";
import { Surface } from "@/presentation/components/Surface";
import { cn } from "@/shared/utils/cn";
import { ProtocolFeeBalanceItem, ProtocolFeeCollectorSummary } from "../types";

export function WithdrawDrawer({
  open,
  onClose,
  collector,
  balances,
  selectedBalanceId,
  onSelectBalanceId,
}: {
  open: boolean;
  onClose: () => void;
  collector: ProtocolFeeCollectorSummary;
  balances: ProtocolFeeBalanceItem[];
  selectedBalanceId: string;
  onSelectBalanceId: (id: string) => void;
}) {
  const selected = useMemo(() => {
    return balances.find((b) => b.id === selectedBalanceId) ?? balances[0];
  }, [balances, selectedBalanceId]);

  const [assetMenuOpen, setAssetMenuOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [confirmText, setConfirmText] = useState<string>("");

  const confirmOk = confirmText.trim().toUpperCase() === "CONFIRM";
  const amountOk = Number(amount) > 0;
  const canSend = confirmOk && amountOk;

  function closeAll() {
    setAssetMenuOpen(false);
    onClose();
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeAll}
      />

      <div
        className={cn(
          "fixed right-0 top-0 z-[70] h-full w-full sm:w-[420px] border-l border-slate-700 bg-slate-900 shadow-2xl transition-transform",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-700 bg-slate-950/50 p-6">
            <div>
              <h3 className="text-xl font-bold text-white">Withdraw Funds</h3>
              <p className="mt-1 text-xs text-slate-400">Transfer tokens to Treasury</p>
            </div>
            <button
              type="button"
              onClick={closeAll}
              className="h-9 w-9 rounded-full border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Asset
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAssetMenuOpen((v) => !v)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-left hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-full border border-slate-700 bg-slate-900 grid place-items-center">
                        <span className="text-xs font-semibold text-slate-200">
                          {selected?.symbol.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-white">{selected?.symbol}</div>
                        <div className="text-xs text-slate-500 truncate">
                          Balance: <span className="text-slate-300">{selected?.balanceLabel}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-500">▾</span>
                  </div>
                </button>

                {assetMenuOpen && (
                  <Surface
                    variant="panel"
                    className="absolute mt-2 w-full overflow-hidden p-2 bg-slate-900"
                  >
                    <div className="max-h-60 overflow-y-auto">
                      {balances.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            onSelectBalanceId(b.id);
                            setAssetMenuOpen(false);
                          }}
                          className={cn(
                            "w-full rounded-lg px-3 py-2 text-left hover:bg-slate-800 transition-colors",
                            b.id === selectedBalanceId && "bg-slate-800/60"
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-white">{b.symbol}</div>
                              <div className="text-xs text-slate-500 truncate">{b.name}</div>
                            </div>
                            <div className="text-xs font-mono text-slate-300">{b.balanceLabel}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </Surface>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Amount
              </label>

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
                <div className="flex items-center gap-3">
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    className="w-full bg-transparent text-2xl font-bold text-white placeholder:text-slate-700 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setAmount(selected?.balanceLabel?.replaceAll(",", "") ?? "")}
                    className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                  >
                    MAX
                  </button>
                </div>
                <div className="mt-2 text-xs text-slate-500">≈ $0.00 USD</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Destination
              </label>

              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full border border-slate-700 bg-slate-900 grid place-items-center text-slate-300">
                    🏛
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white">Protocol Treasury</div>
                    <div className="mt-1">
                      <AddressPill address={collector.treasuryAddress} />
                    </div>
                    <p className="mt-3 border-t border-slate-700 pt-3 text-[10px] text-slate-500">
                      Funds will be sent to the configured treasury address. This address is managed by
                      the Timelock controller.
                    </p>
                  </div>

                  <div className="ml-auto">
                    <Badge tone="green" className="text-[10px]">
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-red-300 uppercase tracking-wider">
                Type &quot;CONFIRM&quot; to execute
              </label>
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="CONFIRM"
                className="w-full rounded-lg border border-red-900/50 bg-slate-950 p-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              />
            </div>
          </div>

          <div className="border-t border-slate-700 bg-slate-950 p-6">
            <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
              <span>Gas Estimate</span>
              <span className="text-slate-200">~0.004 ETH ($12.50)</span>
            </div>

            <Button
              variant="primary"
              className={cn("w-full justify-center", !canSend && "opacity-60")}
              disabled={!canSend}
              onClick={() => {
                // mock-only placeholder for now
                // later: wire to onchain usecase / api
                closeAll();
                setAmount("");
                setConfirmText("");
              }}
            >
              Send Transaction
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}