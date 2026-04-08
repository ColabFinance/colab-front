"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrivy, useWallets, type ConnectedWallet } from "@privy-io/react-auth";
import { isAddress } from "ethers";

import { useOwnerAddress } from "@/hooks/useOwnerAddress";

import { listMyStrategiesUseCase } from "@/core/usecases/user/strategies/listMyStrategies.usecase";
import { listDexesForStrategyUseCase } from "@/core/application/strategy/api/listDexesForStrategy.usecase";
import { listDexPoolsForStrategyUseCase } from "@/core/application/strategy/api/listDexPoolsForStrategy.usecase";
import { getStrategyParamsUseCase } from "@/core/application/strategy/api/getStrategyParams.usecase";
import { registerStrategyDbUseCase } from "@/core/application/strategy/api/registerStrategy.usecase";
import { strategyExistsUseCase } from "@/core/application/strategy/api/strategyExists.usecase";
import { upsertStrategyParamsUseCase } from "@/core/application/strategy/api/upsertStrategyParams.usecase";
import { registerStrategyOnchain } from "@/core/application/strategy/onchain/registerStrategy.usecase";

import type {
  AtrWidthRuleDraft,
  CreateStrategyDraft,
  DexOption,
  EditParamsDraft,
  MyStrategyChain,
  MyStrategyRow,
  PoolOption,
  StrategyStatus,
  StrategyVisibilityFilter,
  VaultLinkFilter,
} from "./types";

function defaultAtrWidthRules(): AtrWidthRuleDraft[] {
  return [
    { max_atr_pct: 0.0005, width_pct: 0.05, name: "atr_very_low_5" },
    { max_atr_pct: 0.001, width_pct: 0.1, name: "atr_low_10" },
    { max_atr_pct: 0.0015, width_pct: 0.12, name: "atr_mid_12" },
    { max_atr_pct: 0.003, width_pct: 0.15, name: "atr_mid_high_15" },
    { max_atr_pct: Number.POSITIVE_INFINITY, width_pct: 0.2, name: "atr_high_20" },
  ];
}

function defaultAtrWidthRulesJson() {
  return JSON.stringify(defaultAtrWidthRules(), null, 2);
}

function defaultCreateDraft(): CreateStrategyDraft {
  return {
    dexId: "",
    poolId: "",
    name: "",
    description: "",

    status: "INACTIVE",
    isPublic: false,
    symbol: "",

    fixedRangeWidthPct: 0.2,

    breakoutDownBelowShare: 0.95,
    breakoutDownAboveShare: 0.05,
    breakoutUpBelowShare: 0.05,
    breakoutUpAboveShare: 0.95,
    breakoutConfirmBars: 3,
    breakoutUseHighLow: false,

    initialSide: "down",

    atrEnabled: true,
    atrPeriod: 14,

    atrRebalanceEnabled: true,
    atrRebalanceMinWidthDeltaPct: 0.000000000001,

    atrHysteresisEnabled: true,
    atrHysteresisGapPct: 0.0002,

    atrRebalanceCooldownBars: 60,
    atrRebalanceMinAgeBars: 30,

    swapFeePercent: 0.01,

    entryFiltersEnabled: true,
    allowCashWhenFilterFails: false,
    entryCooldownBars: 0,

    entryAtrQuantileWindow: 200,
    entryAtrQuantile: 0.65,

    entryTrendMaWindow: 100,
    entryMaxMaDistancePct: 0.02,
    entryMaxMaSlopePct: 0.0015,

    entryChannelWindow: 100,
    entryChannelPosMin: 0.2,
    entryChannelPosMax: 0.8,

    eps: 0.000001,
    gaugeEnabled: false,

    atrWidthRulesJson: defaultAtrWidthRulesJson(),
  };
}

function defaultEditDraft(row: MyStrategyRow): EditParamsDraft {
  return {
    indicatorSetId: row.indicatorSetId,
    streamKey: row.streamKey,

    status: row.status,
    isPublic: row.isPublic,
    symbol: row.symbol,

    fixedRangeWidthPct: row.fixedRangeWidthPct,

    breakoutDownBelowShare: 0.95,
    breakoutDownAboveShare: 0.05,
    breakoutUpBelowShare: 0.05,
    breakoutUpAboveShare: 0.95,
    breakoutConfirmBars: row.breakoutConfirmBars,
    breakoutUseHighLow: row.breakoutUseHighLow,

    initialSide: row.initialSide,

    atrEnabled: row.atrEnabled,
    atrPeriod: row.atrPeriod,

    atrRebalanceEnabled: row.atrRebalanceEnabled,
    atrRebalanceMinWidthDeltaPct: 0.000000000001,

    atrHysteresisEnabled: true,
    atrHysteresisGapPct: 0.0002,

    atrRebalanceCooldownBars: 60,
    atrRebalanceMinAgeBars: 30,

    swapFeePercent: 0.01,

    entryFiltersEnabled: row.entryFiltersEnabled,
    allowCashWhenFilterFails: row.allowCashWhenFilterFails,
    entryCooldownBars: 0,

    entryAtrQuantileWindow: 200,
    entryAtrQuantile: 0.65,

    entryTrendMaWindow: 100,
    entryMaxMaDistancePct: 0.02,
    entryMaxMaSlopePct: 0.0015,

    entryChannelWindow: 100,
    entryChannelPosMin: 0.2,
    entryChannelPosMax: 0.8,

    eps: 0.000001,
    gaugeEnabled: row.gaugeEnabled,

    atrWidthRulesJson: defaultAtrWidthRulesJson(),
  };
}

function safeLower(value: string) {
  return value.trim().toLowerCase();
}

function normalizeDisplaySymbol(value: string) {
  return value.trim().toUpperCase();
}

function normalizeCompact(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
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

function parseAtrWidthRulesJson(value: string) {
  const parsed = JSON.parse(value);

  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (parsed && Array.isArray(parsed.atr_width_rules)) {
    return parsed.atr_width_rules;
  }

  throw new Error("ATR width rules must be a JSON array or an object with atr_width_rules.");
}

function buildInternalIndicatorSetId(params: {
  chain: "base" | "bnb";
  strategyId: number;
  streamKey?: string;
}) {
  const tail = normalizeCompact(params.streamKey || "internal");
  return `lp_internal_${params.chain}_${params.strategyId}_${tail}`;
}

function buildStrategyParamsPayload(draft: CreateStrategyDraft | EditParamsDraft) {
  return {
    strategy_version: "simple_wide_lp_v1",

    fixed_range_width_pct: Number(draft.fixedRangeWidthPct),

    breakout_down_below_share: Number(draft.breakoutDownBelowShare),
    breakout_down_above_share: Number(draft.breakoutDownAboveShare),
    breakout_up_below_share: Number(draft.breakoutUpBelowShare),
    breakout_up_above_share: Number(draft.breakoutUpAboveShare),
    breakout_confirm_bars: Number(draft.breakoutConfirmBars),
    breakout_use_high_low: Boolean(draft.breakoutUseHighLow),

    initial_side: draft.initialSide,

    atr_enabled: Boolean(draft.atrEnabled),
    atr_period: Number(draft.atrPeriod),

    atr_rebalance_enabled: Boolean(draft.atrRebalanceEnabled),
    atr_rebalance_min_width_delta_pct: Number(draft.atrRebalanceMinWidthDeltaPct),

    atr_width_rules: parseAtrWidthRulesJson(draft.atrWidthRulesJson),

    atr_hysteresis_enabled: Boolean(draft.atrHysteresisEnabled),
    atr_hysteresis_gap_pct: Number(draft.atrHysteresisGapPct),

    atr_rebalance_cooldown_bars: Number(draft.atrRebalanceCooldownBars),
    atr_rebalance_min_age_bars: Number(draft.atrRebalanceMinAgeBars),

    swap_fee_percent: Number(draft.swapFeePercent),

    entry_filters_enabled: Boolean(draft.entryFiltersEnabled),
    allow_cash_when_filter_fails: Boolean(draft.allowCashWhenFilterFails),
    entry_cooldown_bars: Number(draft.entryCooldownBars),

    entry_atr_quantile_window: Number(draft.entryAtrQuantileWindow),
    entry_atr_quantile: Number(draft.entryAtrQuantile),

    entry_trend_ma_window: Number(draft.entryTrendMaWindow),
    entry_max_ma_distance_pct: Number(draft.entryMaxMaDistancePct),
    entry_max_ma_slope_pct: Number(draft.entryMaxMaSlopePct),

    entry_channel_window: Number(draft.entryChannelWindow),
    entry_channel_pos_min: Number(draft.entryChannelPosMin),
    entry_channel_pos_max: Number(draft.entryChannelPosMax),

    eps: Number(draft.eps),
    gauge_flow_enabled: Boolean(draft.gaugeEnabled),
  };
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
            streamKey: String((pool as any).stream_key || (pool as any).streamKey || pool.pool || "").trim() || undefined,
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
    visibility: StrategyVisibilityFilter;
    query: string;
  }>({
    chain: "all",
    status: "all",
    vaultLink: "all",
    visibility: "all",
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

      if (filters.visibility === "public" && !row.isPublic) return false;
      if (filters.visibility === "private" && row.isPublic) return false;

      if (!q) return true;

      const haystack = [
        row.id,
        row.name,
        row.symbol,
        row.indicatorSetId,
        row.streamKey,
        row.poolPairLabel,
        row.dexName,
        row.chainName,
        row.vaultAlias || "",
        row.strategyVersion,
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
    const publicStrategies = rows.filter((row) => row.isPublic).length;
    const linkedVaults = rows.filter((row) => Boolean(row.vaultAlias)).length;

    return {
      totalStrategies,
      activeStrategies,
      inactiveStrategies,
      publicStrategies,
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
          isPublic: item.isPublic,
          updatedAtLabel: item.updatedAtLabel,

          indicatorSetId: item.indicatorSetId,
          streamKey: item.streamKey,

          strategyVersion: item.strategyVersion,
          fixedRangeWidthPct: item.fixedRangeWidthPct,
          initialSide: item.initialSide,
          breakoutConfirmBars: item.breakoutConfirmBars,
          breakoutUseHighLow: item.breakoutUseHighLow,
          atrEnabled: item.atrEnabled,
          atrPeriod: item.atrPeriod,
          atrRebalanceEnabled: item.atrRebalanceEnabled,
          entryFiltersEnabled: item.entryFiltersEnabled,
          allowCashWhenFilterFails: item.allowCashWhenFilterFails,
          gaugeEnabled: item.gaugeEnabled,
          atrWidthRuleCount: item.atrWidthRuleCount,

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

      const streamKey =
        String(selectedPool.streamKey || selectedPool.poolAddress || "")
          .trim()
          .toLowerCase() || undefined;

      const indicatorSetId = buildInternalIndicatorSetId({
        chain,
        strategyId: onchain.strategy_id,
        streamKey,
      });

      await registerStrategyDbUseCase({
        accessToken: token,
        payload: {
          chain,
          owner: ownerAddr,
          strategy_id: onchain.strategy_id,
          name,
          symbol,
          indicator_set_id: indicatorSetId,
          stream_key: streamKey,
          adapter: selectedPool.adapterAddress,
          dex_router: selectedPool.routerAddress,
          token0: selectedPool.token0Address,
          token1: selectedPool.token1Address,
          tx_hash: onchain.tx_hash,
          status: createDraft.status,
          is_public: createDraft.isPublic,
        },
      });

      await upsertStrategyParamsUseCase({
        accessToken: token,
        payload: {
          chain,
          owner: ownerAddr,
          strategy_id: onchain.strategy_id,
          name,
          symbol,
          indicator_set_id: indicatorSetId,
          stream_key: streamKey,
          status: createDraft.status,
          is_public: createDraft.isPublic,
          adapter: selectedPool.adapterAddress,
          dex_router: selectedPool.routerAddress,
          token0: selectedPool.token0Address,
          token1: selectedPool.token1Address,
          tx_hash: onchain.tx_hash,
          params: buildStrategyParamsPayload(createDraft),
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

      const paramsRes = await getStrategyParamsUseCase({
        accessToken: token,
        chain: row.chainKey,
        owner: row.owner,
        strategyId: row.id,
      });

      const params = (paramsRes?.data?.params || {}) as Record<string, any>;

      setEditDraft({
        indicatorSetId:
          String(paramsRes?.data?.indicator_set_id || row.indicatorSetId || "").trim() ||
          buildInternalIndicatorSetId({
            chain: row.chainKey,
            strategyId: row.id,
            streamKey: row.streamKey,
          }),
        streamKey: row.streamKey,

        status: paramsRes?.data?.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
        isPublic: Boolean(paramsRes?.data?.is_public),
        symbol: paramsRes?.data?.symbol || row.symbol,

        fixedRangeWidthPct:
          typeof params.fixed_range_width_pct === "number" ? params.fixed_range_width_pct : 0.2,

        breakoutDownBelowShare:
          typeof params.breakout_down_below_share === "number" ? params.breakout_down_below_share : 0.95,
        breakoutDownAboveShare:
          typeof params.breakout_down_above_share === "number" ? params.breakout_down_above_share : 0.05,
        breakoutUpBelowShare:
          typeof params.breakout_up_below_share === "number" ? params.breakout_up_below_share : 0.05,
        breakoutUpAboveShare:
          typeof params.breakout_up_above_share === "number" ? params.breakout_up_above_share : 0.95,
        breakoutConfirmBars:
          typeof params.breakout_confirm_bars === "number" ? params.breakout_confirm_bars : 3,
        breakoutUseHighLow: Boolean(params.breakout_use_high_low),

        initialSide: params.initial_side === "up" ? "up" : "down",

        atrEnabled: params.atr_enabled !== false,
        atrPeriod: typeof params.atr_period === "number" ? params.atr_period : 14,

        atrRebalanceEnabled: params.atr_rebalance_enabled !== false,
        atrRebalanceMinWidthDeltaPct:
          typeof params.atr_rebalance_min_width_delta_pct === "number"
            ? params.atr_rebalance_min_width_delta_pct
            : 0.000000000001,

        atrHysteresisEnabled: params.atr_hysteresis_enabled !== false,
        atrHysteresisGapPct:
          typeof params.atr_hysteresis_gap_pct === "number" ? params.atr_hysteresis_gap_pct : 0.0002,

        atrRebalanceCooldownBars:
          typeof params.atr_rebalance_cooldown_bars === "number" ? params.atr_rebalance_cooldown_bars : 60,
        atrRebalanceMinAgeBars:
          typeof params.atr_rebalance_min_age_bars === "number" ? params.atr_rebalance_min_age_bars : 30,

        swapFeePercent:
          typeof params.swap_fee_percent === "number" ? params.swap_fee_percent : 0.01,

        entryFiltersEnabled: params.entry_filters_enabled !== false,
        allowCashWhenFilterFails: Boolean(params.allow_cash_when_filter_fails),
        entryCooldownBars:
          typeof params.entry_cooldown_bars === "number" ? params.entry_cooldown_bars : 0,

        entryAtrQuantileWindow:
          typeof params.entry_atr_quantile_window === "number" ? params.entry_atr_quantile_window : 200,
        entryAtrQuantile:
          typeof params.entry_atr_quantile === "number" ? params.entry_atr_quantile : 0.65,

        entryTrendMaWindow:
          typeof params.entry_trend_ma_window === "number" ? params.entry_trend_ma_window : 100,
        entryMaxMaDistancePct:
          typeof params.entry_max_ma_distance_pct === "number" ? params.entry_max_ma_distance_pct : 0.02,
        entryMaxMaSlopePct:
          typeof params.entry_max_ma_slope_pct === "number" ? params.entry_max_ma_slope_pct : 0.0015,

        entryChannelWindow:
          typeof params.entry_channel_window === "number" ? params.entry_channel_window : 100,
        entryChannelPosMin:
          typeof params.entry_channel_pos_min === "number" ? params.entry_channel_pos_min : 0.2,
        entryChannelPosMax:
          typeof params.entry_channel_pos_max === "number" ? params.entry_channel_pos_max : 0.8,

        eps: typeof params.eps === "number" ? params.eps : 0.000001,
        gaugeEnabled: Boolean(params.gauge_flow_enabled),

        atrWidthRulesJson: JSON.stringify(
          Array.isArray(params.atr_width_rules) ? params.atr_width_rules : defaultAtrWidthRules(),
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

      const indicatorSetId =
        editDraft.indicatorSetId ||
        buildInternalIndicatorSetId({
          chain: selected.chainKey,
          strategyId: selected.id,
          streamKey: selected.streamKey,
        });

      await upsertStrategyParamsUseCase({
        accessToken: token,
        payload: {
          chain: selected.chainKey,
          owner: selected.owner,
          strategy_id: selected.id,
          name: selected.name,
          symbol: normalizeDisplaySymbol(editDraft.symbol),
          indicator_set_id: indicatorSetId,
          stream_key: selected.streamKey || undefined,
          status: editDraft.status,
          is_public: editDraft.isPublic,
          adapter: selected.adapterAddress || undefined,
          dex_router: selected.dexRouterAddress || undefined,
          token0: selected.token0Address || undefined,
          token1: selected.token1Address || undefined,
          params: buildStrategyParamsPayload(editDraft),
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

  function setVisibilityFilter(visibility: StrategyVisibilityFilter) {
    setFilters((prev) => ({ ...prev, visibility }));
  }

  function setQueryFilter(query: string) {
    setFilters((prev) => ({ ...prev, query }));
  }

  function resetFilters() {
    setFilters({
      chain: "all",
      status: "all",
      vaultLink: "all",
      visibility: "all",
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
    setVisibilityFilter,
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