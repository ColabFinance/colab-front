"use client";

import { ChainOption } from "../types";
import { DexRegistryFilters } from "../hooks";

type Props = {
  chainOptions: readonly ChainOption[];
  filters: DexRegistryFilters;
  onChange: (next: DexRegistryFilters) => void;
  onReset: () => void;
};

export default function DexFiltersPanel({ chainOptions, filters, onChange, onReset }: Props) {
  return (
    <div className="lg:col-span-3 rounded-xl border border-slate-700 bg-slate-900 p-4 grid grid-cols-1 sm:grid-cols-3 md:flex md:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
          Chain
        </label>
        <select
          value={filters.chainId}
          onChange={(e) =>
            onChange({
              ...filters,
              chainId: e.target.value === "all" ? "all" : Number(e.target.value),
            })
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none"
        >
          {chainOptions.map((c) => (
            <option key={c.chainId} value={c.chainId}>
              {c.name}
            </option>
          ))}
          <option value="all">All</option>
        </select>
      </div>

      <div className="flex-1 w-full">
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
          DEX Key
        </label>
        <input
          value={filters.keyQuery}
          onChange={(e) => onChange({ ...filters, keyQuery: e.target.value })}
          placeholder="e.g. uniswap_v3"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none placeholder-slate-600"
        />
      </div>

      <div className="flex-1 w-full">
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value as DexRegistryFilters["status"] })}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      <button
        onClick={onReset}
        className="w-full md:w-auto rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
      >
        Reset
      </button>
    </div>
  );
}