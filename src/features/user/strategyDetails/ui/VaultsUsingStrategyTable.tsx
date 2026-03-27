"use client";

import React from "react";
import Link from "next/link";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import type { VaultUsingStrategy } from "../types";

export function VaultsUsingStrategyTable({
  vaults,
  filter,
  onChangeFilter,
}: {
  vaults: VaultUsingStrategy[];
  filter: string;
  onChangeFilter: (value: string) => void;
}) {
  return (
    <Surface variant="panel" className="bg-slate-900 border-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
      <SurfaceHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <i className="fa-solid fa-vault text-cyan-400" aria-hidden="true" />
              Vaults Using This Strategy
            </h2>
            <p className="text-xs text-slate-400 mt-1">Owner vaults filtered by strategy_id</p>
          </div>

          <div className="w-full md:w-72">
            <input
              value={filter}
              onChange={(e) => onChangeFilter(e.target.value)}
              placeholder="Search vaults..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>
        </div>
      </SurfaceHeader>

      <SurfaceBody>
        {vaults.length === 0 ? (
          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-6 text-sm text-slate-400">
            No owner vaults are currently linked to this strategy.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Vault</th>
                  <th className="px-4 py-3">Chain</th>
                  <th className="px-4 py-3">DEX</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {vaults.map((vault) => (
                  <tr key={vault.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-white">{vault.name}</div>
                        <div className="text-xs text-slate-500">{vault.alias}</div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-300">{vault.chainName}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{vault.dexName}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-medium border ${
                          vault.status === "active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-slate-700/20 text-slate-400 border-slate-600/20"
                        }`}
                      >
                        {vault.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-xs font-mono text-slate-400">{vault.address}</td>

                    <td className="px-4 py-3 text-right">
                      <Link
                        href={vault.href}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SurfaceBody>
    </Surface>
  );
}