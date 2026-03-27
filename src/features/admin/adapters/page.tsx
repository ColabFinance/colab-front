"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/presentation/components/Button";
import { useAuthToken } from "@/hooks/useAuthToken";
import {
  AdminAdapterItem,
  AdminChainItem,
  AdminDexItem,
  AdminDexPoolItem,
} from "@/core/infra/api/api-lp/admin";
import { listChainsUseCase } from "@/core/usecases/admin/chains/listChains.usecase";
import { listDexesUseCase } from "@/core/usecases/admin/dex/listDexes.usecase";
import { listDexPoolsUseCase } from "@/core/usecases/admin/pools/listDexPools.usecase";
import { listAdaptersUseCase } from "@/core/usecases/admin/adapters/listAdapters.usecase";
import { createAdapterUseCase } from "@/core/usecases/admin/adapters/createAdapter.usecase";
import { Adapter, AdaptersFilters, AdapterDraft } from "./types";
import { AdaptersFiltersPanel } from "./ui/AdaptersFiltersPanel";
import { AdaptersTable } from "./ui/AdaptersTable";
import { AdapterDrawer } from "./ui/AdapterDrawer";

export default function AdaptersPage() {
  const { ready, authenticated, token, ensureTokenOrLogin } = useAuthToken();

  const [rows, setRows] = useState<Adapter[]>([]);
  const [chains, setChains] = useState<AdminChainItem[]>([]);
  const [dexes, setDexes] = useState<AdminDexItem[]>([]);
  const [drawerPools, setDrawerPools] = useState<AdminDexPoolItem[]>([]);

  const [filters, setFilters] = useState<AdaptersFilters>({
    chain: "",
    dex: "all",
    status: "all",
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPools, setLoadingPools] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const chainMap = useMemo(() => {
    return chains.reduce<Record<string, AdminChainItem>>((acc, item) => {
      acc[item.key] = item;
      return acc;
    }, {});
  }, [chains]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (filters.dex !== "all" && row.dex !== filters.dex) return false;
      if (filters.status !== "all" && row.status !== filters.status) return false;
      return true;
    });
  }, [rows, filters.dex, filters.status]);

  const getAccessToken = useCallback(async () => {
    if (token) return token;
    return ensureTokenOrLogin();
  }, [token, ensureTokenOrLogin]);

  const loadChains = useCallback(async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) return;

    const response = await listChainsUseCase({
      accessToken,
      limit: 500,
    });

    const nextChains = response.data ?? [];
    setChains(nextChains);

    setFilters((prev) => {
      if (prev.chain) return prev;
      return {
        ...prev,
        chain: nextChains[0]?.key ?? "",
      };
    });
  }, [getAccessToken]);

  const loadChainData = useCallback(
    async (chain: string) => {
      if (!chain) return;

      const accessToken = await getAccessToken();
      if (!accessToken) return;

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const [adaptersResponse, dexesResponse] = await Promise.all([
          listAdaptersUseCase({ accessToken, chain }),
          listDexesUseCase({ accessToken, chain, limit: 200 }),
        ]);

        const adapterRows = (adaptersResponse.data ?? []).map(mapAdapterToRow);
        const dexRows = dexesResponse.data ?? [];

        setRows(adapterRows);
        setDexes(dexRows);

        setFilters((prev) => {
          const dexStillExists =
            prev.dex === "all" || dexRows.some((item) => item.dex === prev.dex);

          return {
            ...prev,
            dex: dexStillExists ? prev.dex : "all",
          };
        });
      } catch (err) {
        setRows([]);
        setDexes([]);
        setError(getErrorMessage(err, "Failed to load adapters."));
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken]
  );

  const loadPoolsForDex = useCallback(
    async (dex: string) => {
      if (!filters.chain || !dex) {
        setDrawerPools([]);
        return;
      }

      const accessToken = await getAccessToken();
      if (!accessToken) return;

      setLoadingPools(true);

      try {
        const response = await listDexPoolsUseCase({
          accessToken,
          chain: filters.chain,
          dex,
          limit: 500,
        });

        setDrawerPools(response.data ?? []);
      } catch (err) {
        setDrawerPools([]);
        setError(getErrorMessage(err, "Failed to load pools for selected DEX."));
      } finally {
        setLoadingPools(false);
      }
    },
    [filters.chain, getAccessToken]
  );

  useEffect(() => {
    if (!ready || !authenticated) return;
    void loadChains();
  }, [ready, authenticated, loadChains]);

  useEffect(() => {
    if (!ready || !authenticated || !filters.chain) return;
    void loadChainData(filters.chain);
  }, [ready, authenticated, filters.chain, loadChainData]);

  async function handleCreate(draft: AdapterDraft) {
    const selectedPool = drawerPools.find((item) => item.pool === draft.pool);
    if (!selectedPool) {
      setError("Select a valid pool before deploying the adapter.");
      return;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await createAdapterUseCase({
        accessToken,
        body: {
          chain: filters.chain,
          dex: draft.dex,
          pool: selectedPool.pool,
          nfpm: selectedPool.nfpm,
          gauge: selectedPool.gauge,
          fee_buffer: draft.feeBuffer,
          token0: selectedPool.token0,
          token1: selectedPool.token1,
          pool_name: selectedPool.pair || selectedPool.symbol || selectedPool.pool,
          fee_bps: String(selectedPool.fee_bps),
          status: draft.status,
          gas_strategy: "buffered",
        },
      });

      if (!response.ok) {
        throw new Error(response.message || "Failed to create adapter.");
      }

      setDrawerOpen(false);
      setDrawerPools([]);
      setSuccess("Adapter deployed and registry updated successfully.");
      await loadChainData(filters.chain);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create adapter."));
    } finally {
      setSaving(false);
    }
  }

  function handleResetFilters() {
    setFilters((prev) => ({
      chain: prev.chain,
      dex: "all",
      status: "all",
    }));
  }

  const currentChainName =
    chainMap[filters.chain]?.name || filters.chain || "Adapters";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-100 tracking-tight">
              Adapters
            </h1>

            <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1">
              <div className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
              <span className="text-xs font-medium text-slate-300">
                {currentChainName}
              </span>
            </div>
          </div>

          <p className="text-slate-400 text-sm md:text-base">
            Manage real on-chain adapters registered for each DEX pool.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="secondary"
            className="w-full sm:w-auto justify-center"
            leftIcon={<RefreshIcon className="h-4 w-4" />}
            onClick={() => void loadChainData(filters.chain)}
            disabled={loading || !filters.chain}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>

          <Button
            variant="primary"
            className="w-full sm:w-auto justify-center"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={() => {
              setSuccess("");
              setError("");
              setDrawerOpen(true);
              setDrawerPools([]);
            }}
            disabled={!filters.chain}
          >
            Add Adapter
          </Button>
        </div>
      </div>

      {!!error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {!!success && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {success}
        </div>
      )}

      <AdaptersFiltersPanel
        value={filters}
        chains={chains.map((item) => ({
          key: item.key,
          name: item.name,
        }))}
        dexes={dexes.map((item) => ({ dex: item.dex }))}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      <AdaptersTable
        rows={filteredRows}
        onCreateClick={() => setDrawerOpen(true)}
        getAddressExplorerHref={(chain, address) =>
          buildExplorerHref(chainMap[chain]?.explorer_url, "address", address)
        }
        getTxExplorerHref={(chain, txHash) =>
          buildExplorerHref(chainMap[chain]?.explorer_url, "tx", txHash)
        }
      />

      <AdapterDrawer
        open={drawerOpen}
        chain={filters.chain}
        dexes={dexes}
        pools={drawerPools}
        poolsLoading={loadingPools}
        saving={saving}
        onClose={() => setDrawerOpen(false)}
        onDexChange={(dex) => void loadPoolsForDex(dex)}
        onSave={(draft) => void handleCreate(draft)}
      />

      <div className="pt-4 text-center text-xs text-slate-600">
        <p>&copy; 2024 Protocol Admin Dashboard. Adapter creation deploys a real contract.</p>
      </div>
    </div>
  );
}

function mapAdapterToRow(item: AdminAdapterItem): Adapter {
  return {
    chain: item.chain,
    address: item.address,
    txHash: item.tx_hash ?? null,
    dex: item.dex,
    pool: item.pool,
    nfpm: item.nfpm,
    gauge: item.gauge,
    feeBuffer: item.fee_buffer,
    token0: item.token0,
    token1: item.token1,
    poolName: item.pool_name,
    feeBps: item.fee_bps,
    status: item.status,
    createdAt: item.created_at ?? null,
    createdBy: item.created_by ?? null,
    createdAtLabel: formatRelativeTime(item.created_at),
  };
}

function buildExplorerHref(
  explorerBase: string | undefined,
  kind: "address" | "tx",
  value?: string | null
) {
  if (!explorerBase || !value) return null;
  return `${explorerBase.replace(/\/+$/, "")}/${kind}/${value}`;
}

function formatRelativeTime(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} h ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} d ago`;

  return date.toLocaleString();
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M21 12a9 9 0 1 1-2.64-6.36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 3v7h-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}