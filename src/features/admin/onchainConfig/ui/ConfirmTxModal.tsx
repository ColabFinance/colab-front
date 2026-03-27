"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { PendingTx } from "../types";
import { Button } from "@/presentation/components/Button";
import { AddressPill } from "@/presentation/components/AddressPill";

export function ConfirmTxModal({
  open,
  tx,
  onClose,
  onExecute,
}: {
  open: boolean;
  tx: PendingTx | null;
  onClose: () => void;
  onExecute: () => void;
}) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!open) setTyped("");
  }, [open, tx?.contractAddress, tx?.functionLabel]);

  const canExecute = useMemo(() => typed.trim().toUpperCase() === "CONFIRM", [typed]);

  if (!open || !tx) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-orange-600/15 to-red-600/10 flex items-start gap-4">
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-orange-300">
            ⚠
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-white">Confirm On-chain Transaction</div>
            <div className="text-sm text-slate-300">{tx.description}</div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-4 font-mono text-xs space-y-2">
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Contract:</span>
              <span className="text-cyan-300 flex items-center gap-2">
                {tx.contractLabel}
                <AddressPill address={tx.contractAddress} withCopy={true} className="text-[10px]" />
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Function:</span>
              <span className="text-yellow-300">{tx.functionLabel}</span>
            </div>

            <div className="border-t border-slate-800 pt-2">
              <div className="text-slate-500 mb-1">Parameters:</div>
              <div className="pl-2 border-l-2 border-slate-700 text-slate-200 space-y-1">
                {tx.params.map((p) => (
                  <div key={p.k} className="flex justify-between gap-3">
                    <span className="text-slate-400">{p.k}:</span>
                    <span className="text-green-300">{p.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Type "CONFIRM" to proceed
            </label>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className={cn(
                "w-full rounded-lg border bg-slate-950 px-4 py-2 text-white outline-none",
                "border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              )}
              placeholder="CONFIRM"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-950/40 flex justify-end gap-3">
          <Button
            variant="secondary"
            className="bg-transparent border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            className="bg-red-600 hover:bg-red-500 text-white border border-red-500/40"
            onClick={onExecute}
            disabled={!canExecute}
          >
            Sign & Execute
          </Button>
        </div>
      </div>
    </div>
  );
}