"use client";

import type { Dispatch, SetStateAction } from "react";
import type { ChainOption, DexRegistryFilters } from "../types";

type Props = {
  chainOptions: ChainOption[];
  filters: DexRegistryFilters;
  onChange: Dispatch<SetStateAction<DexRegistryFilters>>;
  onReset: () => void;
  disabled?: boolean;
};

export default function DexFiltersPanel({
  chainOptions,
  filters,
  onChange,
  onReset,
  disabled = false,
}: Props) {
  return (
    <div className="lg:col-span-3 rounded-xl border border-slate-700 bg-slate-900 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Chain
          </label>
          <select
            value={filters.chain}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                chain: e.target.value as DexRegistryFilters["chain"],
              }))
            }
            disabled={disabled}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500 disabled:opacity-60"
          >
            {chainOptions.map((chain) => (
              <option key={chain.key} value={chain.key}>
                {chain.name} ({chain.key})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Search
          </label>
          <input
            value={filters.keyQuery}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                keyQuery: e.target.value,
              }))
            }
            disabled={disabled}
            placeholder="Search by dex, router or pool..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 disabled:opacity-60"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Status
          </label>
          <div className="flex gap-2">
            <select
              value={filters.status}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  status: e.target.value as DexRegistryFilters["status"],
                }))
              }
              disabled={disabled}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500 disabled:opacity-60"
            >
              <option value="all">All</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>

            <button
              onClick={onReset}
              disabled={disabled}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-60"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}