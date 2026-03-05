"use client";

import { useMemo, useState } from "react";
import { CHAINS, DEXES, MOCK_VAULTS } from "./mock";
import { VaultExploreItem, VaultSort, VaultsExploreView } from "./types";

export type VaultsExploreFilters = {
  chainId: string | "all";
  dexId: string | "all";
  pairType: "all" | "stable" | "volatile";
  status: "all" | "active" | "paused" | "deprecated";
  query: string;
  sort: VaultSort;
  view: VaultsExploreView;
};

function sortItems(items: VaultExploreItem[], sort: VaultSort) {
  const arr = [...items];
  arr.sort((a, b) => {
    if (sort === "tvl_desc") return b.tvlUsd - a.tvlUsd;
    if (sort === "tvl_asc") return a.tvlUsd - b.tvlUsd;
    if (sort === "apy_desc") return b.apyPct - a.apyPct;
    if (sort === "apy_asc") return a.apyPct - b.apyPct;
    return 0;
  });
  return arr;
}

export function useVaultsExplore() {
  const [filters, setFilters] = useState<VaultsExploreFilters>({
    chainId: "all",
    dexId: "all",
    pairType: "all",
    status: "active",
    query: "",
    sort: "tvl_desc",
    view: "list",
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const data = useMemo(() => MOCK_VAULTS, []);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    return data.filter((v) => {
      if (filters.chainId !== "all" && v.chainId !== filters.chainId) return false;
      if (filters.dexId !== "all" && v.dexId !== filters.dexId) return false;

      if (filters.pairType !== "all" && v.pairType !== filters.pairType) return false;
      if (filters.status !== "all" && v.status !== filters.status) return false;

      if (!q) return true;

      const hay = `${v.name} ${v.address} ${v.token0Symbol} ${v.token1Symbol} ${v.chainName} ${v.dexName}`.toLowerCase();
      return hay.includes(q);
    });
  }, [data, filters]);

  const sorted = useMemo(() => sortItems(filtered, filters.sort), [filtered, filters.sort]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageItems = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;
    const end = start + pageSize;
    return sorted.slice(start, end);
  }, [sorted, page, totalPages]);

  const rangeLabel = useMemo(() => {
    if (total === 0) return { from: 0, to: 0, total: 0 };
    const safePage = Math.min(Math.max(1, page), totalPages);
    const from = (safePage - 1) * pageSize + 1;
    const to = Math.min(total, safePage * pageSize);
    return { from, to, total };
  }, [page, pageSize, total, totalPages]);

  const chainOptions = useMemo(() => CHAINS, []);
  const dexOptions = useMemo(() => DEXES, []);

  function resetFilters() {
    setFilters({
      chainId: "all",
      dexId: "all",
      pairType: "all",
      status: "active",
      query: "",
      sort: "tvl_desc",
      view: "list",
    });
    setPage(1);
  }

  function updateFilters(patch: Partial<VaultsExploreFilters>) {
    setFilters((cur) => ({ ...cur, ...patch }));
    setPage(1);
  }

  function toggleFavoriteLocal(id: string) {
    // mock-only placeholder; real update later via API
    void id;
  }

  return {
    filters,
    setFilters: updateFilters,
    resetFilters,

    chainOptions,
    dexOptions,

    data,
    filtered,
    sorted,

    page,
    setPage,
    pageSize,
    total,
    totalPages,
    pageItems,
    rangeLabel,

    toggleFavoriteLocal,
  };
}