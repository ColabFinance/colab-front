"use client";

import type { DexRegistryItem } from "../types";

type Props = {
  items: DexRegistryItem[];
  onEdit: (dex: DexRegistryItem) => void;
  loading?: boolean;
};

function shortAddr(addr: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore
  }
}

export default function DexRegistryTable({ items, onEdit, loading = false }: Props) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px] lg:min-w-full">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-700 text-[10px] uppercase text-slate-500 font-semibold tracking-wider">
              <th className="px-4 md:px-6 py-4">DEX Details</th>
              <th className="px-4 md:px-6 py-4">Router Address</th>
              <th className="px-4 md:px-6 py-4">Pools</th>
              <th className="px-4 md:px-6 py-4 text-center">Enabled</th>
              <th className="px-4 md:px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                  Loading DEX registry...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                  No DEX registry records found for the current filters.
                </td>
              </tr>
            ) : (
              items.map((d) => (
                <tr key={d.id} className="group hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold">
                        {d.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{d.name}</div>
                        <div className="mt-1 inline-flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-cyan-400 bg-cyan-900/10 px-1.5 py-0.5 rounded border border-cyan-500/10">
                            {d.key}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {d.chainName} #{d.chainId}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded border ${
                              d.status === "ACTIVE"
                                ? "bg-green-500/10 text-green-300 border-green-500/20"
                                : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                            }`}
                          >
                            {d.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-2 rounded border border-slate-700 group-hover:border-slate-600 transition-colors w-fit">
                      <span className="font-mono text-xs text-slate-300">{shortAddr(d.routerAddress)}</span>

                      <button
                        onClick={() => copyToClipboard(d.routerAddress)}
                        className="text-slate-500 hover:text-white transition-colors"
                        title="Copy"
                      >
                        <span className="text-[10px]">⧉</span>
                      </button>

                      {d.explorerUrl ? (
                        <a
                          href={d.explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Open explorer"
                        >
                          <span className="text-[10px]">↗</span>
                        </a>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-4 md:px-6 py-4">
                    <div className="space-y-2">
                      <div className="text-sm text-white">
                        {d.poolsCount} {d.poolsCount === 1 ? "pool" : "pools"}
                      </div>

                      {d.poolsPreview.length ? (
                        <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                          {d.poolsPreview.map((pool) => (
                            <span
                              key={pool}
                              className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200 border border-slate-700"
                            >
                              {pool}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500">No pools linked yet</div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 md:px-6 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-default">
                      <input type="checkbox" checked={d.enabled} readOnly className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-950 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:bg-cyan-500" />
                    </label>
                  </td>

                  <td className="px-4 md:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(d)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit"
                      >
                        ✎
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">{d.updatedAtLabel}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-slate-700 bg-slate-950/30">
        <div className="text-xs text-slate-500">
          Total results: <span className="text-white font-medium">{items.length}</span>
        </div>
      </div>
    </div>
  );
}