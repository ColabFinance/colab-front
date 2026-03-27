"use client";

import React from "react";
import { Surface } from "@/presentation/components/Surface";
import { VaultHeaderView } from "../types";

type Props = {
  header: VaultHeaderView;
  canManage: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onOpenConfig: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
  onCompoundBuffer: () => void;
};

function shortAddress(value: string) {
  if (!value) return "—";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function VaultHeaderCard({
  header,
  canManage,
  refreshing,
  onRefresh,
  onOpenConfig,
  onDeposit,
  onWithdraw,
  onCompoundBuffer,
}: Props) {
  return (
    <Surface variant="panel" className="overflow-hidden border border-slate-800 bg-slate-900">
      <div className="relative px-5 py-5 sm:px-6">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex -space-x-3">
              <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-slate-900 bg-slate-800 text-sm font-semibold text-white">
                {header.token0Symbol.slice(0, 2)}
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-slate-900 bg-slate-700 text-sm font-semibold text-white">
                {header.token1Symbol.slice(0, 2)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  {header.title}
                </h1>

                <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-green-300">
                  {header.statusLabel}
                </span>

                <span className="text-xs text-slate-500">{header.updatedLabel}</span>
              </div>

              <p className="text-sm text-slate-300">{header.pairLabel}</p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-blue-300">
                  {header.chainLabel}
                </span>

                <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-cyan-300">
                  {header.dexLabel}
                </span>

                <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300">
                  Vault {shortAddress(header.vaultAddress)}
                </span>

                <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300">
                  Pool {shortAddress(header.poolAddress)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-auto">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <button
                type="button"
                onClick={onRefresh}
                disabled={refreshing}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              {canManage ? (
                <>
                  <button
                    type="button"
                    onClick={onOpenConfig}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
                  >
                    Configure
                  </button>

                  <button
                    type="button"
                    onClick={onDeposit}
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-cyan-500"
                  >
                    Deposit
                  </button>

                  <button
                    type="button"
                    onClick={onWithdraw}
                    className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-300 transition hover:bg-amber-500/15"
                  >
                    Withdraw All
                  </button>

                  <button
                    type="button"
                    onClick={onCompoundBuffer}
                    className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/15"
                  >
                    Compound Buffer
                  </button>
                </>
              ) : null}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-3 text-xs text-slate-400">
              {canManage
                ? "Owner mode enabled. This wallet can operate and configure the vault."
                : "Public read mode. Anyone can inspect the vault, but only the owner can operate it."}
            </div>
          </div>
        </div>
      </div>
    </Surface>
  );
}