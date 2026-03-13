"use client";

import React from "react";
import { Surface } from "@/presentation/components/Surface";
import { VaultDetails, VaultTone } from "../types";

function toneClasses(tone?: VaultTone) {
  if (tone === "green") return "border-green-500/20 bg-green-500/10 text-green-300";
  if (tone === "cyan") return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
  if (tone === "blue") return "border-blue-500/20 bg-blue-500/10 text-blue-300";
  if (tone === "amber") return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  if (tone === "red") return "border-red-500/20 bg-red-500/10 text-red-300";
  return "border-slate-700 bg-slate-800 text-slate-300";
}

function statusClasses(status: VaultDetails["header"]["status"]) {
  if (status === "ACTIVE") return "border-green-500/20 bg-green-500/10 text-green-300";
  if (status === "PAUSED") return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  return "border-red-500/20 bg-red-500/10 text-red-300";
}

function shortAddress(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

type Props = {
  data: VaultDetails;
  canManage: boolean;
  onDeposit: () => void;
  onWithdraw: () => void;
  onClaim: () => void;
};

export function VaultHeaderCard({
  data,
  canManage,
  onDeposit,
  onWithdraw,
  onClaim,
}: Props) {
  const connected = data.viewer.connected;

  return (
    <Surface variant="panel" className="overflow-hidden border border-slate-800 bg-slate-900">
      <div className="relative overflow-hidden px-5 py-5 sm:px-6">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex -space-x-3">
              <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-slate-900 bg-slate-800 text-sm font-semibold text-white">
                {data.token0.symbol.slice(0, 2)}
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-slate-900 bg-slate-700 text-sm font-semibold text-white">
                {data.token1.symbol.slice(0, 2)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  {data.header.pairLabel}
                </h1>

                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusClasses(
                    data.header.status,
                  )}`}
                >
                  {data.header.status}
                </span>

                <span className="text-xs text-slate-500">{data.header.updatedAtLabel}</span>
              </div>

              <p className="max-w-2xl text-sm text-slate-400">{data.header.subtitle}</p>

              <div className="flex flex-wrap items-center gap-2">
                {data.header.badges.map((badge) => (
                  <span
                    key={badge.label}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${toneClasses(
                      badge.tone,
                    )}`}
                  >
                    {badge.label}
                  </span>
                ))}

                <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300">
                  Vault {shortAddress(data.header.address)}
                </span>

                <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300">
                  Pool {shortAddress(data.header.poolAddress)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[320px]">
            {canManage ? (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                    className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
                  >
                    Withdraw
                  </button>

                  <button
                    type="button"
                    onClick={onClaim}
                    className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/15"
                  >
                    Claim
                  </button>
                </div>

                <div className="rounded-lg border border-green-500/10 bg-green-500/5 px-4 py-3 text-xs text-green-200">
                  Owner mode enabled. This connected wallet matches the vault owner.
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-4">
                {!connected ? (
                  <p className="text-sm text-slate-300">
                    Connect wallet to verify permissions.
                  </p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm text-slate-300">
                      This vault is viewable by all users.
                    </p>
                    <p className="text-xs text-slate-500">
                      Only the vault owner can deposit, withdraw or claim rewards.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Surface>
  );
}