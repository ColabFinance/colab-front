"use client";

import React from "react";
import { Button } from "@/presentation/components/Button";
import { Surface, SurfaceBody, SurfaceFooter, SurfaceHeader } from "@/presentation/components/Surface";
import { useStrategiesExplore } from "./hooks";
import { FiltersToolbar } from "./ui/FiltersToolbar";
import { InfoBlock } from "./ui/InfoBlock";
import { StatsRow } from "./ui/StatsRow";
import { StrategiesTable } from "./ui/StrategiesTable";

export default function StrategiesExplorePage() {
  const s = useStrategiesExplore();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2">
            Explore Strategies
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl">
            Discover your accessible public strategies, inspect configurations, and open strategy details.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto justify-center">
            Refresh
          </Button>
        </div>
      </div>

      <StatsRow
        totalStrategies={s.stats.totalStrategies}
        activeStrategies={s.stats.activeStrategies}
        inactiveStrategies={s.stats.inactiveStrategies}
        linkedVaults={s.stats.linkedVaults}
      />

      <Surface variant="table">
        <SurfaceHeader className="bg-slate-950/40">
          <FiltersToolbar
            query={s.filters.query}
            status={s.filters.status}
            chain={s.filters.chain}
            sort={s.filters.sort}
            statusOptions={s.statusOptions}
            chainOptions={s.chainOptions}
            onQuery={s.setQuery}
            onStatus={s.setStatus}
            onChain={s.setChain}
            onSort={s.setSort}
            onReset={s.reset}
          />
        </SurfaceHeader>

        <SurfaceBody className="p-0">
          <StrategiesTable items={s.pageItems} />
        </SurfaceBody>

        <SurfaceFooter className="bg-slate-950/30 flex justify-between items-center">
          <div className="text-xs text-slate-500">
            Showing <span className="text-white font-medium">{s.rangeLabel}</span> of{" "}
            <span className="text-white font-medium">{s.total}</span> strategies
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={s.prevPage}
              disabled={s.page <= 1}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-slate-400 text-xs hover:text-white hover:border-slate-500 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={s.nextPage}
              disabled={s.page >= s.totalPages}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-slate-200 text-xs hover:text-white hover:border-slate-500 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </SurfaceFooter>
      </Surface>

      <InfoBlock />
    </div>
  );
}