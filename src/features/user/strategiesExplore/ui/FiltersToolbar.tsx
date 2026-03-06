"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { StrategiesExploreSort, StrategyRisk, StrategyType } from "../types";

export function FiltersToolbar({
  query,
  risk,
  type,
  sort,
  riskOptions,
  typeOptions,
  onQuery,
  onRisk,
  onType,
  onSort,
  onReset,
}: {
  query: string;
  risk: StrategyRisk | "all";
  type: StrategyType | "all";
  sort: StrategiesExploreSort;

  riskOptions: { value: StrategyRisk | "all"; label: string }[];
  typeOptions: { value: StrategyType | "all"; label: string }[];

  onQuery: (v: string) => void;
  onRisk: (v: StrategyRisk | "all") => void;
  onType: (v: StrategyType | "all") => void;
  onSort: (v: StrategiesExploreSort) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
      <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
        <div className="relative w-full sm:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">⌕</span>
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Filter by name or tag..."
            className={cn(
              "w-full rounded-lg border border-slate-700 bg-slate-950 text-slate-200",
              "pl-8 pr-3 py-2 text-sm outline-none",
              "focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-600"
            )}
          />
        </div>

        <div className="grid grid-cols-2 sm:flex gap-2">
          <select
            value={risk}
            onChange={(e) => onRisk(e.target.value as StrategyRisk | "all")}
            className="rounded-lg border border-slate-700 bg-slate-950 text-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          >
            {riskOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => onType(e.target.value as StrategyType | "all")}
            className="rounded-lg border border-slate-700 bg-slate-950 text-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          >
            {typeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
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
            <option value="tvl_desc">TVL (desc)</option>
            <option value="apy_desc">APY (desc)</option>
            <option value="apr_desc">APR (desc)</option>
            <option value="vaults_desc">Vaults (desc)</option>
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