"use client";

import { DexRegistryItem } from "../types";

type Props = {
  items: DexRegistryItem[];
  onEdit: (dex: DexRegistryItem) => void;
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

export default function DexRegistryTable({ items, onEdit }: Props) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px] lg:min-w-full">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-700 text-[10px] uppercase text-slate-500 font-semibold tracking-wider">
              <th className="px-4 md:px-6 py-4">DEX Details</th>
              <th className="px-4 md:px-6 py-4 hidden sm:table-cell">Router Address</th>
              <th className="px-4 md:px-6 py-4 hidden md:table-cell">Pool Types</th>
              <th className="px-4 md:px-6 py-4 text-center">Enabled</th>
              <th className="px-4 md:px-6 py-4 text-center">Verify</th>
              <th className="px-4 md:px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {items.map((d) => (
              <tr key={d.id} className="group hover:bg-slate-800/50 transition-colors">
                <td className="px-4 md:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold">
                      {d.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{d.name}</div>
                      <div className="mt-1 inline-flex items-center gap-2">
                        <span className="text-xs font-mono text-cyan-400 bg-cyan-900/10 px-1.5 py-0.5 rounded border border-cyan-500/10">
                          {d.key}
                        </span>
                        <span className="text-[10px] text-slate-500">#{d.chainId}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-12">Router:</span>

                      <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-700 group-hover:border-slate-600 transition-colors">
                        <span className="font-mono text-xs text-slate-300">{shortAddr(d.routerAddress)}</span>

                        <button
                          onClick={() => copyToClipboard(d.routerAddress)}
                          className="text-slate-500 hover:text-white transition-colors"
                          title="Copy"
                        >
                          <span className="text-[10px]">⧉</span>
                        </button>

                        <a
                          href="#"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Open explorer (later)"
                          onClick={(e) => e.preventDefault()}
                        >
                          <span className="text-[10px]">↗</span>
                        </a>
                      </div>
                    </div>

                    {d.quoterAddress ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 w-12">Quoter:</span>
                        <span className="font-mono text-xs text-slate-400">{shortAddr(d.quoterAddress)}</span>
                      </div>
                    ) : null}
                  </div>
                </td>

                <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                    {d.poolTypes.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200 border border-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="px-4 md:px-6 py-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={d.enabled} readOnly className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-950 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:bg-cyan-500" />
                  </label>
                </td>

                <td className="px-4 md:px-6 py-4 text-center">
                  {d.verification === "verified" ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      ✓
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      !
                    </span>
                  )}
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
                    <button
                      onClick={() => {}}
                      className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Re-verify"
                    >
                      ↻
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{d.updatedAtLabel}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-between bg-slate-950/30">
        <div className="text-xs text-slate-500">
          Showing <span className="text-white font-medium">1</span> to{" "}
          <span className="text-white font-medium">{Math.min(items.length, 10)}</span> of{" "}
          <span className="text-white font-medium">{items.length}</span> results
        </div>

        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-400 rounded hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            ‹
          </button>
          <button className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-400 rounded hover:text-white">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}