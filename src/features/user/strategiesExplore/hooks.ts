"use client";

import { useMemo, useState } from "react";
import { MOCK_STRATEGIES, RISK_OPTIONS, TYPE_OPTIONS } from "./mock";
import { StrategiesExploreItem, StrategiesExploreSort, StrategyRisk, StrategyType } from "./types";

export type StrategiesExploreFilters = {
  query: string;
  risk: StrategyRisk | "all";
  type: StrategyType | "all";
  sort: StrategiesExploreSort;
};

const PAGE_SIZE = 10;

function safeLower(s: string) {
  return s.trim().toLowerCase();
}

export function useStrategiesExplore() {
  const [filters, setFilters] = useState<StrategiesExploreFilters>({
    query: "",
    risk: "all",
    type: "all",
    sort: "tvl_desc",
  });

  const [page, setPage] = useState(1);

  const data = useMemo(() => MOCK_STRATEGIES, []);

  const filtered = useMemo(() => {
    const q = safeLower(filters.query);

    return data.filter((d) => {
      if (filters.risk !== "all" && d.risk !== filters.risk) return false;
      if (filters.type !== "all" && d.type !== filters.type) return false;

      if (!q) return true;

      const hay = `${d.name} ${d.code} ${d.description} ${d.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [data, filters.query, filters.risk, filters.type]);

  const sorted = useMemo(() => {
    const arr = [...filtered];

    arr.sort((a, b) => {
      switch (filters.sort) {
        case "apy_desc":
          return b.apyPct - a.apyPct;
        case "apr_desc":
          return b.aprPct - a.aprPct;
        case "vaults_desc":
          return b.vaults - a.vaults;
        case "tvl_desc":
        default:
          return b.tvlUsd - a.tvlUsd;
      }
    });

    return arr;
  }, [filtered, filters.sort]);

  const total = sorted.length;

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }, [total]);

  const clampedPage = Math.min(Math.max(1, page), totalPages);

  const pageItems = useMemo(() => {
    const start = (clampedPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return sorted.slice(start, end);
  }, [sorted, clampedPage]);

  const rangeLabel = useMemo(() => {
    if (total === 0) return "0-0";
    const start = (clampedPage - 1) * PAGE_SIZE + 1;
    const end = Math.min(total, clampedPage * PAGE_SIZE);
    return `${start}-${end}`;
  }, [clampedPage, total]);

  // stats (based on full dataset, not filtered)
  const stats = useMemo(() => {
    const totalStrategies = data.length;
    const activeVaults = data.reduce((acc, d) => acc + d.vaults, 0);
    const avgApy =
      data.length === 0 ? 0 : data.reduce((acc, d) => acc + d.apyPct, 0) / data.length;

    return {
      totalStrategies,
      activeVaults,
      avgApy,
    };
  }, [data]);

  function reset() {
    setFilters({ query: "", risk: "all", type: "all", sort: "tvl_desc" });
    setPage(1);
  }

  function setQuery(query: string) {
    setFilters((p) => ({ ...p, query }));
    setPage(1);
  }

  function setRisk(risk: StrategyRisk | "all") {
    setFilters((p) => ({ ...p, risk }));
    setPage(1);
  }

  function setType(type: StrategyType | "all") {
    setFilters((p) => ({ ...p, type }));
    setPage(1);
  }

  function setSort(sort: StrategiesExploreSort) {
    setFilters((p) => ({ ...p, sort }));
    setPage(1);
  }

  function nextPage() {
    setPage((p) => Math.min(totalPages, p + 1));
  }

  function prevPage() {
    setPage((p) => Math.max(1, p - 1));
  }

  function goToPage(p: number) {
    setPage(() => Math.min(Math.max(1, p), totalPages));
  }

  return {
    data,
    stats,

    filters,
    riskOptions: RISK_OPTIONS,
    typeOptions: TYPE_OPTIONS,

    filtered,
    sorted,
    pageItems,

    page: clampedPage,
    total,
    totalPages,
    rangeLabel,

    setQuery,
    setRisk,
    setType,
    setSort,
    reset,

    nextPage,
    prevPage,
    goToPage,
  };
}

export function strategyRiskTone(risk: StrategyRisk) {
  if (risk === "low") return "green";
  if (risk === "medium") return "amber";
  return "red";
}

export function riskLabel(risk: StrategyRisk) {
  if (risk === "low") return "Low Risk";
  if (risk === "medium") return "Medium Risk";
  return "High Risk";
}

export function typeLabel(t: StrategyType) {
  switch (t) {
    case "delta_neutral":
      return "Delta neutral";
    case "momentum":
      return "Momentum";
    case "stable_compound":
      return "Stable compound";
    case "mean_reversion":
      return "Mean reversion";
    case "passive":
      return "Passive";
    case "custom":
    default:
      return "Custom";
  }
}

export function computeMonogram(d: StrategiesExploreItem) {
  const parts = d.code.split("-").filter(Boolean);
  const two = parts.slice(0, 2).join("");
  const raw = (two || d.code || d.name).replace(/[^a-zA-Z0-9]/g, "");
  return raw.slice(0, 2).toUpperCase();
}