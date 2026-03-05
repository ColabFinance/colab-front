"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Surface, SurfaceBody, SurfaceFooter, SurfaceHeader } from "@/presentation/components/Surface";
import { Button } from "@/presentation/components/Button";
import { VaultRow } from "../types";
import { IconX } from "./icons";

export function DepositModal({
  open,
  vault,
  onClose,
}: {
  open: boolean;
  vault: VaultRow | null;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");

  const title = useMemo(() => {
    if (!vault) return "Deposit Assets";
    return `Deposit Assets — ${vault.pairLabel}`;
  }, [vault]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setAmount("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Surface variant="panel" className="rounded-2xl overflow-hidden shadow-2xl">
          <SurfaceHeader className="flex items-center justify-between">
            <div className="text-white font-semibold">{title}</div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <IconX className="h-4 w-4" />
            </button>
          </SurfaceHeader>

          <SurfaceBody className="space-y-5">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="text-sm text-slate-300">
                {vault ? `${vault.chainName} • ${vault.dexName}` : "—"}
              </div>
              <div className="text-xs text-slate-500">{vault?.strategyKey ?? ""}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-16 py-3 text-white text-lg font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="0.0"
                />
                <button
                  type="button"
                  onClick={() => setAmount("1.0")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-xs text-cyan-300 font-medium rounded hover:bg-slate-700 transition-colors"
                >
                  MAX
                </button>
              </div>

              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Balance: 1.42</span>
                <span>~$0.00</span>
              </div>
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-200/80">
              Estimated Gas: <span className="font-mono text-blue-100">0.004 ETH</span> (~$8.50)
            </div>
          </SurfaceBody>

          <SurfaceFooter>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                // mock placeholder (wire backend later)
                onClose();
              }}
              disabled={!amount || Number(amount) <= 0}
            >
              Confirm Deposit
            </Button>
          </SurfaceFooter>
        </Surface>
      </div>

      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0"
        onClick={onClose}
      />
    </div>
  );
}