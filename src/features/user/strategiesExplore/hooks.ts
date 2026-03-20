"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { listStrategiesExploreUseCase } from "@/core/usecases/user/strategies/listStrategiesExplore.usecase";
import { StrategiesExploreItem, StrategiesExploreSort, StrategyChain, StrategyStatus } from "./types";

export type StrategiesExploreFilters = {
  query: string;
  status: StrategyStatus | "all";
  chain: StrategyChain | "all";
  sort: StrategiesExploreSort;
};

const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: StrategyStatus | "all"; label: string }[] = [
  { value: "all", label: "All status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const CHAIN_OPTIONS: { value: StrategyChain | "all"; label: string }[] = [
  { value: "all", label: "All chains" },
  { value: "base", label: "Base" },
  { value: "bnb", label: "BNB" },
];

function safeLower(value: string) {
  return value.trim().toLowerCase();
}

function relativeTimeLabel(updatedAtIso?: string | null, updatedAt?: number | null) {
  let date: Date | null = null;

  if (updatedAtIso) {
    const parsed = new Date(updatedAtIso);
    if (!Number.isNaN(parsed.getTime())) {
      date = parsed;
    }
  }

  if (!date && typeof updatedAt === "number" && updatedAt > 0) {
    const parsed = new Date(updatedAt * 1000);
    if (!Number.isNaN(parsed.getTime())) {
      date = parsed;
    }
  }

  if (!date) {
    return "-";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks}w ago`;
}

export function useStrategiesExplore() {
  const [filters, setFilters] = useState<StrategiesExploreFilters>({
    query: "",
    status: "all",
    chain: "all",
    sort: "updated_desc",
  });

  const [page, setPage] = useState(1);
  const [data, setData] = useState<StrategiesExploreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const rows = await listStrategiesExploreUseCase({
        query: {
          limit: 500,
          offset: 0,
        },
      });

      const mapped: StrategiesExploreItem[] = rows.map((row) => ({
        id: row.id,
        strategyId: row.strategyId,
        strategyIdLabel: `#${row.strategyId}`,
        name: row.name || `Strategy ${row.strategyId}`,
        code: row.symbol || "-",
        indicatorSetName: row.indicatorSetId || "-",
        indicatorSetCode: row.indicatorSetId || null,
        chain: row.chain,
        status: row.status === "ACTIVE" ? "active" : "inactive",
        linkedVault: Boolean(row.alias),
        linkedVaultLabel: row.alias || undefined,
        updatedAtLabel: relativeTimeLabel(row.updatedAtIso, row.updatedAt),
        isPublic: row.isPublic,
      }));

      setData(mapped);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load strategies.";
      setError(message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = safeLower(filters.query);

    return data.filter((item) => {
      if (!item.isPublic) return false;
      if (filters.status !== "all" && item.status !== filters.status) return false;
      if (filters.chain !== "all" && item.chain !== filters.chain) return false;

      if (!q) return true;

      const haystack = [
        item.strategyIdLabel,
        item.name,
        item.code,
        item.indicatorSetName,
        item.indicatorSetCode || "",
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
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
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
    loading,
    error,
    refresh,
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
  if (chain === "base") return "Base";
  return "BNB";
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

  if (item.chain === "bnb") {
    return "from-orange-600 to-yellow-500";
  }

  return "from-blue-600 to-cyan-500";
}