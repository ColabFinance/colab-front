"use client";

import Link from "next/link";
import { useState } from "react";
import type { MyVaultItem } from "../types";

function formatUsd(value?: number | null) {
  if (value == null) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatAddress(value: string) {
  if (value.length <= 12) return value;
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function getStatusClasses(status: MyVaultItem["status"]) {
  if (status === "active") {
    return "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  }
  return "border border-slate-600/40 bg-slate-500/10 text-slate-400";
}

function getRangeClasses(rangeState: MyVaultItem["rangeState"]) {
  if (rangeState === "inside") {
    return "border border-cyan-500/20 bg-cyan-500/10 text-cyan-400";
  }
  if (rangeState === "outside") {
    return "border border-amber-500/20 bg-amber-500/10 text-amber-400";
  }
  return "border border-slate-600/30 bg-slate-500/10 text-slate-400";
}

function getRangeLabel(rangeState: MyVaultItem["rangeState"]) {
  if (rangeState === "inside") return "Inside";
  if (rangeState === "outside") return "Outside";
  return "N/A";
}

export function MyVaultsTable({
  vaults,
  onCreateVault,
  isLoading = false,
}: {
  vaults: MyVaultItem[];
  onCreateVault: () => void;
  isLoading?: boolean;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (vault: MyVaultItem) => {
    try {
      await navigator.clipboard.writeText(vault.address);
      setCopiedId(vault.id);
      window.setTimeout(() => setCopiedId(null), 1200);
    } catch {
      setCopiedId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-6 py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        <div className="mt-4 text-sm text-slate-400">Loading vaults...</div>
      </div>
    );
  }

  if (!vaults.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-6 py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-3xl text-slate-500">
            V
          </div>

          <h3 className="mt-6 text-xl font-semibold text-white">No vaults yet</h3>
          <p className="mt-2 text-sm text-slate-400">
            Vaults are individual contracts linked to your strategies. Create your first vault to
            get started.
          </p>

          <button
            type="button"
            onClick={onCreateVault}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-sm font-medium text-white transition hover:from-blue-500 hover:to-cyan-500"
          >
            Create Vault
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[1120px] w-full border-collapse text-left">
        <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="border-b border-slate-800 px-6 py-4">Vault</th>
            <th className="border-b border-slate-800 px-6 py-4">Address</th>
            <th className="border-b border-slate-800 px-6 py-4">Strategy</th>
            <th className="border-b border-slate-800 px-6 py-4">Market</th>
            <th className="border-b border-slate-800 px-6 py-4">Chain / DEX</th>
            <th className="border-b border-slate-800 px-6 py-4 text-center">State</th>
            <th className="border-b border-slate-800 px-6 py-4 text-center">Range</th>
            <th className="border-b border-slate-800 px-6 py-4 text-right">Current Value</th>
            <th className="border-b border-slate-800 px-6 py-4">Updated</th>
            <th className="border-b border-slate-800 px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800 bg-slate-900/40">
          {vaults.map((vault) => (
            <tr key={vault.id} className="transition hover:bg-slate-800/40">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 text-cyan-400">
                    V
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-white">{vault.name}</div>
                    <div className="text-[11px] text-slate-500">{vault.subtitle}</div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-mono text-slate-400">
                    {formatAddress(vault.address)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopy(vault)}
                    className="text-xs font-medium text-slate-500 transition hover:text-cyan-400"
                  >
                    {copiedId === vault.id ? "Copied" : "Copy"}
                  </button>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="text-sm font-medium text-white">{vault.strategyName}</div>
                <div className="text-[11px] font-mono text-slate-500">#{vault.strategyId}</div>
              </td>

              <td className="px-6 py-4">
                <div className="text-sm font-medium text-slate-200">{vault.marketPair}</div>
              </td>

              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-slate-300">{vault.chainName}</span>
                  <span className="w-fit rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">
                    {vault.dexName}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(vault.status)}`}
                >
                  {vault.status === "active" ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-medium ${getRangeClasses(vault.rangeState)}`}
                >
                  {getRangeLabel(vault.rangeState)}
                </span>
              </td>

              <td className="px-6 py-4 text-right">
                <div className="text-sm font-semibold text-white">{formatUsd(vault.currentValueUsd)}</div>
                <div
                  className={`text-[11px] ${
                    vault.pnlPct == null
                      ? "text-slate-500"
                      : vault.pnlPct >= 0
                        ? "text-emerald-400"
                        : "text-rose-400"
                  }`}
                >
                  {vault.pnlPct == null ? "—" : `${vault.pnlPct > 0 ? "+" : ""}${vault.pnlPct.toFixed(1)}%`}
                </div>
              </td>

              <td className="px-6 py-4">
                <span className="text-xs text-slate-400">{vault.updatedLabel}</span>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <Link
                    href={vault.detailsHref}
                    className="inline-flex items-center justify-center rounded-md border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-400 transition hover:border-cyan-500/40 hover:bg-cyan-500/15"
                  >
                    Details
                  </Link>

                  <a
                    href={vault.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-blue-500/40 hover:text-white"
                  >
                    Scan
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}