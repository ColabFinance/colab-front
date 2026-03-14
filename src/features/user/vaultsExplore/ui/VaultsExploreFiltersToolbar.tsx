"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/presentation/components/Button";
import { ChainOption, DexOption, VaultSort, VaultsExploreView } from "../types";
import { VaultsExploreFilters } from "../hooks";
import { GridIcon, ListIcon } from "./icons";

export function VaultsExploreFiltersToolbar({
  filters,
  setFilters,
  resetFilters,
  chainOptions,
  dexOptions,
}: {
  filters: VaultsExploreFilters;
  setFilters: (patch: Partial<VaultsExploreFilters>) => void;
  resetFilters: () => void;
  chainOptions: ChainOption[];
  dexOptions: DexOption[];
}) {
  return (
    <div className="p-4 border-b border-slate-700 bg-slate-950/30">
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 md:gap-3 items-center w-full xl:w-auto">
          <select
            value={filters.chainId}
            onChange={(e) => setFilters({ chainId: e.target.value })}
            className="appearance-none bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] md:text-xs font-medium py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {chainOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={filters.dexId}
            onChange={(e) => setFilters({ dexId: e.target.value })}
            className="appearance-none bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] md:text-xs font-medium py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {dexOptions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value as VaultsExploreFilters["status"] })}
            className="appearance-none bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] md:text-xs font-medium py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="deprecated">Deprecated</option>
          </select>

          <select
            value={filters.ownership}
            onChange={(e) => setFilters({ ownership: e.target.value as VaultsExploreFilters["ownership"] })}
            className="appearance-none bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] md:text-xs font-medium py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Vaults</option>
            <option value="my">My Vaults</option>
          </select>

          <select
            value={filters.gaugeFilter}
            onChange={(e) => setFilters({ gaugeFilter: e.target.value as VaultsExploreFilters["gaugeFilter"] })}
            className="appearance-none bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] md:text-xs font-medium py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">Gauge Filter</option>
            <option value="has_gauge">Has Gauge</option>
            <option value="no_gauge">No Gauge</option>
          </select>

          <select
            value={filters.rangeStatus}
            onChange={(e) => setFilters({ rangeStatus: e.target.value as VaultsExploreFilters["rangeStatus"] })}
            className="appearance-none bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] md:text-xs font-medium py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">Range Status</option>
            <option value="inside">Inside</option>
            <option value="below">Below</option>
            <option value="above">Above</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-end border-t xl:border-t-0 border-slate-800 pt-3 xl:pt-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort by:</span>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ sort: e.target.value as VaultSort })}
              className="appearance-none bg-slate-950 border border-slate-700 text-slate-300 text-[10px] md:text-xs font-medium py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="tvl_desc">TVL (High to Low)</option>
              <option value="tvl_asc">TVL (Low to High)</option>
              <option value="apy_desc">APY (High to Low)</option>
              <option value="apy_asc">APY (Low to High)</option>
            </select>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={() => setFilters({ view: "list" })}
              className={cn(
                "p-1.5 rounded transition-colors",
                filters.view === "list"
                  ? "bg-slate-800 text-cyan-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              )}
              title="List View"
            >
              <ListIcon className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setFilters({ view: "grid" as VaultsExploreView })}
              className={cn(
                "p-1.5 rounded transition-colors",
                filters.view === "grid"
                  ? "bg-slate-800 text-cyan-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              )}
              title="Grid View"
            >
              <GridIcon className="h-4 w-4" />
            </button>
          </div>

          <Button variant="ghost" onClick={resetFilters} className="px-3 py-2 text-xs">
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}