import React from "react";
import { Surface } from "@/presentation/components/Surface";
import { Button } from "@/presentation/components/Button";
import { Badge } from "@/presentation/components/Badge";
import { TokenPill } from "@/presentation/components/TokenPill";
import type { TopVaultRow } from "../types";

function statusBadge(status: TopVaultRow["status"]) {
  if (status === "active") return <Badge tone="green">Active</Badge>;
  if (status === "capped") return <Badge tone="amber">Capped</Badge>;
  return <Badge tone="red">Disabled</Badge>;
}

export function TopVaultsTable({
  query,
  onQuery,
  rows,
  onDeposit,
}: {
  query: string;
  onQuery: (v: string) => void;
  rows: TopVaultRow[];
  onDeposit: (v: TopVaultRow) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-lg font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-gem text-amber-400" aria-hidden="true" />
          Top Vaults
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">⌕</span>
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Filter by name..."
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-600 transition-colors w-44"
            />
          </div>
          <button className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 hover:text-white hover:border-cyan-600/40 transition-colors">
            Filter
          </button>
        </div>
      </div>

      <Surface variant="table" className="shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[860px]">
            <thead className="bg-slate-950/40 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-slate-800">Vault Name</th>
                <th className="px-6 py-4 border-b border-slate-800">Pair / DEX</th>
                <th className="px-6 py-4 border-b border-slate-800 text-right">TVL</th>
                <th className="px-6 py-4 border-b border-slate-800 text-right">APR / APY</th>
                <th className="px-6 py-4 border-b border-slate-800 text-center">Status</th>
                <th className="px-6 py-4 border-b border-slate-800 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800 bg-slate-900">
              {rows.map((r) => (
                <tr key={r.id} className="group hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-500/25 shrink-0 grid place-items-center text-blue-300 text-xs font-black">
                        {r.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{r.name}</div>
                        <div className="text-[10px] text-slate-500">{r.subtitle}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2 items-center">
                        {r.pairSymbols.map((s) => (
                          <TokenPill key={s} symbol={s} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{r.dexLabel}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-medium text-white">{r.tvl}</div>
                    {r.tvlDelta && <div className="text-[10px] text-green-300">{r.tvlDelta}</div>}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-cyan-300">{r.apy}</span>
                      <span className="text-[10px] text-slate-500">{r.apr}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">{statusBadge(r.status)}</td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" className="px-3 py-1.5">
                        View
                      </Button>

                      {r.status === "capped" ? (
                        <button
                          className="px-3 py-1.5 bg-slate-800 text-slate-400 text-xs font-medium rounded-md cursor-not-allowed border border-slate-700"
                          disabled
                        >
                          Full
                        </button>
                      ) : (
                        <Button
                          variant="primary"
                          className="px-3 py-1.5"
                          onClick={() => onDeposit(r)}
                        >
                          Deposit
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-sm text-slate-400" colSpan={6}>
                    No vaults matched your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Surface>
    </div>
  );
}