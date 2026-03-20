"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrivy, useWallets, type ConnectedWallet } from "@privy-io/react-auth";
import { isAddress } from "ethers";

import { useOwnerAddress } from "@/hooks/useOwnerAddress";

import { listMyStrategiesUseCase } from "@/core/usecases/user/strategies/listMyStrategies.usecase";
import { listDexesForStrategyUseCase } from "@/core/application/strategy/api/listDexesForStrategy.usecase";
import { listDexPoolsForStrategyUseCase } from "@/core/application/strategy/api/listDexPoolsForStrategy.usecase";
import { getStrategyParamsUseCase } from "@/core/application/strategy/api/getStrategyParams.usecase";
import { createIndicatorSetUseCase } from "@/core/application/strategy/api/createIndicatorSet.usecase";
import { registerStrategyDbUseCase } from "@/core/application/strategy/api/registerStrategy.usecase";
import { strategyExistsUseCase } from "@/core/application/strategy/api/strategyExists.usecase";
import { upsertStrategyParamsUseCase } from "@/core/application/strategy/api/upsertStrategyParams.usecase";
import { registerStrategyOnchain } from "@/core/application/strategy/onchain/registerStrategy.usecase";

import type {
  CreateStrategyDraft,
  DexOption,
  EditParamsDraft,
  MyStrategyChain,
  MyStrategyRow,
  PoolOption,
  StrategyStatus,
  VaultLinkFilter,
} from "./types";

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

    skewLowPct: 0.09,
    skewHighPct: 0.01,
    eps: 0.000001,
    cooloffBars: 1,
    breakoutConfirmBars: 1,
    inrangeResizeMode: "skew_swap",

    gaugeEnabled: false,

    tiersJson: JSON.stringify({ tiers: [] }, null, 2),
  };
}

function safeLower(value: string) {
  return value.trim().toLowerCase();
}

function normalizeDisplaySymbol(value: string) {
  return value.trim().toUpperCase();
}

function formatDexName(dex: string | null | undefined): string {
  const value = String(dex || "").trim().toLowerCase();

  if (value === "uniswap_v3") return "Uniswap V3";
  if (value === "pancake_v3") return "Pancake V3";
  if (value === "quickswap") return "QuickSwap";
  if (value === "aerodrome") return "Aerodrome";
  if (!value) return "Unknown DEX";

  return value
    .split("_")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

function splitPair(pair?: string | null): { token0: string; token1: string } {
  const raw = String(pair || "").trim();
  if (!raw.includes("/")) {
    return { token0: "T0", token1: "T1" };
  }

  const [left, right] = raw.split("/", 2);
  return {
    token0: (left || "T0").trim().toUpperCase(),
    token1: (right || "T1").trim().toUpperCase(),
  };
}

function formatFeeLabel(feeBps?: number | null, feeRate?: string | null): string {
  if (feeRate) return String(feeRate);
  if (typeof feeBps === "number" && Number.isFinite(feeBps) && feeBps > 0) {
    const text = `${feeBps / 10000}`.replace(/\.0+$/, "");
    return `${text}%`;
  }
  return "-";
}

function resolveMarketSymbolFromPool(pool: PoolOption): string {
  return `${pool.token0Symbol}${pool.token1Symbol}`.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

function parseTiersJson(tiersJson: string) {
  const parsed = JSON.parse(tiersJson);

  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (parsed && Array.isArray(parsed.tiers)) {
    return parsed.tiers;
  }

  throw new Error("tiersJson must be a JSON array or an object with a 'tiers' array.");
}

async function resolveWalletChainKey(wallet: ConnectedWallet): Promise<"base" | "bnb"> {
  const provider = await wallet.getEthereumProvider();
  const raw = await provider.request({ method: "eth_chainId" });

  const chainId = String(raw || "").toLowerCase();

  if (chainId === "0x2105" || chainId === "8453") {
    return "base";
  }

  if (chainId === "0x38" || chainId === "56") {
    return "bnb";
  }

  throw new Error("Unsupported wallet network. Please switch to Base or BNB.");
}

async function loadCreateResources(params: {
  accessToken: string;
  chain: "base" | "bnb";
}): Promise<{ dexOptions: DexOption[]; poolOptions: PoolOption[] }> {
  const dexes = await listDexesForStrategyUseCase({
    accessToken: params.accessToken,
    query: {
      chain: params.chain,
      limit: 200,
    },
  });

  const poolGroups = await Promise.all(
    dexes.map(async (dex) => {
      try {
        const pools = await listDexPoolsForStrategyUseCase({
          accessToken: params.accessToken,
          query: {
            chain: params.chain,
            dex: dex.dex,
            limit: 500,
          },
        });

        return pools.map((pool) => {
          const pair = String(pool.pair || pool.name || "").trim() || "-";
          const pairParts = splitPair(pair);

          return {
            id: String(pool.pool),
            poolAddress: String(pool.pool),
            chainKey: params.chain,
            dexId: String(dex.dex),
            dexName: formatDexName(dex.dex),
            token0Symbol: pairParts.token0,
            token1Symbol: pairParts.token1,
            pairLabel: pair,
            feeLabel: formatFeeLabel(pool.fee_bps, pool.fee_rate),
            token0Address: String(pool.token0 || ""),
            token1Address: String(pool.token1 || ""),
            adapterAddress: String(pool.adapter || ""),
            routerAddress: String(dex.dex_router || ""),
            gaugeAvailable: Boolean(dex.gauge),
          } satisfies PoolOption;
        });
      } catch {
        return [];
      }
    })
  );

  return {
    dexOptions: dexes.map((dex) => ({
      id: dex.dex,
      name: formatDexName(dex.dex),
    })),
    poolOptions: poolGroups.flat(),
  };
}

export function useMyStrategies() {
  const { authenticated, getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  const { ownerAddr } = useOwnerAddress();

  const activeWallet = useMemo(() => {
    const normalizedOwner = String(ownerAddr || "").toLowerCase();
    return (
      wallets.find((wallet) => String(wallet.address || "").toLowerCase() === normalizedOwner) ||
      wallets[0] ||
      null
    );
  }, [wallets, ownerAddr]);

  const [rows, setRows] = useState<MyStrategyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [dexOptions, setDexOptions] = useState<DexOption[]>([]);
  const [poolOptions, setPoolOptions] = useState<PoolOption[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  const [selected, setSelected] = useState<MyStrategyRow | null>(null);
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

      const linked = Boolean(row.vaultAlias);
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
        row.vaultAlias || "",
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
    const linkedVaults = rows.filter((row) => Boolean(row.vaultAlias)).length;

    return {
      totalStrategies,
      activeStrategies,
      inactiveStrategies,
      linkedVaults,
    };
  }, [rows]);

  const ensureAccessToken = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) {
      throw new Error("Missing access token. Please login again.");
    }
    return token;
  }, [getAccessToken]);

  const refresh = useCallback(async () => {
    if (!authenticated || !ownerAddr) {
      setRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await ensureAccessToken();

      const items = await listMyStrategiesUseCase({
        accessToken: token,
        owner: ownerAddr,
        chains: ["base", "bnb"],
      });

      setRows(
        items.map((item) => ({
          id: item.id,
          chainKey: item.chainKey,
          chainName: item.chainName,
          owner: item.owner,

          name: item.name,
          symbol: item.symbol,

          dexKey: item.dexKey,
          dexName: item.dexName,
          poolPairLabel: item.poolPairLabel,
          feeLabel: item.feeLabel,

          token0Symbol: item.token0Symbol,
          token1Symbol: item.token1Symbol,
          token0Address: item.token0Address,
          token1Address: item.token1Address,

          adapterAddress: item.adapterAddress,
          dexRouterAddress: item.dexRouterAddress,

          status: item.status,
          updatedAtLabel: item.updatedAtLabel,

          indicatorSetId: item.indicatorSetId,
          indicatorStreamKey: item.indicatorStreamKey,
          indicatorSource: item.indicatorSource,
          emaFast: item.emaFast,
          emaSlow: item.emaSlow,
          atrWindow: item.atrWindow,
          marketSymbol: item.marketSymbol,

          vaultAlias: item.vaultAlias,
          vaultLabel: item.vaultAlias || null,
        }))
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load strategies.";
      setError(message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [authenticated, ensureAccessToken, ownerAddr]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function openCreate() {
    setCreateDraft(defaultCreateDraft());
    setCreateError("");
    setCreateOpen(true);

    if (!activeWallet) {
      setCreateError("No active wallet connected.");
      return;
    }

    try {
      setCreateLoading(true);

      const token = await ensureAccessToken();
      const chain = await resolveWalletChainKey(activeWallet);

      const resources = await loadCreateResources({
        accessToken: token,
        chain,
      });

      setDexOptions(resources.dexOptions);
      setPoolOptions(resources.poolOptions);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load DEX and pool options.";
      setCreateError(message);
      setDexOptions([]);
      setPoolOptions([]);
    } finally {
      setCreateLoading(false);
    }
  }

  function closeCreate() {
    setCreateOpen(false);
    setCreateError("");
  }

  async function confirmCreate() {
    setCreateError("");

    try {
      if (!authenticated) {
        throw new Error("Please login first.");
      }
      if (!ownerAddr) {
        throw new Error("Connect a wallet first.");
      }
      if (!activeWallet) {
        throw new Error("No active wallet connected.");
      }

      setCreateSubmitting(true);

      const token = await ensureAccessToken();
      const chain = await resolveWalletChainKey(activeWallet);

      const name = createDraft.name.trim();
      const symbol = normalizeDisplaySymbol(createDraft.symbol);

      if (!name) {
        throw new Error("Name is required.");
      }
      if (!symbol) {
        throw new Error("Symbol is required.");
      }
      if (!createDraft.dexId) {
        throw new Error("DEX is required.");
      }

      const selectedPool = poolOptions.find((pool) => pool.id === createDraft.poolId);
      if (!selectedPool) {
        throw new Error("Pool is required.");
      }

      if (!isAddress(selectedPool.adapterAddress)) {
        throw new Error("Selected pool does not provide a valid adapter address.");
      }
      if (!isAddress(selectedPool.routerAddress)) {
        throw new Error("Selected pool does not provide a valid dex router address.");
      }
      if (!isAddress(selectedPool.token0Address) || !isAddress(selectedPool.token1Address)) {
        throw new Error("Selected pool does not provide valid token addresses.");
      }

      const existsRes = await strategyExistsUseCase({
        accessToken: token,
        query: {
          chain,
          owner: ownerAddr,
          name,
          symbol,
        },
      });

      if (existsRes?.data?.exists) {
        throw new Error("A strategy with same (name, symbol) already exists.");
      }

      const onchain = await registerStrategyOnchain({
        wallet: activeWallet,
        owner: ownerAddr,
        payload: {
          adapter: selectedPool.adapterAddress,
          dexRouter: selectedPool.routerAddress,
          token0: selectedPool.token0Address,
          token1: selectedPool.token1Address,
          name,
          description: createDraft.description.trim(),
        },
      });

      const indicatorSet = await createIndicatorSetUseCase({
        accessToken: token,
        payload: {
          symbol: resolveMarketSymbolFromPool(selectedPool),
          source: createDraft.indicatorSource.trim().toLowerCase() || "binance",
          ema_fast: Number(createDraft.emaFast),
          ema_slow: Number(createDraft.emaSlow),
          atr_window: Number(createDraft.atrWindow),
          pool_address: selectedPool.poolAddress,
        },
      });

      await registerStrategyDbUseCase({
        accessToken: token,
        payload: {
          chain,
          owner: ownerAddr,
          strategy_id: onchain.strategy_id,
          name,
          symbol,
          indicator_set_id: indicatorSet.cfg_hash,
          stream_key: indicatorSet.stream_key,
          adapter: selectedPool.adapterAddress,
          dex_router: selectedPool.routerAddress,
          token0: selectedPool.token0Address,
          token1: selectedPool.token1Address,
          tx_hash: onchain.tx_hash,
          status: "INACTIVE",
          is_public: false,
        },
      });

      setCreateOpen(false);
      setCreateDraft(defaultCreateDraft());
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Create strategy failed.";
      setCreateError(message);
    } finally {
      setCreateSubmitting(false);
    }
  }

  async function openEdit(row: MyStrategyRow) {
    setSelected(row);
    setEditOpen(true);
    setEditLoading(true);
    setEditError("");
    setEditDraft(defaultEditDraft(row));

    try {
      const token = await ensureAccessToken();

      const [paramsRes] = await Promise.all([
        getStrategyParamsUseCase({
          accessToken: token,
          chain: row.chainKey,
          owner: row.owner,
          strategyId: row.id,
        }),
      ]);

      const params = paramsRes?.data?.params || {};

      setEditDraft({
        status: paramsRes?.data?.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
        indicatorSetId: row.indicatorSetId,
        symbol: paramsRes?.data?.symbol || row.symbol,

        indicatorSource: row.indicatorSource,
        emaFast: row.emaFast,
        emaSlow: row.emaSlow,
        atrWindow: row.atrWindow,

        skewLowPct:
          typeof (params as any).skew_low_pct === "number" ? (params as any).skew_low_pct : 0.09,
        skewHighPct:
          typeof (params as any).skew_high_pct === "number" ? (params as any).skew_high_pct : 0.01,
        eps: typeof (params as any).eps === "number" ? (params as any).eps : 0.000001,
        cooloffBars:
          typeof (params as any).cooloff_bars === "number" ? (params as any).cooloff_bars : 1,
        breakoutConfirmBars:
          typeof (params as any).breakout_confirm_bars === "number"
            ? (params as any).breakout_confirm_bars
            : 1,
        inrangeResizeMode:
          (params as any).inrange_resize_mode === "preserve" ? "preserve" : "skew_swap",

        gaugeEnabled: Boolean((params as any).gauge_flow_enabled),

        tiersJson: JSON.stringify(
          { tiers: Array.isArray((params as any).tiers) ? (params as any).tiers : [] },
          null,
          2
        ),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load strategy params.";
      setEditError(message);
    } finally {
      setEditLoading(false);
    }
  }

  function closeEdit() {
    setEditOpen(false);
    setEditError("");
  }

  async function saveParams() {
    if (!selected || !editDraft) {
      return;
    }

    setEditError("");

    try {
      setEditSubmitting(true);

      const token = await ensureAccessToken();

      const indicatorSet = await createIndicatorSetUseCase({
        accessToken: token,
        payload: {
          symbol: selected.marketSymbol,
          source: editDraft.indicatorSource.trim().toLowerCase() || "binance",
          ema_fast: Number(editDraft.emaFast),
          ema_slow: Number(editDraft.emaSlow),
          atr_window: Number(editDraft.atrWindow),
        },
      });

      await upsertStrategyParamsUseCase({
        accessToken: token,
        payload: {
          chain: selected.chainKey,
          owner: selected.owner,
          strategy_id: selected.id,
          name: selected.name,
          symbol: normalizeDisplaySymbol(editDraft.symbol),
          indicator_set_id: indicatorSet.cfg_hash,
          stream_key: indicatorSet.stream_key,
          status: editDraft.status,
          adapter: selected.adapterAddress || undefined,
          dex_router: selected.dexRouterAddress || undefined,
          token0: selected.token0Address || undefined,
          token1: selected.token1Address || undefined,
          params: {
            eps: Number(editDraft.eps),
            cooloff_bars: Number(editDraft.cooloffBars),
            breakout_confirm_bars: Number(editDraft.breakoutConfirmBars),
            gauge_flow_enabled: Boolean(editDraft.gaugeEnabled),
            skew_low_pct: Number(editDraft.skewLowPct),
            skew_high_pct: Number(editDraft.skewHighPct),
            inrange_resize_mode: editDraft.inrangeResizeMode,
            tiers: parseTiersJson(editDraft.tiersJson),
          },
        },
      });

      setEditOpen(false);
      await refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save strategy params.";
      setEditError(message);
    } finally {
      setEditSubmitting(false);
    }
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

    loading,
    error,

    stats,
    filters,
    chainOptions,

    setChainFilter,
    setStatusFilter,
    setVaultLinkFilter,
    setQueryFilter,
    resetFilters,

    createOpen,
    createLoading,
    createSubmitting,
    createError,
    openCreate,
    closeCreate,
    createDraft,
    setCreateDraft,
    confirmCreate,

    editOpen,
    editLoading,
    editSubmitting,
    editError,
    selected,
    openEdit,
    closeEdit,
    editDraft,
    setEditDraft,
    saveParams,

    refresh,
  };
}