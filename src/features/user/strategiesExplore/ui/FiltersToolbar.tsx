"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { StrategiesExploreSort, StrategyChain, StrategyStatus } from "../types";

export function FiltersToolbar({
  query,
  status,
  chain,
  sort,
  statusOptions,
  chainOptions,
  onQuery,
  onStatus,
  onChain,
  onSort,
  onReset,
}: {
  query: string;
  status: StrategyStatus | "all";
  chain: StrategyChain | "all";
  sort: StrategiesExploreSort;

  statusOptions: { value: StrategyStatus | "all"; label: string }[];
  chainOptions: { value: StrategyChain | "all"; label: string }[];

  onQuery: (v: string) => void;
  onStatus: (v: StrategyStatus | "all") => void;
  onChain: (v: StrategyChain | "all") => void;
  onSort: (v: StrategiesExploreSort) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
        <div className="relative w-full sm:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">⌕</span>
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search by name or symbol..."
            className={cn(
              "w-full rounded-lg border border-slate-700 bg-slate-950 text-slate-200",
              "pl-8 pr-3 py-2 text-sm outline-none",
              "focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-600"
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
          <select
            value={status}
            onChange={(e) => onStatus(e.target.value as StrategyStatus | "all")}
            className="rounded-lg border border-slate-700 bg-slate-950 text-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={chain}
            onChange={(e) => onChain(e.target.value as StrategyChain | "all")}
            className="rounded-lg border border-slate-700 bg-slate-950 text-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          >
            {chainOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between lg:justify-end gap-3 border-t border-slate-800 lg:border-t-0 pt-3 lg:pt-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Sort:</span>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as StrategiesExploreSort)}
            className="rounded-lg border border-slate-700 bg-slate-950 text-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          >
            <option value="updated_desc">Updated</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4"
        >
          Reset
        </button>
      </div>
    </div>
  );
}