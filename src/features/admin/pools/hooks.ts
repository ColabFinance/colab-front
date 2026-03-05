"use client";

import { useMemo, useState } from "react";
import { MOCK_POOLS } from "./mock";
import { DexPoolRow, PoolDraft, PoolsFilters } from "./types";

function formatRelative(d: Date) {
  const diffMs = Date.now() - d.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

const DEFAULT_FILTERS: PoolsFilters = {
  chain: "Ethereum",
  dexKey: "",
  tokenSymbol: "",
  feeTier: "",
  status: "all",
};

const DEFAULT_DRAFT: PoolDraft = {
  dexKey: "",
  poolAddress: "",
  token0Address: "",
  token1Address: "",
  feeTier: "500",
  tickSpacing: "",
  isStablePair: false,
  isActive: true,
};

export function usePoolsPage() {
  const [filters, setFilters] = useState<PoolsFilters>(DEFAULT_FILTERS);

  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const selectedCount = useMemo(
    () => Object.values(selectedIds).filter(Boolean).length,
    [selectedIds]
  );

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editingRow, setEditingRow] = useState<DexPoolRow | null>(null);
  const [draft, setDraft] = useState<PoolDraft>(DEFAULT_DRAFT);

  const allRows = useMemo(() => MOCK_POOLS, []);

  const filteredRows = useMemo(() => {
    const token = filters.tokenSymbol.trim().toUpperCase();

    return allRows.filter((r) => {
      if (filters.chain && r.chainName !== filters.chain) return false;

      if (filters.dexKey && r.dexKey !== filters.dexKey) return false;

      if (token) {
        const hit =
          r.token0Symbol.toUpperCase().includes(token) ||
          r.token1Symbol.toUpperCase().includes(token) ||
          r.poolAddressShort.toUpperCase().includes(token) ||
          r.dexKey.toUpperCase().includes(token);
        if (!hit) return false;
      }

      if (filters.feeTier) {
        const ft = Number(filters.feeTier);
        if (!Number.isNaN(ft) && r.feeTierBps !== ft) return false;
      }

      if (filters.status !== "all" && r.status !== filters.status) return false;

      return true;
    });
  }, [allRows, filters]);

  const total = filteredRows.length;

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredRows.slice(start, end);
  }, [filteredRows, page]);

  function toggleAllOnPage(checked: boolean) {
    const next = { ...selectedIds };
    for (const r of paginatedRows) next[r.id] = checked;
    setSelectedIds(next);
  }

  function toggleOne(id: string, checked: boolean) {
    setSelectedIds((prev) => ({ ...prev, [id]: checked }));
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  function applyFilters() {
    setPage(1);
  }

  function openCreate() {
    setDrawerMode("create");
    setEditingRow(null);
    setDraft(DEFAULT_DRAFT);
    setDrawerOpen(true);
  }

  function openEdit(row: DexPoolRow) {
    setDrawerMode("edit");
    setEditingRow(row);
    setDraft({
      dexKey: row.dexKey,
      poolAddress: row.poolAddressFull,
      token0Address: "",
      token1Address: "",
      feeTier: String(row.feeTierBps),
      tickSpacing: row.tickSpacing === "-" ? "" : row.tickSpacing,
      isStablePair: row.type === "STABLE",
      isActive: row.status === "active",
    });
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  function updateDraft(patch: Partial<PoolDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  return {
    filters,
    setFilters,
    resetFilters,
    applyFilters,

    rows: paginatedRows,
    total,
    page,
    pageSize,
    setPage,

    selectedIds,
    selectedCount,
    toggleAllOnPage,
    toggleOne,

    drawerOpen,
    drawerMode,
    editingRow,
    draft,
    openCreate,
    openEdit,
    closeDrawer,
    updateDraft,

    formatRelative,
  };
}