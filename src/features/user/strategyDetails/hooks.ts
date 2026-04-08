"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";

import { listMyStrategiesUseCase } from "@/core/usecases/user/strategies/listMyStrategies.usecase";
import { getStrategyParamsUseCase } from "@/core/application/strategy/api/getStrategyParams.usecase";
import { getIndicatorSetUseCase } from "@/core/application/strategy/api/getIndicatorSet.usecase";
import { createIndicatorSetUseCase } from "@/core/application/strategy/api/createIndicatorSet.usecase";
import { upsertStrategyParamsUseCase } from "@/core/application/strategy/api/upsertStrategyParams.usecase";
import { listVaultsByOwnerUseCase } from "@/core/application/vault/api/listVaultsByOwner.usecase";

import type { StrategyDetails, StrategyEditDraft, StrategyTier, VaultUsingStrategy } from "./types";

function formatChainName(chain: "base" | "bnb"): string {
  return chain === "base" ? "Base" : "BNB";
}

function formatDexName(dex?: string | null): string {
  const value = String(dex || "").trim().toLowerCase();

  if (value === "uniswap_v3") return "Uniswap V3";
  if (value === "pancake_v3") return "Pancake V3";
  if (value === "aerodrome") return "Aerodrome";
  if (value === "quickswap") return "QuickSwap";
  if (!value) return "Unknown DEX";

  return value
    .split("_")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatRelativeTime(updatedAtIso?: string | null): string {
  if (!updatedAtIso) return "-";

  const date = new Date(updatedAtIso);
  if (Number.isNaN(date.getTime())) return "-";

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

function normalizeStatus(value?: string | null): "ACTIVE" | "INACTIVE" {
  return String(value || "").toUpperCase() === "ACTIVE" ? "ACTIVE" : "INACTIVE";
}

function parseTiers(raw: any): StrategyTier[] {
  if (!Array.isArray(raw)) return [];

  return raw.map((tier) => ({
    name: String(tier?.name || ""),
    atrPctThreshold: Number(tier?.atr_pct_threshold ?? 0),
    atrPctThresholdDown: Number(tier?.atr_pct_threshold_down ?? 0),
    barsRequired: Number(tier?.bars_required ?? 0),
    maxMajorSidePct: Number(tier?.max_major_side_pct ?? 0),
    allowedFrom: Array.isArray(tier?.allowed_from) ? tier.allowed_from.map(String) : [],
  }));
}

function defaultDraft(strategy: StrategyDetails): StrategyEditDraft {
  return {
    status: strategy.status,
    isPublic: strategy.isPublic,
    symbol: strategy.symbol,

    indicatorSource: strategy.indicatorSource,
    emaFast: strategy.emaFast,
    emaSlow: strategy.emaSlow,
    atrWindow: strategy.atrWindow,

    skewLowPct: Number(strategy.rawParams?.skew_low_pct ?? 0.09),
    skewHighPct: Number(strategy.rawParams?.skew_high_pct ?? 0.01),
    eps: Number(strategy.rawParams?.eps ?? 0.000001),
    cooloffBars: Number(strategy.rawParams?.cooloff_bars ?? 1),
    breakoutConfirmBars: Number(strategy.rawParams?.breakout_confirm_bars ?? 1),
    gaugeEnabled: Boolean(strategy.rawParams?.gauge_flow_enabled ?? false),

    tiersJson: JSON.stringify(
      {
        tiers: Array.isArray(strategy.rawParams?.tiers) ? strategy.rawParams.tiers : [],
      },
      null,
      2
    ),
  };
}

function parseTiersJson(text: string) {
  const parsed = JSON.parse(text);

  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (parsed && Array.isArray(parsed.tiers)) {
    return parsed.tiers;
  }

  throw new Error("tiersJson must be a JSON array or an object with a 'tiers' array.");
}

export function useStrategyDetails(strategyId?: string) {
  const { authenticated, getAccessToken } = usePrivy();
  const { ownerAddr } = useOwnerAddress();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [strategy, setStrategy] = useState<StrategyDetails | null>(null);
  const [vaults, setVaults] = useState<VaultUsingStrategy[]>([]);
  const [vaultFilter, setVaultFilter] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editDraft, setEditDraft] = useState<StrategyEditDraft | null>(null);

  const load = useCallback(async () => {
    if (!strategyId) {
      setError("Missing strategy id.");
      setLoading(false);
      return;
    }

    if (!authenticated || !ownerAddr) {
      setError("Connect your wallet to view strategy details.");
      setLoading(false);
      return;
    }

    const numericId = Number(strategyId);
    if (!Number.isFinite(numericId) || numericId <= 0) {
      setError("Invalid strategy id.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Missing access token. Please login again.");
      }

      const myStrategies = await listMyStrategiesUseCase({
        accessToken: token,
        owner: ownerAddr,
        chains: ["base", "bnb"],
      });

      const selected = myStrategies.find((item) => item.id === numericId);
      if (!selected) {
        throw new Error("Strategy not found for the connected wallet.");
      }

      const paramsRes = await getStrategyParamsUseCase({
        accessToken: token,
        chain: selected.chainKey,
        owner: ownerAddr,
        strategyId: numericId,
      });

      const paramsDoc = paramsRes?.data;
      if (!paramsDoc) {
        throw new Error("Strategy params were not found.");
      }

      let indicatorSet: any = null;
      try {
        indicatorSet = await getIndicatorSetUseCase({
          accessToken: token,
          cfgHash: selected.indicatorSetId,
        });
      } catch {
        indicatorSet = null;
      }

      const vaultResponses = await Promise.all(
        (["base", "bnb"] as const).map(async (chain) => {
          try {
            return await listVaultsByOwnerUseCase({
              accessToken: token,
              query: {
                owner: ownerAddr,
                chain,
                limit: 500,
                offset: 0,
              },
            });
          } catch {
            return { ok: false, data: [] as any[] };
          }
        })
      );

      const matchedVaults = vaultResponses
        .flatMap((res) => res?.data || [])
        .filter((vault) => Number(vault?.strategy_id || 0) === numericId);

      const mappedVaults: VaultUsingStrategy[] = matchedVaults.map((vault) => {
        const chainKey = String(vault.chain || "").toLowerCase() === "bnb" ? "bnb" : "base";
        const aliasOrAddress = vault.alias || vault.address;

        return {
          id: String(vault.id || vault.alias || vault.address),
          alias: String(vault.alias || ""),
          name: String(vault.name || vault.alias || "Unnamed Vault"),
          address: String(vault.address || ""),
          chainKey,
          chainName: formatChainName(chainKey),
          dexName: formatDexName(vault.dex),
          status: vault.is_active ? "active" : "paused",
          href: `/vaults/${encodeURIComponent(aliasOrAddress)}`,
        };
      });

      const builtStrategy: StrategyDetails = {
        id: numericId,
        name: String(paramsDoc.name || selected.name),
        symbol: String(paramsDoc.symbol || selected.symbol),
        status: normalizeStatus(paramsDoc.status),
        isPublic: Boolean(paramsDoc.is_public ?? false),

        chainKey: selected.chainKey,
        chainName: selected.chainName,

        dexKey: selected.dexKey || paramsDoc.dex || null,
        dexName: selected.dexName,

        pairLabel: selected.poolPairLabel,
        feeTierLabel: selected.feeLabel,

        owner: selected.owner,
        strategyId: numericId,

        indicatorSetId: String(paramsDoc.indicator_set_id || selected.indicatorSetId),
        indicatorSource: String(indicatorSet?.source || "binance"),
        indicatorStreamKey: String(indicatorSet?.stream_key || ""),
        marketSymbol: String(indicatorSet?.symbol || ""),

        emaFast: Number(indicatorSet?.ema_fast || 0),
        emaSlow: Number(indicatorSet?.ema_slow || 0),
        atrWindow: Number(indicatorSet?.atr_window || selected.atrPeriod || 0),

        vaultAlias: String(paramsDoc.alias || selected.vaultAlias || "") || null,
        vaultHref: paramsDoc.alias
          ? `/vaults/${encodeURIComponent(String(paramsDoc.alias))}`
          : selected.vaultAlias
            ? `/vaults/${encodeURIComponent(String(selected.vaultAlias))}`
            : mappedVaults[0]?.href || null,

        adapterAddress: paramsDoc.adapter || selected.adapterAddress || null,
        dexRouterAddress: paramsDoc.dex_router || selected.dexRouterAddress || null,
        token0Address: paramsDoc.token0 || selected.token0Address || null,
        token1Address: paramsDoc.token1 || selected.token1Address || null,
        txHash: paramsDoc.tx_hash || null,

        createdAtIso: paramsDoc.created_at_iso || null,
        updatedAtIso: paramsDoc.updated_at_iso || null,
        updatedAtLabel: formatRelativeTime(paramsDoc.updated_at_iso),

        rawParams: paramsDoc.params || {},
        tiers: parseTiers(paramsDoc.params?.tiers),
      };

      setStrategy(builtStrategy);
      setVaults(mappedVaults);
    } catch (err: any) {
      setStrategy(null);
      setVaults([]);
      setError(err?.message || "Failed to load strategy details.");
    } finally {
      setLoading(false);
    }
  }, [authenticated, getAccessToken, ownerAddr, strategyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredVaults = useMemo(() => {
    const q = vaultFilter.trim().toLowerCase();
    if (!q) return vaults;

    return vaults.filter((vault) => {
      const hay = `${vault.name} ${vault.alias} ${vault.address} ${vault.chainName} ${vault.dexName} ${vault.status}`.toLowerCase();
      return hay.includes(q);
    });
  }, [vaultFilter, vaults]);

  function openEditDrawer() {
    if (!strategy) return;
    setEditDraft(defaultDraft(strategy));
    setEditError("");
    setEditOpen(true);
  }

  function closeEditDrawer() {
    setEditOpen(false);
    setEditError("");
  }

  async function saveEdit() {
    if (!strategy || !editDraft) return;

    setEditSaving(true);
    setEditError("");

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Missing access token. Please login again.");
      }

      const indicatorSet = await createIndicatorSetUseCase({
        accessToken: token,
        payload: {
          symbol: strategy.marketSymbol,
          source: editDraft.indicatorSource.trim().toLowerCase() || "binance",
          ema_fast: Number(editDraft.emaFast),
          ema_slow: Number(editDraft.emaSlow),
          atr_window: Number(editDraft.atrWindow),
        },
      });

      await upsertStrategyParamsUseCase({
        accessToken: token,
        payload: {
          chain: strategy.chainKey,
          owner: strategy.owner,
          strategy_id: strategy.strategyId,
          name: strategy.name,
          symbol: editDraft.symbol.trim().toUpperCase(),
          indicator_set_id: indicatorSet.cfg_hash,
          stream_key: indicatorSet.stream_key,
          status: editDraft.status,
          is_public: editDraft.isPublic,
          adapter: strategy.adapterAddress || undefined,
          dex_router: strategy.dexRouterAddress || undefined,
          token0: strategy.token0Address || undefined,
          token1: strategy.token1Address || undefined,
          tx_hash: strategy.txHash || undefined,
          params: {
            ...strategy.rawParams,
            eps: Number(editDraft.eps),
            cooloff_bars: Number(editDraft.cooloffBars),
            breakout_confirm_bars: Number(editDraft.breakoutConfirmBars),
            gauge_flow_enabled: Boolean(editDraft.gaugeEnabled),
            skew_low_pct: Number(editDraft.skewLowPct),
            skew_high_pct: Number(editDraft.skewHighPct),
            tiers: parseTiersJson(editDraft.tiersJson),
          },
        },
      });

      setEditOpen(false);
      await load();
    } catch (err: any) {
      setEditError(err?.message || "Failed to save strategy.");
    } finally {
      setEditSaving(false);
    }
  }

  return {
    loading,
    error,

    strategy,
    vaults,
    vaultFilter,
    setVaultFilter,
    filteredVaults,

    editOpen,
    editLoading,
    editSaving,
    editError,
    editDraft,
    setEditDraft,
    openEditDrawer,
    closeEditDrawer,
    saveEdit,

    refresh: load,
  };
}