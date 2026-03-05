"use client";

import * as React from "react";
import { CopyIcon, PencilIcon, RotateIcon } from "./icons";
import { GlobalContract } from "../types";

type Props = {
  contract: GlobalContract;
  onOpenRegister: (contractName: string) => void;
};

export default function ContractSummaryCard({ contract, onOpenRegister }: Props) {
  const badge =
    contract.status === "active"
      ? { label: "Active", cls: "bg-green-500/10 text-green-400 border-green-500/20" }
      : contract.status === "maintenance"
      ? { label: "Maintenance", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" }
      : { label: "Missing", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" };

  return (
    <div className="lg:col-span-2 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
      <div className="flex flex-col gap-4 border-b border-slate-700 bg-slate-950 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
            {contract.name}
            <span
              className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badge.cls}`}
            >
              {badge.label}
            </span>
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Registry for all approved strategy logic contracts.
          </p>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <button
            onClick={() => onOpenRegister(contract.name)}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-cyan-500/50 hover:text-white sm:flex-none"
          >
            <span className="inline-flex items-center gap-2">
              <PencilIcon size={16} />
              Update
            </span>
          </button>
          <button
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-cyan-500/50 hover:text-white sm:flex-none"
          >
            <span className="inline-flex items-center gap-2">
              <RotateIcon size={16} />
              Sync Read
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-8 p-6 md:grid-cols-2">
        <div className="overflow-hidden">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contract Address
          </label>
          <div className="group flex items-center gap-2">
            <span className="truncate rounded border border-cyan-500/20 bg-cyan-900/10 px-2 py-1 font-mono text-xs text-cyan-400 md:text-sm">
              {contract.address ?? "—"}
            </span>
            <button
              className="shrink-0 text-slate-500 hover:text-white"
              title="Copy Address"
              onClick={() => {
                if (contract.address) navigator.clipboard.writeText(contract.address);
              }}
            >
              <CopyIcon size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Owner / Admin
          </label>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500 text-[8px] font-bold text-white">
              MS
            </div>
            <span className="font-mono text-sm text-slate-200">{contract.owner ?? "—"}</span>
            {contract.ownerTag ? (
              <span className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                {contract.ownerTag}
              </span>
            ) : null}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Version
          </label>
          <span className="font-mono text-sm text-slate-200">{contract.version ?? "—"}</span>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Last Synced
          </label>
          <span className="text-sm text-slate-200">{contract.lastSyncedLabel ?? "—"}</span>
        </div>
      </div>

      <div className="border-t border-slate-700 bg-slate-950 p-6">
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Key Counters
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(contract.counters ?? []).map((c) => (
            <div key={c.label} className="rounded-lg border border-slate-700 bg-slate-900 p-3">
              <div className="text-2xl font-bold text-white">{c.value}</div>
              <div className="mt-1 text-xs text-slate-500">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}