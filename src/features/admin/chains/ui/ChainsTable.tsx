"use client";

import React from "react";
import type { ChainRow } from "./types";

function StatusPill({ status }: { status: ChainRow["status"] }) {
  if (status === "enabled") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        Enabled
      </span>
    );
  }
  if (status === "maintenance") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-300">
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        Maintenance
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-400/10 px-2.5 py-1 text-xs font-medium text-rose-300">
      <span className="h-2 w-2 rounded-full bg-rose-400" />
      Disabled
    </span>
  );
}

export default function ChainsTable(props: {
  rows: ChainRow[];
  onTestRpc: (row: ChainRow) => void;
  onEdit: (row: ChainRow) => void;
  onToggle: (row: ChainRow) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4 font-medium">Chain Name</th>
              <th className="px-6 py-4 font-medium">Chain ID</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">RPC URL</th>
              <th className="px-6 py-4 font-medium">Native / Stable</th>
              <th className="px-6 py-4 font-medium">Last Updated</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10 text-sm">
            {props.rows.map((r) => (
              <tr key={r.key} className="group transition hover:bg-white/[0.04]">
                {/* Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/20">
                      {r.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.logoUrl} alt="" className="h-5 w-5 rounded-full" />
                      ) : (
                        <span className="text-xs text-slate-500">◎</span>
                      )}
                    </div>

                    <div>
                      <div className="font-medium text-white">{r.name}</div>
                      <a
                        href={r.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-sky-300 hover:underline"
                      >
                        {r.explorerLabel} <span className="text-[10px]">↗</span>
                      </a>
                    </div>
                  </div>
                </td>

                {/* Chain ID */}
                <td className="px-6 py-4">
                  <span className="rounded border border-white/10 bg-black/20 px-2 py-1 font-mono text-slate-300">
                    {r.chainId}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <StatusPill status={r.status} />
                </td>

                {/* RPC */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">{r.rpcUrl}</span>
                    <button
                      onClick={() => props.onTestRpc(r)}
                      className="rounded border border-white/10 bg-black/20 px-2 py-1 text-xs text-slate-300 transition hover:border-sky-400/30 hover:text-white"
                      title="Test RPC"
                    >
                      Test
                    </button>
                  </div>
                </td>

                {/* Native / Stable */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-200">{r.nativeSymbol}</span>
                    <div className="flex flex-wrap gap-1">
                      {r.stables.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="rounded border border-white/10 bg-black/20 px-1.5 py-0.5 text-[10px] text-slate-400"
                        >
                          {s}
                        </span>
                      ))}
                      {r.stables.length > 4 && (
                        <span className="text-[10px] text-slate-500">+{r.stables.length - 4}</span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Updated */}
                <td className="px-6 py-4 text-xs text-slate-500">{r.updatedAt}</td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => props.onTestRpc(r)}
                      className="rounded-md border border-white/10 bg-black/20 p-2 text-slate-300 transition hover:border-sky-400/30 hover:text-white"
                      title="Test RPC"
                    >
                      🩺
                    </button>
                    <button
                      onClick={() => props.onEdit(r)}
                      className="rounded-md border border-white/10 bg-black/20 p-2 text-slate-300 transition hover:border-blue-400/30 hover:text-white"
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => props.onToggle(r)}
                      className="rounded-md border border-white/10 bg-black/20 p-2 text-slate-300 transition hover:border-rose-400/30 hover:text-white"
                      title={r.status === "disabled" ? "Enable" : "Disable"}
                    >
                      ⏻
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {props.rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-500">
                  No chains match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}