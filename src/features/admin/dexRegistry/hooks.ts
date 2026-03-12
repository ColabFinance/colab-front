"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AdminDexItem,
  AdminDexPoolItem,
  CreateDexBody,
  UpdateDexBody,
} from "@/core/infra/api/api-lp/admin";
import { createDexUseCase } from "@/core/usecases/admin/dex/createDex.usecase";
import { listDexesUseCase } from "@/core/usecases/admin/dex/listDexes.usecase";
import { updateDexUseCase } from "@/core/usecases/admin/dex/updateDex.usecase";
import { listChainsUseCase } from "@/core/usecases/admin/chains/listChains.usecase";
import { useAuthToken } from "@/hooks/useAuthToken";
import type { ChainOption, DexFormValues, DexRegistryFilters, DexRegistryItem } from "./types";
import { listDexPoolsUseCase } from "@/core/usecases/admin/pools/listDexPools.usecase";

const DEFAULT_FILTERS: DexRegistryFilters = {
  chain: "base",
  keyQuery: "",
  status: "all",
};

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

function formatUpdatedLabel(value?: string | number | null) {
  if (!value) return "Updated recently";

  const date =
    typeof value === "number"
      ? new Date(value * 1000)
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Updated recently";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Updated just now";
  if (diffMin < 60) return `Updated ${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Updated ${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `Updated ${diffDays}d ago`;

  return `Updated ${date.toLocaleDateString()}`;
}

function poolPreviewLabel(pool: AdminDexPoolItem) {
  const label = (pool.symbol || pool.pair || "").trim();
  if (label) return label;

  const t0 = pool.token0 ? `${pool.token0.slice(0, 6)}...${pool.token0.slice(-4)}` : "token0";
  const t1 = pool.token1 ? `${pool.token1.slice(0, 6)}...${pool.token1.slice(-4)}` : "token1";
  return `${t0}/${t1}`;
}

function getErrorMessage(payload: { message?: unknown; detail?: unknown }) {
  if (typeof payload.detail === "string" && payload.detail) return payload.detail;
  if (typeof payload.message === "string" && payload.message) return payload.message;
  return "Request failed.";
}

export function useDexRegistry() {
  const { token, ready, ensureTokenOrLogin } = useAuthToken();

  const [filters, setFilters] = useState<DexRegistryFilters>(DEFAULT_FILTERS);
  const [chainOptions, setChainOptions] = useState<ChainOption[]>([]);
  const [data, setData] = useState<DexRegistryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const load = useCallback(async () => {
    if (!ready) return;

    const accessToken = token || (await ensureTokenOrLogin());
    if (!accessToken) return;

    setLoading(true);
    setError("");

    try {
      const chainsResponse = await listChainsUseCase({
        accessToken,
        limit: 500,
      });

      const nextChainOptions: ChainOption[] = (chainsResponse.data ?? []).map((chain) => ({
        key: chain.key,
        chainId: chain.chain_id,
        name: chain.name,
        explorerUrl: chain.explorer_url,
        explorerLabel: chain.explorer_label,
      }));

      setChainOptions(nextChainOptions);

      if (!nextChainOptions.length) {
        setData([]);
        return;
      }

      const selectedExists = nextChainOptions.some((chain) => chain.key === filters.chain);
      const effectiveChain = selectedExists ? filters.chain : nextChainOptions[0].key;

      if (effectiveChain !== filters.chain) {
        setFilters((prev) => ({ ...prev, chain: effectiveChain }));
      }

      const chainsToLoad =
        effectiveChain === "all"
          ? nextChainOptions.map((chain) => chain.key)
          : [effectiveChain];

      const dexResponses = await Promise.all(
        chainsToLoad.map(async (chainKey) => {
          const response = await listDexesUseCase({
            accessToken,
            chain: chainKey,
            limit: 200,
          });
          return { chainKey, rows: response.data ?? [] };
        })
      );

      const dexRows = dexResponses.flatMap(({ rows }) => rows as AdminDexItem[]);

      const poolPairs = await Promise.all(
        dexRows.map(async (dexRow) => {
          try {
            const poolsResponse = await listDexPoolsUseCase({
              accessToken,
              chain: dexRow.chain,
              dex: dexRow.dex,
              limit: 500,
            });

            return [`${dexRow.chain}:${dexRow.dex}`, poolsResponse.data ?? []] as const;
          } catch {
            return [`${dexRow.chain}:${dexRow.dex}`, []] as const;
          }
        })
      );

      const poolsByDex = new Map<string, AdminDexPoolItem[]>(poolPairs);

      const mapped: DexRegistryItem[] = dexRows.map((row) => {
        const chainMeta = nextChainOptions.find((chain) => chain.key === row.chain);
        const pools = poolsByDex.get(`${row.chain}:${row.dex}`) ?? [];
        const explorerBase = chainMeta?.explorerUrl?.replace(/\/$/, "");

        return {
          id: `${row.chain}:${row.dex}`,
          chainKey: row.chain,
          chainId: chainMeta?.chainId ?? 0,
          chainName: chainMeta?.name ?? row.chain,
          name: prettifyDexKey(row.dex),
          key: row.dex,
          routerAddress: row.dex_router,
          enabled: row.status === "ACTIVE",
          status: row.status,
          poolsCount: pools.length,
          poolsPreview: pools.slice(0, 3).map(poolPreviewLabel),
          updatedAtLabel: formatUpdatedLabel(
            row.updated_at_iso ?? row.updated_at ?? row.created_at_iso ?? row.created_at
          ),
          explorerUrl: explorerBase ? `${explorerBase}/address/${row.dex_router}` : undefined,
        };
      });

      setData(mapped);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load DEX registry.";
      setError(message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [ready, token, ensureTokenOrLogin, filters.chain]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const keyQuery = filters.keyQuery.trim().toLowerCase();

    return data.filter((item) => {
      if (filters.chain !== "all" && item.chainKey !== filters.chain) return false;
      if (filters.status === "enabled" && !item.enabled) return false;
      if (filters.status === "disabled" && item.enabled) return false;

      if (!keyQuery) return true;

      const haystack = [
        item.name,
        item.key,
        item.routerAddress,
        item.chainName,
        ...item.poolsPreview,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyQuery);
    });
  }, [data, filters]);

  const registeredCount = useMemo(() => {
    if (filters.chain === "all") return data.length;
    return data.filter((item) => item.chainKey === filters.chain).length;
  }, [data, filters.chain]);

  const resetFilters = useCallback(() => {
    setFilters({
      chain: chainOptions[0]?.key ?? DEFAULT_FILTERS.chain,
      keyQuery: "",
      status: "all",
    });
  }, [chainOptions]);

  const createDex = useCallback(
    async (values: DexFormValues) => {
      const accessToken = token || (await ensureTokenOrLogin());
      if (!accessToken) {
        throw new Error("Missing access token.");
      }

      setSubmitting(true);
      try {
        const body: CreateDexBody = {
          chain: values.chain,
          dex: values.key.trim().toLowerCase(),
          dex_router: values.routerAddress.trim(),
          status: values.enabled ? "ACTIVE" : "INACTIVE",
        };

        const response = await createDexUseCase({ accessToken, body });
        if (!response.ok) {
          throw new Error(getErrorMessage(response));
        }

        await load();
      } finally {
        setSubmitting(false);
      }
    },
    [token, ensureTokenOrLogin, load]
  );

  const updateDex = useCallback(
    async (values: DexFormValues) => {
      const accessToken = token || (await ensureTokenOrLogin());
      if (!accessToken) {
        throw new Error("Missing access token.");
      }

      setSubmitting(true);
      try {
        const body: UpdateDexBody = {
          chain: values.chain,
          dex: values.key.trim().toLowerCase(),
          dex_router: values.routerAddress.trim(),
          status: values.enabled ? "ACTIVE" : "INACTIVE",
        };

        const response = await updateDexUseCase({ accessToken, body });
        if (!response.ok) {
          throw new Error(getErrorMessage(response));
        }

        await load();
      } finally {
        setSubmitting(false);
      }
    },
    [token, ensureTokenOrLogin, load]
  );

  return {
    filters,
    setFilters,
    resetFilters,
    chainOptions,
    filtered,
    registeredCount,
    loading,
    submitting,
    error,
    createDex,
    updateDex,
    reload: load,
  };
}