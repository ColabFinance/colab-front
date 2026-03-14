"use client";

import { useMemo, useState } from "react";
import { CHAINS, DEXES, MOCK_VAULTS } from "./mock";
import {
  VaultExploreItem,
  VaultGaugeFilter,
  VaultOwnershipFilter,
  VaultRangeStatus,
  VaultSort,
  VaultsExploreView,
} from "./types";

export type VaultsExploreFilters = {
  chainId: string | "all";
  dexId: string | "all";
  status: "all" | "active" | "paused" | "deprecated";
  ownership: VaultOwnershipFilter;
  gaugeFilter: VaultGaugeFilter;
  rangeStatus: "all" | VaultRangeStatus;
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
  const [data, setData] = useState<VaultExploreItem[]>(MOCK_VAULTS);

  const [filters, setFilters] = useState<VaultsExploreFilters>({
    chainId: "all",
    dexId: "all",
    status: "active",
    ownership: "all",
    gaugeFilter: "all",
    rangeStatus: "all",
    query: "",
    sort: "tvl_desc",
    view: "list",
  });

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    return data.filter((v) => {
      if (filters.chainId !== "all" && v.chainId !== filters.chainId) return false;
      if (filters.dexId !== "all" && v.dexId !== filters.dexId) return false;
      if (filters.status !== "all" && v.status !== filters.status) return false;
      if (filters.ownership === "my" && !v.isMine) return false;
      if (filters.gaugeFilter === "has_gauge" && !v.hasGauge) return false;
      if (filters.gaugeFilter === "no_gauge" && v.hasGauge) return false;
      if (filters.rangeStatus !== "all" && v.rangeStatus !== filters.rangeStatus) return false;

      if (!q) return true;

      const hay =
        `${v.name} ${v.address} ${v.token0Symbol} ${v.token1Symbol} ${v.chainName} ${v.dexName} ${v.feeTierLabel}`.toLowerCase();

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
  }, [page, total, totalPages]);

  const chainOptions = useMemo(() => CHAINS, []);
  const dexOptions = useMemo(() => DEXES, []);

  const overview = useMemo(() => {
    return {
      totalVaults: data.length,
      activeVaults: data.filter((v) => v.status === "active").length,
      myVaults: data.filter((v) => v.isMine).length,
      chains: new Set(data.map((v) => v.chainId)).size,
      dexes: new Set(data.map((v) => v.dexId)).size,
      inRange: data.filter((v) => v.rangeStatus === "inside").length,
      outOfRange: data.filter((v) => v.rangeStatus !== "inside").length,
    };
  }, [data]);

  const myVaultsSnapshot = useMemo(() => {
    return [...data]
      .filter((v) => v.isMine)
      .sort((a, b) => (b.myPositionUsd ?? 0) - (a.myPositionUsd ?? 0))
      .slice(0, 3);
  }, [data]);

  function resetFilters() {
    setFilters({
      chainId: "all",
      dexId: "all",
      status: "active",
      ownership: "all",
      gaugeFilter: "all",
      rangeStatus: "all",
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
    setData((cur) =>
      cur.map((item) =>
        item.id === id ? { ...item, favorited: !item.favorited } : item
      )
    );
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

    overview,
    myVaultsSnapshot,

    toggleFavoriteLocal,
  };
}