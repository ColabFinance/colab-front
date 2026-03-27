"use client";

import { useMemo, useState } from "react";
import { MOCK_ALLOCATION, MOCK_KPIS, MOCK_POSITIONS_ACTIVE, MOCK_POSITIONS_HISTORY } from "./mock";
import { AllocationSlice, PortfolioKpis, PortfolioPosition, PortfolioTab } from "./types";

export type PortfolioFilters = {
  tab: PortfolioTab;
  query: string;
};

export function usePortfolio(): {
  filters: PortfolioFilters;
  setFilters: React.Dispatch<React.SetStateAction<PortfolioFilters>>;

  kpis: PortfolioKpis;
  allocation: AllocationSlice[];

  allPositions: PortfolioPosition[];
  positions: PortfolioPosition[];
} {
  const [filters, setFilters] = useState<PortfolioFilters>({
    tab: "active",
    query: "",
  });

  const kpis = useMemo(() => MOCK_KPIS, []);
  const allocation = useMemo(() => MOCK_ALLOCATION, []);

  const allPositions = useMemo(() => {
    return filters.tab === "history" ? MOCK_POSITIONS_HISTORY : MOCK_POSITIONS_ACTIVE;
  }, [filters.tab]);

  const positions = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    if (!q) return allPositions;

    return allPositions.filter((p) => {
      const hay = `${p.vaultName} ${p.pairLabel} ${p.status} ${p.risk}`.toLowerCase();
      return hay.includes(q);
    });
  }, [allPositions, filters.query]);

  return {
    filters,
    setFilters,
    kpis,
    allocation,
    allPositions,
    positions,
  };
}