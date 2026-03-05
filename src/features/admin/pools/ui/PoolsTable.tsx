"use client";

import { DexPoolRow } from "../types";
import { Surface } from "@/presentation/components/Surface";
import { PoolsPagination } from "./PoolsPagination";

type Props = {
  rows: DexPoolRow[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;

  selectedIds: Record<string, boolean>;
  onToggleAll: (checked: boolean) => void;
  onToggleOne: (id: string, checked: boolean) => void;

  onEdit: (row: DexPoolRow) => void;
  onValidate: (row: DexPoolRow) => void;

  formatRelative: (d: Date) => string;
};

function typeBadgeClasses(t: DexPoolRow["type"]) {
  if (t === "STABLE") return "bg-blue-500/10 text-blue-300 border-blue-500/20";
  if (t === "WEIGHTED") return "bg-teal-500/10 text-teal-300 border-teal-500/20";
  return "bg-purple-500/10 text-purple-300 border-purple-500/20";
}

function statusBadgeClasses(s: DexPoolRow["status"]) {
  if (s === "active") return "bg-green-500/10 text-green-300 border-green-500/20";
  return "bg-amber-500/10 text-amber-300 border-amber-500/20";
}

export function PoolsTable({
  rows,
  total,
  page,
  pageSize,
  onPageChange,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onEdit,
  onValidate,
  formatRelative,
}: Props) {
  const allChecked = rows.length > 0 && rows.every((r) => selectedIds[r.id]);

  return (
    <Surface variant="table" className="flex flex-col h-[calc(100vh-320px)] min-h-[420px]">
      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-slate-950 sticky top-0 z-10">
            <tr className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider border-b border-slate-700">
              <th className="px-6 py-4 w-12">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => onToggleAll(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-900"
                  aria-label="Select all"
                />
              </th>
              <th className="px-6 py-4">DEX Key</th>
              <th className="px-6 py-4">Pool Address</th>
              <th className="px-6 py-4">Token 0</th>
              <th className="px-6 py-4">Token 1</th>
              <th className="px-6 py-4 text-center">Fee Tier</th>
              <th className="px-6 py-4 text-center">Tick Spacing</th>
              <th className="px-6 py-4 text-center">Type</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Updated</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700 bg-slate-900">
            {rows.map((r) => (
              <tr key={r.id} className="group hover:bg-slate-800/60 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={!!selectedIds[r.id]}
                    onChange={(e) => onToggleOne(r.id, e.target.checked)}
                    className="rounded border-slate-600 bg-slate-900"
                    aria-label={`Select ${r.dexKey}`}
                  />
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center text-[10px] font-bold">
                      {r.dexKey.slice(0, 1).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-white">{r.dexKey}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-300">{r.poolAddressShort}</span>
                    <button
                      onClick={() => navigator.clipboard?.writeText(r.poolAddressFull)}
                      className="text-slate-500 hover:text-cyan-300 transition-colors text-xs"
                      title="Copy"
                      aria-label="Copy pool address"
                    >
                      ⧉
                    </button>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] text-slate-200">
                      {r.token0Symbol}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">{r.token0Symbol}</span>
                      <span className="text-[10px] font-mono text-slate-400">{r.token0AddressShort}</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] text-slate-200">
                      {r.token1Symbol}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">{r.token1Symbol}</span>
                      <span className="text-[10px] font-mono text-slate-400">{r.token1AddressShort}</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
                    {r.feeTierLabel}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="text-xs font-mono text-slate-300">{r.tickSpacing}</span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${typeBadgeClasses(
                      r.type
                    )}`}
                  >
                    {r.type}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadgeClasses(
                      r.status
                    )}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        r.status === "active" ? "bg-green-400" : "bg-amber-400"
                      }`}
                    />
                    {r.status === "active" ? "Active" : "Paused"}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <span className="text-xs text-slate-400">{formatRelative(r.updatedAt)}</span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(r)}
                      className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 rounded transition-colors text-xs"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onValidate(r)}
                      className="px-2 py-1 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 border border-slate-700 rounded transition-colors text-xs"
                      title="Validate"
                    >
                      Validate
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={11} className="px-6 py-10 text-center text-sm text-slate-400">
                  No pools found with current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PoolsPagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} />
    </Surface>
  );
}