import React from "react";
import Link from "next/link";
import { Surface } from "@/presentation/components/Surface";
import { Badge } from "@/presentation/components/Badge";
import type { TopStrategyRow } from "../types";

function statusBadge(status: TopStrategyRow["status"]) {
  if (status === "active") return <Badge tone="green">Active</Badge>;
  return <Badge tone="slate">Inactive</Badge>;
}

export function TopStrategiesTable({
  query,
  onQuery,
  rows,
}: {
  query: string;
  onQuery: (value: string) => void;
  rows: TopStrategyRow[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-lg font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-chess-knight text-cyan-400" aria-hidden="true" />
          Strategies
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">⌕</span>
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Filter strategies..."
            className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-600 transition-colors w-52"
          />
        </div>
      </div>

      <Surface variant="table" className="shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[860px]">
            <thead className="bg-slate-950/40 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-slate-800">Strategy</th>
                <th className="px-6 py-4 border-b border-slate-800">Indicator Set</th>
                <th className="px-6 py-4 border-b border-slate-800 text-center">Chain</th>
                <th className="px-6 py-4 border-b border-slate-800 text-center">Status</th>
                <th className="px-6 py-4 border-b border-slate-800 text-center">Vault Link</th>
                <th className="px-6 py-4 border-b border-slate-800 text-center">Updated</th>
                <th className="px-6 py-4 border-b border-slate-800 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800 bg-slate-900">
              {rows.map((row) => (
                <tr key={row.id} className="group hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white text-sm">{row.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{row.symbol}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300">{row.indicatorSetLabel}</div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-md text-xs text-slate-300">
                      {row.chainLabel}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">{statusBadge(row.status)}</td>

                  <td className="px-6 py-4 text-center">
                    {row.linkedVaultLabel ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border bg-cyan-500/10 border-cyan-500/20 text-cyan-400">
                        Linked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border bg-slate-500/10 border-slate-500/20 text-slate-400">
                        No Vault
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center text-xs text-slate-400">{row.updatedAtLabel}</td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      href={row.href}
                      className="inline-flex px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-xs text-slate-200 hover:text-white hover:border-cyan-600/40 transition-colors"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-sm text-slate-400" colSpan={7}>
                    No strategies matched your filter.
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