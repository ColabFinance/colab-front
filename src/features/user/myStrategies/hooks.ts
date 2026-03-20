"use client";

import { useMemo, useState } from "react";
import type {
  CreateStrategyDraft,
  EditParamsDraft,
  MyStrategyChain,
  MyStrategyRow,
  StrategyStatus,
  VaultLinkFilter,
} from "./types";
import { DEX_OPTIONS, MOCK_MY_STRATEGIES, POOL_OPTIONS } from "./mock";

function defaultCreateDraft(): CreateStrategyDraft {
  return {
    dexId: "",
    poolId: "",
    name: "",
    description: "",
    symbol: "",
    indicatorSource: "binance",
    emaFast: 10,
    emaSlow: 50,
    atrWindow: 20,
  };
}

function defaultEditDraft(row: MyStrategyRow): EditParamsDraft {
  return {
    status: row.status,
    indicatorSetId: row.indicatorSetId,
    symbol: row.symbol,

    indicatorSource: row.indicatorSource,
    emaFast: row.emaFast,
    emaSlow: row.emaSlow,
    atrWindow: row.atrWindow,

    skewLowPct: 0.3,
    skewHighPct: 0.7,
    eps: 0.0005,
    cooloffBars: 12,
    breakoutConfirmBars: 3,
    inrangeResizeMode: "skew_swap",

    gaugeEnabled: true,

    tiersJson: `{
  "tiers": [
    { "lower": -1000, "upper": -500, "allocation": 0.2 },
    { "lower": -500, "upper": 0, "allocation": 0.3 },
    { "lower": 0, "upper": 500, "allocation": 0.3 },
    { "lower": 500, "upper": 1000, "allocation": 0.2 }
  ]
}`,
  };
}

function safeLower(value: string) {
  return value.trim().toLowerCase();
}

export function useMyStrategies() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [selected, setSelected] = useState<MyStrategyRow | null>(null);

  const dexOptions = useMemo(() => DEX_OPTIONS, []);
  const poolOptions = useMemo(() => POOL_OPTIONS, []);
  const rows = useMemo(() => MOCK_MY_STRATEGIES, []);

  const [createDraft, setCreateDraft] = useState<CreateStrategyDraft>(defaultCreateDraft);
  const [editDraft, setEditDraft] = useState<EditParamsDraft | null>(null);

  const [filters, setFilters] = useState<{
    chain: MyStrategyChain | "all";
    status: StrategyStatus | "all";
    vaultLink: VaultLinkFilter;
    query: string;
  }>({
    chain: "all",
    status: "all",
    vaultLink: "all",
    query: "",
  });

  const chainOptions = useMemo(() => {
    const unique = Array.from(new Set(rows.map((row) => row.chainKey)));
    return [
      { value: "all" as const, label: "All Chains" },
      ...unique.map((chain) => ({
        value: chain,
        label: rows.find((row) => row.chainKey === chain)?.chainName || chain,
      })),
    ];
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = safeLower(filters.query);

    return rows.filter((row) => {
      if (filters.chain !== "all" && row.chainKey !== filters.chain) return false;
      if (filters.status !== "all" && row.status !== filters.status) return false;

      const linked = Boolean(row.vaultLabel);
      if (filters.vaultLink === "linked" && !linked) return false;
      if (filters.vaultLink === "not_linked" && linked) return false;

      if (!q) return true;

      const haystack = [
        row.id,
        row.name,
        row.symbol,
        row.indicatorSetId,
        row.poolPairLabel,
        row.dexName,
        row.chainName,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [rows, filters]);

  const hasRows = rows.length > 0;
  const hasFilteredRows = filteredRows.length > 0;

  const stats = useMemo(() => {
    const totalStrategies = rows.length;
    const activeStrategies = rows.filter((row) => row.status === "ACTIVE").length;
    const inactiveStrategies = rows.filter((row) => row.status === "INACTIVE").length;
    const linkedVaults = rows.filter((row) => Boolean(row.vaultLabel)).length;

    return {
      totalStrategies,
      activeStrategies,
      inactiveStrategies,
      linkedVaults,
    };
  }, [rows]);

  function openCreate() {
    setCreateDraft(defaultCreateDraft());
    setCreateOpen(true);
  }

  function closeCreate() {
    setCreateOpen(false);
  }

  function confirmCreate() {
    setCreateOpen(false);
  }

  function openEdit(row: MyStrategyRow) {
    setSelected(row);
    setEditDraft(defaultEditDraft(row));
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
  }

  function saveParams() {
    setEditOpen(false);
  }

  function refresh() {
    // placeholder
  }

  function setChainFilter(chain: MyStrategyChain | "all") {
    setFilters((prev) => ({ ...prev, chain }));
  }

  function setStatusFilter(status: StrategyStatus | "all") {
    setFilters((prev) => ({ ...prev, status }));
  }

  function setVaultLinkFilter(vaultLink: VaultLinkFilter) {
    setFilters((prev) => ({ ...prev, vaultLink }));
  }

  function setQueryFilter(query: string) {
    setFilters((prev) => ({ ...prev, query }));
  }

  function resetFilters() {
    setFilters({
      chain: "all",
      status: "all",
      vaultLink: "all",
      query: "",
    });
  }

  return {
    dexOptions,
    poolOptions,

    rows,
    filteredRows,
    hasRows,
    hasFilteredRows,

    stats,
    filters,
    chainOptions,

    setChainFilter,
    setStatusFilter,
    setVaultLinkFilter,
    setQueryFilter,
    resetFilters,

    createOpen,
    openCreate,
    closeCreate,
    createDraft,
    setCreateDraft,
    confirmCreate,

    editOpen,
    selected,
    openEdit,
    closeEdit,
    editDraft,
    setEditDraft,
    saveParams,

    refresh,
  };
}