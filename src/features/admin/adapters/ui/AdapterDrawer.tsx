"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { Surface } from "@/presentation/components/Surface";
import { AdminDexItem, AdminDexPoolItem } from "@/core/infra/api/api-lp/admin";
import { AdapterDraft } from "../types";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function AdapterDrawer({
  open,
  chain,
  dexes,
  pools,
  poolsLoading,
  saving,
  onClose,
  onDexChange,
  onSave,
}: {
  open: boolean;
  chain: string;
  dexes: AdminDexItem[];
  pools: AdminDexPoolItem[];
  poolsLoading: boolean;
  saving: boolean;
  onClose: () => void;
  onDexChange: (dex: string) => void;
  onSave: (draft: AdapterDraft) => void;
}) {
  const [draft, setDraft] = useState<AdapterDraft>({
    dex: "",
    pool: "",
    feeBuffer: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (!open) return;
    setDraft({
      dex: "",
      pool: "",
      feeBuffer: "",
      status: "ACTIVE",
    });
  }, [open]);

  const selectedDex = useMemo(
    () => dexes.find((item) => item.dex === draft.dex),
    [dexes, draft.dex]
  );

  const selectedPool = useMemo(
    () => pools.find((item) => item.pool === draft.pool),
    [pools, draft.pool]
  );

  const selectedPoolHasAdapter =
    !!selectedPool?.adapter &&
    selectedPool.adapter.toLowerCase() !== ZERO_ADDRESS;

  const canSave =
    !!draft.dex &&
    !!draft.pool &&
    isValidNonZeroAddress(draft.feeBuffer) &&
    !selectedPoolHasAdapter &&
    !saving;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-[70] flex h-full w-full max-w-2xl flex-col border-l border-slate-700 bg-slate-900 shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-950/40">
          <div>
            <h3 className="text-xl font-bold text-slate-100">Deploy New Adapter</h3>
            <p className="text-sm text-slate-400 mt-1">
              Create a real adapter using the selected chain, dex and pool from the registry.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="space-y-4">
            <SectionTitle dotClassName="bg-cyan-500" title="Registry Source" />

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Chain</Label>
                <input
                  value={chain}
                  disabled
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-400 uppercase"
                />
              </div>

              <div className="col-span-2">
                <Label>DEX</Label>
                <select
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  value={draft.dex}
                  onChange={(e) => {
                    const nextDex = e.target.value;
                    setDraft((prev) => ({ ...prev, dex: nextDex, pool: "" }));
                    onDexChange(nextDex);
                  }}
                >
                  <option value="" disabled>
                    Select DEX...
                  </option>
                  {dexes.map((dex) => (
                    <option key={dex.dex} value={dex.dex}>
                      {dex.dex}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <Label>Pool</Label>
                <select
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-60"
                  value={draft.pool}
                  disabled={!draft.dex || poolsLoading}
                  onChange={(e) => setDraft((prev) => ({ ...prev, pool: e.target.value }))}
                >
                  <option value="" disabled>
                    {poolsLoading
                      ? "Loading pools..."
                      : !draft.dex
                      ? "Select a DEX first"
                      : "Select pool..."}
                  </option>
                  {pools.map((pool) => (
                    <option key={pool.pool} value={pool.pool}>
                      {(pool.pair || pool.symbol || pool.pool) + ` • ${pool.fee_bps} bps`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <SectionTitle dotClassName="bg-blue-500" title="Deployment Settings" />

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Fee Buffer Address</Label>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="0x..."
                  value={draft.feeBuffer}
                  onChange={(e) => setDraft((prev) => ({ ...prev, feeBuffer: e.target.value }))}
                />
                <p className="mt-1.5 text-[10px] text-slate-500">
                  This value is required by the backend to deploy the adapter contract.
                </p>
              </div>

              <div className="col-span-2">
                <Label>Record Status</Label>
                <select
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  value={draft.status}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      status: e.target.value as "ACTIVE" | "ARCHIVED_CAN_CREATE_NEW",
                    }))
                  }
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="ARCHIVED_CAN_CREATE_NEW">ARCHIVED_CAN_CREATE_NEW</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <SectionTitle dotClassName="bg-purple-500" title="Resolved Pool Data" />

            <Surface variant="inset" className="p-4 space-y-3">
              {!selectedPool ? (
                <p className="text-sm text-slate-500">
                  Select a pool to preview the payload that will be sent to the backend.
                </p>
              ) : (
                <>
                  {selectedPoolHasAdapter && (
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
                      This pool already has an adapter registered: {selectedPool.adapter}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <FieldRow label="DEX" value={draft.dex} />
                    <FieldRow label="DEX Router" value={selectedDex?.dex_router ?? "-"} mono />

                    <FieldRow label="Pool" value={selectedPool.pool} mono />
                    <FieldRow label="NFPM" value={selectedPool.nfpm} mono />

                    <FieldRow label="Gauge" value={selectedPool.gauge} mono />
                    <FieldRow label="Pair / Symbol" value={selectedPool.pair || selectedPool.symbol || "-"} />

                    <FieldRow label="Token0" value={selectedPool.token0} mono />
                    <FieldRow label="Token1" value={selectedPool.token1} mono />

                    <FieldRow label="Fee BPS" value={String(selectedPool.fee_bps)} />
                    <FieldRow label="Pool Type" value={selectedPool.pool_type || "-"} />

                    <FieldRow label="Reward Token" value={selectedPool.reward_token || "-"} mono />
                    <FieldRow label="Reward Swap Pool" value={selectedPool.reward_swap_pool || "-"} mono />
                  </div>
                </>
              )}
            </Surface>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700 bg-slate-950/40 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 bg-transparent text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!canSave}
            onClick={() => onSave(draft)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium shadow-[0_0_20px_-8px_rgba(59,130,246,0.45)] transition-colors flex items-center justify-center gap-2"
          >
            <SaveIcon className="h-4 w-4" />
            {saving ? "Deploying..." : "Deploy Adapter"}
          </button>
        </div>
      </div>
    </>
  );
}

function SectionTitle({ title, dotClassName }: { title: string; dotClassName: string }) {
  return (
    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
      <span className={cn("w-1.5 h-1.5 rounded-full", dotClassName)} />
      {title}
    </h4>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-300 mb-1.5">{children}</label>;
}

function FieldRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div
        className={cn(
          "rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200",
          mono && "font-mono text-xs break-all"
        )}
      >
        {value}
      </div>
    </div>
  );
}

function isValidNonZeroAddress(value: string) {
  const normalized = value.trim().toLowerCase();
  return /^0x[a-f0-9]{40}$/.test(normalized) && normalized !== ZERO_ADDRESS;
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M19 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M7 21V13h10v8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7 3v4h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}