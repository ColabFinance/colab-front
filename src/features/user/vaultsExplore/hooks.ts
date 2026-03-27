"use client";

import { useEffect, useMemo, useState } from "react";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import type { VaultExploreApiItem } from "@/core/infra/api/api-lp/vaultExplore";
import {
  VaultExploreItem,
  VaultGaugeFilter,
  VaultOwnershipFilter,
  VaultRangeStatus,
  VaultSort,
  VaultsExploreView,
  ChainOption,
  DexOption,
} from "./types";
import { listVaultsExploreUseCase } from "@/core/usecases/user/vaults/listVaultsExplore.usecase";

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

const CHAIN_LABELS: Record<string, string> = {
  base: "Base",
  ethereum: "Ethereum",
  polygon: "Polygon",
  arbitrum: "Arbitrum",
  optimism: "Optimism",
  bnb: "BNB Chain",
};

const DEX_LABELS: Record<string, string> = {
  uniswap_v3: "Uniswap V3",
  pancakeswap_v3: "PancakeSwap V3",
  pancake_v3: "PancakeSwap V3",
  aerodrome: "Aerodrome",
  curve: "Curve",
  quickswap: "QuickSwap",
  velodrome: "Velodrome",
};

function buildChainName(chainId: string) {
  return CHAIN_LABELS[chainId] ?? chainId;
}

function buildDexName(dexId: string) {
  return DEX_LABELS[dexId] ?? dexId;
}

function formatFeeTierLabel(feeBps?: string | null) {
  if (!feeBps) return null;

  const parsed = Number(feeBps);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;

  const text = (parsed / 10_000).toFixed(2).replace(/\.?0+$/, "");
  return `${text}%`;
}

function buildDisplayName(item: VaultExploreApiItem) {
  if (item.name?.trim()) return item.name.trim();

  const token0 = item.token0_symbol?.trim() || "TOKEN0";
  const token1 = item.token1_symbol?.trim() || "TOKEN1";
  const fee = formatFeeTierLabel(item.fee_bps);

  return fee ? `${token0}-${token1} ${fee}` : `${token0}-${token1}`;
}

function toUiItem(item: VaultExploreApiItem): VaultExploreItem {
  return {
    id: item.id || item.alias || item.address,
    name: buildDisplayName(item),
    address: item.address,

    token0Symbol: item.token0_symbol || "T0",
    token1Symbol: item.token1_symbol || "T1",
    feeTierLabel: formatFeeTierLabel(item.fee_bps),

    pairType: item.pair_type || "volatile",

    chainId: item.chain,
    chainName: buildChainName(item.chain),

    dexId: item.dex,
    dexName: buildDexName(item.dex),

    tvlUsd: item.tvl_usd ?? null,
    tvlChange24hPct: item.tvl_change_24h_pct ?? null,

    apyPct: item.apy_pct ?? null,
    aprPct: item.apr_pct ?? null,

    status: item.status ?? (item.is_active ? "active" : "paused"),
    rangeStatus: item.range_status ?? null,

    hasGauge: Boolean(item.has_gauge),
    isMine: Boolean(item.is_mine),
    myPositionUsd: item.my_position_usd ?? null,

    favorited: false,
  };
}

function sortItems(items: VaultExploreItem[], sort: VaultSort) {
  const arr = [...items];

  const num = (value: number | null | undefined, fallback: number) =>
    typeof value === "number" ? value : fallback;

  arr.sort((a, b) => {
    if (sort === "tvl_desc") return num(b.tvlUsd, -1) - num(a.tvlUsd, -1);
    if (sort === "tvl_asc") return num(a.tvlUsd, Number.MAX_SAFE_INTEGER) - num(b.tvlUsd, Number.MAX_SAFE_INTEGER);
    if (sort === "apy_desc") return num(b.apyPct, -1) - num(a.apyPct, -1);
    if (sort === "apy_asc") return num(a.apyPct, Number.MAX_SAFE_INTEGER) - num(b.apyPct, Number.MAX_SAFE_INTEGER);
    return 0;
  });

  return arr;
}

export function useVaultsExplore() {
  const { ownerAddr } = useOwnerAddress();
  const ownerAddressKey = ownerAddr || "";

  const [data, setData] = useState<VaultExploreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<VaultsExploreFilters>({
    chainId: "all",
    dexId: "all",
    status: "all",
    ownership: "all",
    gaugeFilter: "all",
    rangeStatus: "all",
    query: "",
    sort: "tvl_desc",
    view: "list",
  });

  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await listVaultsExploreUseCase({
          owner: ownerAddressKey || undefined,
          limit: 500,
        });

        if (cancelled) return;

        const items = Array.isArray(res.data) ? res.data.map(toUiItem) : [];
        setData(items);
      } catch (err) {
        if (cancelled) return;
        setData([]);
        setError(err instanceof Error ? err.message : "Failed to load vaults");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [ownerAddressKey]);

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
        `${v.name} ${v.address} ${v.token0Symbol} ${v.token1Symbol} ${v.chainName} ${v.dexName} ${v.feeTierLabel ?? ""}`.toLowerCase();

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

  const chainOptions = useMemo<ChainOption[]>(() => {
    const unique = Array.from(new Set(data.map((v) => v.chainId))).filter(Boolean);
    return [
      { id: "all", name: "All Chains" },
      ...unique.map((id) => ({ id, name: buildChainName(id) })),
    ];
  }, [data]);

  const dexOptions = useMemo<DexOption[]>(() => {
    const unique = Array.from(new Set(data.map((v) => v.dexId))).filter(Boolean);
    return [
      { id: "all", name: "All DEXs" },
      ...unique.map((id) => ({ id, name: buildDexName(id) })),
    ];
  }, [data]);

  const overview = useMemo(() => {
    return {
      totalVaults: data.length,
      activeVaults: data.filter((v) => v.status === "active").length,
      myVaults: data.filter((v) => v.isMine).length,
      chains: new Set(data.map((v) => v.chainId)).size,
      dexes: new Set(data.map((v) => v.dexId)).size,
      inRange: data.filter((v) => v.rangeStatus === "inside").length,
      outOfRange: data.filter((v) => v.rangeStatus === "below" || v.rangeStatus === "above").length,
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
      status: "all",
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
    loading,
    error,

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