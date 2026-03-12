"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminDexItem, AdminDexPoolItem, CreateDexPoolBody, UpdateDexPoolBody } from "@/core/infra/api/api-lp/admin";
import { useAuthToken } from "@/hooks/useAuthToken";
import { listChainsUseCase } from "@/core/usecases/admin/chains/listChains.usecase";
import { listDexesUseCase } from "@/core/usecases/admin/dex/listDexes.usecase";
import { listDexPoolsUseCase } from "@/core/usecases/admin/pools/listDexPools.usecase";
import { createDexPoolUseCase } from "@/core/usecases/admin/pools/createDexPool.usecase";
import { updateDexPoolUseCase } from "@/core/usecases/admin/pools/updateDexPool.usecase";
import type { ChainOption, DexOption, DexPoolRow, PoolDraft, PoolsFilters, PoolType } from "./types";

const ZERO = "0x0000000000000000000000000000000000000000";

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
  chain: "base",
  dexKey: "",
  tokenSymbol: "",
  feeTier: "",
  status: "all",
};

const DEFAULT_DRAFT: PoolDraft = {
  chain: "base",
  dexKey: "",
  poolAddress: "",
  nfpm: "",
  gauge: ZERO,
  token0Address: "",
  token1Address: "",
  pair: "",
  symbol: "",
  feeTier: "500",
  tickSpacing: "",
  poolType: "CONCENTRATED",
  adapterAddress: "",
  rewardToken: "",
  rewardSwapPool: ZERO,
  isActive: true,
};

function shortAddr(addr: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function feeTierLabelFromBps(bps: number) {
  return `${(bps / 10000).toFixed(2).replace(/\.?0+$/, "")}%`;
}

function parseDateFromApi(row: AdminDexPoolItem) {
  const raw = row.updated_at_iso ?? row.created_at_iso ?? row.updated_at ?? row.created_at;
  if (!raw) return new Date();

  if (typeof raw === "number") return new Date(raw * 1000);

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function deriveSymbols(pair: string | null | undefined, token0: string, token1: string) {
  const cleanPair = (pair ?? "").trim();
  if (cleanPair) {
    const parts = cleanPair.split(/[-/]/).map((item) => item.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return {
        token0Symbol: parts[0],
        token1Symbol: parts[1],
      };
    }
  }

  return {
    token0Symbol: "T0",
    token1Symbol: "T1",
  };
}

function prettifyDexKey(key: string) {
  return key
    .split("_")
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      if (lower === "v2" || lower === "v3") return lower.toUpperCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function getErrorMessage(payload: { detail?: unknown; message?: unknown }) {
  if (typeof payload.detail === "string" && payload.detail) return payload.detail;
  if (typeof payload.message === "string" && payload.message) return payload.message;
  return "Request failed.";
}

export function usePoolsPage() {
  const { token, ready, ensureTokenOrLogin } = useAuthToken();

  const [filters, setFilters] = useState<PoolsFilters>(DEFAULT_FILTERS);
  const [chainOptions, setChainOptions] = useState<ChainOption[]>([]);
  const [dexOptions, setDexOptions] = useState<DexOption[]>([]);
  const [allRows, setAllRows] = useState<DexPoolRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [drawerError, setDrawerError] = useState("");

  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editingRow, setEditingRow] = useState<DexPoolRow | null>(null);
  const [draft, setDraft] = useState<PoolDraft>(DEFAULT_DRAFT);

  const loadPools = useCallback(async () => {
    if (!ready) return;

    const accessToken = token || (await ensureTokenOrLogin());
    if (!accessToken) return;

    setLoading(true);
    setPageError("");

    try {
      const chainsResponse = await listChainsUseCase({
        accessToken,
        limit: 500,
      });

      const nextChainOptions: ChainOption[] = (chainsResponse.data ?? []).map((chain) => ({
        key: chain.key,
        name: chain.name,
        chainId: chain.chain_id,
      }));

      setChainOptions(nextChainOptions);

      if (!nextChainOptions.length) {
        setDexOptions([]);
        setAllRows([]);
        return;
      }

      const selectedChainExists = nextChainOptions.some((chain) => chain.key === filters.chain);
      const effectiveChain = selectedChainExists ? filters.chain : nextChainOptions[0].key;

      if (!selectedChainExists) {
        setFilters((prev) => ({
          ...prev,
          chain: effectiveChain,
          dexKey: "",
        }));
      }

      const dexesResponse = await listDexesUseCase({
        accessToken,
        chain: effectiveChain,
        limit: 200,
      });

      const dexRows = dexesResponse.data ?? [];
      const nextDexOptions: DexOption[] = dexRows.map((dex: AdminDexItem) => ({
        key: dex.dex,
        label: prettifyDexKey(dex.dex),
      }));

      setDexOptions(nextDexOptions);

      const dexExists = !filters.dexKey || nextDexOptions.some((item) => item.key === filters.dexKey);
      if (!dexExists) {
        setFilters((prev) => ({
          ...prev,
          dexKey: "",
        }));
      }

      if (!dexRows.length) {
        setAllRows([]);
        return;
      }

      const poolsResponses = await Promise.all(
        dexRows.map(async (dexRow: AdminDexItem) => {
          const response = await listDexPoolsUseCase({
            accessToken,
            chain: effectiveChain,
            dex: dexRow.dex,
            limit: 500,
          });

          return response.data ?? [];
        })
      );

      const chainLabel =
        nextChainOptions.find((chain) => chain.key === effectiveChain)?.name ?? effectiveChain;

      const mappedRows: DexPoolRow[] = poolsResponses.flat().map((row: AdminDexPoolItem) => {
        const symbols = deriveSymbols(row.pair, row.token0, row.token1);

        return {
          id: `${row.chain}:${row.dex}:${row.pool}`,

          chainKey: row.chain,
          chainName: chainLabel,

          dexKey: row.dex,

          poolAddressShort: shortAddr(row.pool),
          poolAddressFull: row.pool,

          token0Symbol: symbols.token0Symbol,
          token0AddressFull: row.token0,
          token0AddressShort: shortAddr(row.token0),

          token1Symbol: symbols.token1Symbol,
          token1AddressFull: row.token1,
          token1AddressShort: shortAddr(row.token1),

          feeTierLabel: feeTierLabelFromBps(row.fee_bps),
          feeTierBps: row.fee_bps,
          tickSpacing:
            row.tick_spacing === null || row.tick_spacing === undefined ? "-" : String(row.tick_spacing),
          type: (row.pool_type ?? "CONCENTRATED") as PoolType,

          status: row.status === "ACTIVE" ? "active" : "paused",
          updatedAt: parseDateFromApi(row),

          nfpm: row.nfpm,
          gauge: row.gauge,
          pair: row.pair ?? "",
          symbol: row.symbol ?? "",
          adapter: row.adapter ?? "",
          rewardToken: row.reward_token ?? "",
          rewardSwapPool: row.reward_swap_pool ?? ZERO,
        };
      });

      setAllRows(mappedRows);
    } catch (err) {
      setPageError(err instanceof Error ? err.message : "Failed to load pools.");
      setAllRows([]);
      setDexOptions([]);
    } finally {
      setLoading(false);
    }
  }, [ready, token, ensureTokenOrLogin, filters.chain, filters.dexKey]);

  useEffect(() => {
    void loadPools();
  }, [loadPools]);

  const filteredRows = useMemo(() => {
    const tokenQuery = filters.tokenSymbol.trim().toUpperCase();

    return allRows.filter((row) => {
      if (filters.chain && row.chainKey !== filters.chain) return false;
      if (filters.dexKey && row.dexKey !== filters.dexKey) return false;

      if (tokenQuery) {
        const haystack = [
          row.token0Symbol,
          row.token1Symbol,
          row.token0AddressFull,
          row.token1AddressFull,
          row.poolAddressFull,
          row.dexKey,
          row.pair,
          row.symbol,
        ]
          .join(" ")
          .toUpperCase();

        if (!haystack.includes(tokenQuery)) return false;
      }

      if (filters.feeTier) {
        const feeTier = Number(filters.feeTier);
        if (!Number.isNaN(feeTier) && row.feeTierBps !== feeTier) return false;
      }

      if (filters.status !== "all" && row.status !== filters.status) return false;

      return true;
    });
  }, [allRows, filters]);

  const total = filteredRows.length;

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page]);

  const selectedCount = useMemo(
    () => Object.values(selectedIds).filter(Boolean).length,
    [selectedIds]
  );

  const chainLabel = useMemo(() => {
    return chainOptions.find((chain) => chain.key === filters.chain)?.name ?? filters.chain;
  }, [chainOptions, filters.chain]);

  function toggleAllOnPage(checked: boolean) {
    const next = { ...selectedIds };
    for (const row of paginatedRows) next[row.id] = checked;
    setSelectedIds(next);
  }

  function toggleOne(id: string, checked: boolean) {
    setSelectedIds((prev) => ({ ...prev, [id]: checked }));
  }

  function resetFilters() {
    setFilters((prev) => ({
      ...prev,
      chain: chainOptions[0]?.key ?? "base",
      dexKey: "",
      tokenSymbol: "",
      feeTier: "",
      status: "all",
    }));
    setPage(1);
  }

  function applyFilters() {
    setPage(1);
  }

  function openCreate() {
    setDrawerError("");
    setDrawerMode("create");
    setEditingRow(null);
    setDraft({
      ...DEFAULT_DRAFT,
      chain: filters.chain,
      dexKey: filters.dexKey || dexOptions[0]?.key || "",
    });
    setDrawerOpen(true);
  }

  function openEdit(row: DexPoolRow) {
    setDrawerError("");
    setDrawerMode("edit");
    setEditingRow(row);
    setDraft({
      chain: row.chainKey,
      dexKey: row.dexKey,
      poolAddress: row.poolAddressFull,
      nfpm: row.nfpm,
      gauge: row.gauge,
      token0Address: row.token0AddressFull,
      token1Address: row.token1AddressFull,
      pair: row.pair,
      symbol: row.symbol,
      feeTier: String(row.feeTierBps),
      tickSpacing: row.tickSpacing === "-" ? "" : row.tickSpacing,
      poolType: row.type,
      adapterAddress: row.adapter,
      rewardToken: row.rewardToken,
      rewardSwapPool: row.rewardSwapPool || ZERO,
      isActive: row.status === "active",
    });
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerError("");
    setDrawerOpen(false);
  }

  function updateDraft(patch: Partial<PoolDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  async function saveDraft() {
    const accessToken = token || (await ensureTokenOrLogin());
    if (!accessToken) {
      setDrawerError("Missing access token.");
      return;
    }

    setSubmitting(true);
    setDrawerError("");

    try {
      const feeBps = Number(draft.feeTier);
      if (Number.isNaN(feeBps)) {
        throw new Error("Fee tier is invalid.");
      }

      const commonBody = {
        chain: draft.chain,
        dex: draft.dexKey.trim().toLowerCase(),
        pool: draft.poolAddress.trim(),
        nfpm: draft.nfpm.trim(),
        gauge: draft.gauge.trim() || ZERO,
        token0: draft.token0Address.trim(),
        token1: draft.token1Address.trim(),
        pair: draft.pair.trim(),
        symbol: draft.symbol.trim(),
        fee_bps: feeBps,
        tick_spacing: draft.tickSpacing.trim() ? Number(draft.tickSpacing) : null,
        pool_type: draft.poolType,
        adapter: draft.adapterAddress.trim() || null,
        reward_token: draft.rewardToken.trim(),
        reward_swap_pool: draft.rewardSwapPool.trim() || ZERO,
        status: draft.isActive ? "ACTIVE" : "INACTIVE",
      };

      const response =
        drawerMode === "create"
          ? await createDexPoolUseCase({
              accessToken,
              body: commonBody as CreateDexPoolBody,
            })
          : await updateDexPoolUseCase({
              accessToken,
              body: commonBody as UpdateDexPoolBody,
            });

      if (!response.ok) {
        throw new Error(getErrorMessage(response));
      }

      await loadPools();
      closeDrawer();
    } catch (err) {
      setDrawerError(err instanceof Error ? err.message : "Failed to save pool.");
    } finally {
      setSubmitting(false);
    }
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
    saveDraft,

    loading,
    submitting,
    pageError,
    drawerError,

    chainOptions,
    dexOptions,
    chainLabel,

    reload: loadPools,
    formatRelative,
  };
}