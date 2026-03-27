"use client";

import React from "react";
import { Button } from "@/presentation/components/Button";
import { Icon } from "@/presentation/icons/Icon";
import { usePortfolio } from "./hooks";
import { KpiGrid } from "./ui/KpiGrid";
import { PositionsTable } from "./ui/PositionsTable";
import { AllocationCard } from "./ui/AllocationCard";

export default function PortfolioPage() {
  const { filters, setFilters, kpis, allocation, positions } = usePortfolio();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Portfolio
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Track your active positions and performance.
          </p>
        </div>

        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 md:gap-3">
          <Button
            variant="secondary"
            className="w-full xs:w-auto justify-center"
            leftIcon={<Icon name="external" className="text-slate-400" />}
            onClick={() => {
              // mock placeholder
            }}
          >
            Export
          </Button>

          <Button
            variant="primary"
            className="w-full xs:w-auto justify-center"
            leftIcon={<Icon name="atlas" className="text-white" />}
            href="/vaults"
          >
            Explore
          </Button>
        </div>
      </div>

      <KpiGrid kpis={kpis} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 min-w-0">
          <PositionsTable
            tab={filters.tab}
            onTabChange={(t) => setFilters((s) => ({ ...s, tab: t }))}
            query={filters.query}
            onQueryChange={(q) => setFilters((s) => ({ ...s, query: q }))}
            positions={positions}
          />
        </div>

        <div className="xl:col-span-1">
          <AllocationCard kpis={kpis} allocation={allocation} />
        </div>
      </div>
    </div>
  );
}