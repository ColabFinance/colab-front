"use client";

import { useMemo, useState } from "react";
import { CHAIN_OPTIONS, MOCK_STRATEGIES, STATUS_OPTIONS } from "./mock";
import { StrategiesExploreItem, StrategiesExploreSort, StrategyChain, StrategyStatus } from "./types";

export type StrategiesExploreFilters = {
  query: string;
  status: StrategyStatus | "all";
  chain: StrategyChain | "all";
  sort: StrategiesExploreSort;
};

const PAGE_SIZE = 10;

function safeLower(value: string) {
  return value.trim().toLowerCase();
}

export function useStrategiesExplore() {
  const [filters, setFilters] = useState<StrategiesExploreFilters>({
    query: "",
    status: "all",
    chain: "all",
    sort: "updated_desc",
  });

  const [page, setPage] = useState(1);

  const data = useMemo(() => {
    // Explore must show only public strategies
    return MOCK_STRATEGIES.filter((item) => item.isPublic);
  }, []);

  const filtered = useMemo(() => {
    const q = safeLower(filters.query);

    return data.filter((item) => {
      if (filters.status !== "all" && item.status !== filters.status) return false;
      if (filters.chain !== "all" && item.chain !== filters.chain) return false;

      if (!q) return true;

      const haystack = [
        item.strategyIdLabel,
        item.name,
        item.code,
        item.indicatorSetName,
        item.indicatorSetCode,
        item.chain,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [data, filters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];

    arr.sort((a, b) => {
      switch (filters.sort) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "updated_desc":
        default:
          return 0;
      }
    });

    return arr;
  }, [filtered, filters.sort]);

  const total = sorted.length;

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  const clampedPage = Math.min(Math.max(1, page), totalPages);

  const pageItems = useMemo(() => {
    const start = (clampedPage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, clampedPage]);

  const rangeLabel = useMemo(() => {
    if (total === 0) return "0-0";
    const start = (clampedPage - 1) * PAGE_SIZE + 1;
    const end = Math.min(total, clampedPage * PAGE_SIZE);
    return `${start}-${end}`;
  }, [clampedPage, total]);

  const stats = useMemo(() => {
    const totalStrategies = data.length;
    const activeStrategies = data.filter((item) => item.status === "active").length;
    const inactiveStrategies = data.filter((item) => item.status === "inactive").length;
    const linkedVaults = data.filter((item) => item.linkedVault).length;

    return {
      totalStrategies,
      activeStrategies,
      inactiveStrategies,
      linkedVaults,
    };
  }, [data]);

  function reset() {
    setFilters({
      query: "",
      status: "all",
      chain: "all",
      sort: "updated_desc",
    });
    setPage(1);
  }

  function setQuery(query: string) {
    setFilters((prev) => ({ ...prev, query }));
    setPage(1);
  }

  function setStatus(status: StrategyStatus | "all") {
    setFilters((prev) => ({ ...prev, status }));
    setPage(1);
  }

  function setChain(chain: StrategyChain | "all") {
    setFilters((prev) => ({ ...prev, chain }));
    setPage(1);
  }

  function setSort(sort: StrategiesExploreSort) {
    setFilters((prev) => ({ ...prev, sort }));
    setPage(1);
  }

  function nextPage() {
    setPage((prev) => Math.min(totalPages, prev + 1));
  }

  function prevPage() {
    setPage((prev) => Math.max(1, prev - 1));
  }

  return {
    data,
    stats,

    filters,
    statusOptions: STATUS_OPTIONS,
    chainOptions: CHAIN_OPTIONS,

    filtered,
    sorted,
    pageItems,

    page: clampedPage,
    total,
    totalPages,
    rangeLabel,

    setQuery,
    setStatus,
    setChain,
    setSort,
    reset,

    nextPage,
    prevPage,
  };
}

export function chainLabel(chain: StrategyChain) {
  switch (chain) {
    case "ethereum":
      return "Ethereum";
    case "base":
      return "Base";
    case "arbitrum":
      return "Arbitrum";
    case "polygon":
      return "Polygon";
    case "optimism":
      return "Optimism";
    default:
      return chain;
  }
}

export function statusLabel(status: StrategyStatus) {
  return status === "active" ? "ACTIVE" : "INACTIVE";
}

export function computeMonogram(item: StrategiesExploreItem) {
  const raw = (item.code || item.name).replace(/[^a-zA-Z0-9]/g, "");
  return raw.slice(0, 2).toUpperCase();
}

export function monogramTone(item: StrategiesExploreItem) {
  if (item.status === "inactive") {
    return "from-slate-600 to-slate-500";
  }

  switch (item.chain) {
    case "ethereum":
      return "from-blue-600 to-cyan-500";
    case "base":
      return "from-indigo-600 to-blue-500";
    case "arbitrum":
      return "from-cyan-600 to-sky-500";
    case "polygon":
      return "from-purple-600 to-fuchsia-500";
    case "optimism":
      return "from-orange-600 to-red-500";
    default:
      return "from-blue-600 to-cyan-500";
  }
}