"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

import { useOwnerAddress } from "@/hooks/useOwnerAddress";

import { listVaultsExploreUseCase } from "@/core/usecases/user/vaults/listVaultsExplore.usecase";
import { listStrategiesExploreUseCase } from "@/core/usecases/user/strategies/listStrategiesExplore.usecase";
import { listMyStrategiesUseCase } from "@/core/usecases/user/strategies/listMyStrategies.usecase";

import type { HomeChainScope, HomeKpi, HomeSnapshot, TopStrategyRow, TopVaultRow } from "./types";
import * as chainRuntimeConfig from "@/shared/config/chainRuntime";
import { listVaultEpisodeSummariesUseCase } from "@/core/usecases/user/strategies/listVaultEpisodeSummaries.usecase";

type RawVault = {
  id?: string;
  alias?: string;
  name?: string;
  address: string;

  token0_symbol?: string | null;
  token1_symbol?: string | null;

  chain: string;
  dex: string;

  tvl_usd?: number | null;
  tvl_change_24h_pct?: number | null;

  apy_pct?: number | null;
  apr_pct?: number | null;

  status?: string | null;
  is_active?: boolean;

  is_mine?: boolean;
  my_position_usd?: number | null;
};

type RawStrategy = {
  id: string;
  strategyId: number;
  name?: string;
  symbol?: string;
  indicatorSetId?: string | null;
  chain: "base" | "bnb";
  status: "ACTIVE" | "INACTIVE";
  alias?: string | null;
  updatedAtIso?: string | null;
  updatedAt?: number | null;
  isPublic?: boolean;
};

function resolveCurrentChainKey(): "base" | "bnb" {
  const candidates = [
    (chainRuntimeConfig as any)?.CURRENT_CHAIN_KEY,
    (chainRuntimeConfig as any)?.chainKey,
    (chainRuntimeConfig as any)?.defaultChainKey,
    (chainRuntimeConfig as any)?.runtime?.chainKey,
    (chainRuntimeConfig as any)?.runtime?.defaultChainKey,
  ];

  const raw = String(candidates.find((value) => String(value || "").trim()) || "base").toLowerCase();
  return raw === "bnb" ? "bnb" : "base";
}

function chainLabel(chain: string) {
  return chain === "bnb" ? "BNB" : "Base";
}

function dexLabel(dex?: string | null) {
  const value = String(dex || "").trim().toLowerCase();

  if (value === "uniswap_v3") return "Uniswap V3";
  if (value === "pancake_v3" || value === "pancakeswap_v3") return "PancakeSwap V3";
  if (value === "aerodrome") return "Aerodrome";
  if (!value) return "Unknown DEX";

  return value
    .split("_")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

function relativeTimeLabel(updatedAtIso?: string | null, updatedAt?: number | null) {
  let date: Date | null = null;

  if (updatedAtIso) {
    const parsed = new Date(updatedAtIso);
    if (!Number.isNaN(parsed.getTime())) date = parsed;
  }

  if (!date && typeof updatedAt === "number" && updatedAt > 0) {
    const parsed = new Date(updatedAt * 1000);
    if (!Number.isNaN(parsed.getTime())) date = parsed;
  }

  if (!date) return "-";

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

function formatUsdCompact(value?: number | null) {
  if (value == null || !Number.isFinite(value)) return "$0";

  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

function formatPct(value?: number | null, digits = 2) {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

function avg(values: Array<number | null | undefined>) {
  const valid = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (!valid.length) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function sum(values: Array<number | null | undefined>) {
  return values.reduce<number>(
    (acc, value) => acc + (typeof value === "number" && Number.isFinite(value) ? value : 0),
    0
  );
}

function normalizeVaultStatus(item: RawVault): "active" | "paused" | "deprecated" {
  const raw = String(item.status || "").toLowerCase();
  if (raw === "active") return "active";
  if (raw === "deprecated") return "deprecated";
  if (raw === "paused") return "paused";
  return item.is_active ? "active" : "paused";
}

export function useUserHome() {
  const { authenticated, getAccessToken } = usePrivy();
  const { ownerAddr } = useOwnerAddress();

  const currentChainKey = useMemo(() => resolveCurrentChainKey(), []);

  const [chainScope, setChainScope] = useState<HomeChainScope>("current");
  const [vaultQuery, setVaultQuery] = useState("");
  const [strategyQuery, setStrategyQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rawVaults, setRawVaults] = useState<RawVault[]>([]);
  const [rawStrategies, setRawStrategies] = useState<RawStrategy[]>([]);
  const [myStrategiesCount, setMyStrategiesCount] = useState<Record<"base" | "bnb", number>>({ base: 0, bnb: 0 });
  const [episodeSummaryMap, setEpisodeSummaryMap] = useState<Record<string, { fee24hUsd: number }>>({});

  const walletConnected = Boolean(authenticated && ownerAddr);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [vaultsRes, strategiesRes] = await Promise.all([
        listVaultsExploreUseCase({
          owner: ownerAddr || undefined,
          limit: 500,
        }),
        listStrategiesExploreUseCase({
          query: {
            limit: 500,
            offset: 0,
          },
        }),
      ]);

      const vaults = Array.isArray(vaultsRes?.data) ? (vaultsRes.data as RawVault[]) : [];
      const strategiesRows = (strategiesRes || []) as RawStrategy[];

      setRawVaults(vaults);
      setRawStrategies(strategiesRows);

      if (walletConnected) {
        try {
          const token = await getAccessToken();
          if (token) {
            const mine = await listMyStrategiesUseCase({
              accessToken: token,
              owner: ownerAddr!,
              chains: ["base", "bnb"],
            });

            const counts = { base: 0, bnb: 0 as number };
            for (const item of mine || []) {
              const chain = String(item.chainKey || "").toLowerCase() === "bnb" ? "bnb" : "base";
              counts[chain] += 1;
            }
            setMyStrategiesCount(counts);
          } else {
            setMyStrategiesCount({ base: 0, bnb: 0 });
          }
        } catch {
          setMyStrategiesCount({ base: 0, bnb: 0 });
        }
      } else {
        setMyStrategiesCount({ base: 0, bnb: 0 });
      }

      const refs = vaults
        .filter((item) => item.alias && item.dex)
        .map((item) => ({
          dex: String(item.dex),
          alias: String(item.alias),
        }));

      if (refs.length) {
        try {
          const summaries = await listVaultEpisodeSummariesUseCase({
            items: refs,
          });

          const mapped: Record<string, { fee24hUsd: number }> = {};
          for (const row of summaries) {
            mapped[`${row.dex}::${row.alias}`] = {
              fee24hUsd: Number(row.fee_24h_usd || 0),
            };
          }
          setEpisodeSummaryMap(mapped);
        } catch {
          setEpisodeSummaryMap({});
        }
      } else {
        setEpisodeSummaryMap({});
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load home data.");
      setRawVaults([]);
      setRawStrategies([]);
      setEpisodeSummaryMap({});
      setMyStrategiesCount({ base: 0, bnb: 0 });
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, ownerAddr, walletConnected]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const scopedVaults = useMemo(() => {
    if (chainScope === "all") return rawVaults;
    return rawVaults.filter((item) => String(item.chain || "").toLowerCase() === currentChainKey);
  }, [chainScope, currentChainKey, rawVaults]);

  const scopedStrategies = useMemo(() => {
    const publicRows = rawStrategies.filter((item) => Boolean(item.isPublic));
    if (chainScope === "all") return publicRows;
    return publicRows.filter((item) => item.chain === currentChainKey);
  }, [chainScope, currentChainKey, rawStrategies]);

  const myVaults = useMemo(() => scopedVaults.filter((item) => Boolean(item.is_mine)), [scopedVaults]);

  const fees24hUsd = useMemo(() => {
    return scopedVaults.reduce((acc, vault) => {
      if (!vault.alias || !vault.dex) return acc;
      const key = `${vault.dex}::${vault.alias}`;
      return acc + Number(episodeSummaryMap[key]?.fee24hUsd || 0);
    }, 0);
  }, [episodeSummaryMap, scopedVaults]);

  const avgApy = useMemo(() => avg(scopedVaults.map((item) => item.apy_pct)), [scopedVaults]);
  const avgApr = useMemo(() => avg(scopedVaults.map((item) => item.apr_pct)), [scopedVaults]);
  const totalTvlUsd = useMemo(() => sum(scopedVaults.map((item) => item.tvl_usd)), [scopedVaults]);

  const healthLabel = useMemo(() => {
    const total = scopedVaults.length;
    if (total === 0) return "N/A";
    const active = scopedVaults.filter((item) => normalizeVaultStatus(item) === "active").length;
    const ratio = active / total;
    if (ratio >= 0.8) return "OK";
    if (ratio >= 0.5) return "Watch";
    return "Risk";
  }, [scopedVaults]);

  const kpis = useMemo<HomeKpi[]>(() => {
    return [
      {
        id: "tvl",
        label: "Total TVL",
        value: formatUsdCompact(totalTvlUsd),
        tone: "blue",
      },
      {
        id: "vaults",
        label: "Vaults",
        value: String(scopedVaults.length),
        tone: "cyan",
      },
      {
        id: "strategies",
        label: "Strategies",
        value: String(scopedStrategies.length),
        tone: "purple",
      },
      {
        id: "fees",
        label: "Fees (24h)",
        value: formatUsdCompact(fees24hUsd),
        tone: "green",
      },
      {
        id: "apy",
        label: "Avg APY",
        value: formatPct(avgApy),
        tone: "amber",
      },
      {
        id: "health",
        label: "Health",
        value: healthLabel,
        tone: healthLabel === "OK" ? "green" : "amber",
      },
    ];
  }, [avgApy, fees24hUsd, healthLabel, scopedStrategies.length, scopedVaults.length, totalTvlUsd]);

  const snapshot = useMemo<HomeSnapshot>(() => {
    const myPositionUsd = sum(myVaults.map((item) => item.my_position_usd));
    const myAvgApr = avg(myVaults.map((item) => item.apr_pct));
    const myAvgApy = avg(myVaults.map((item) => item.apy_pct));
    const myStrategies =
      chainScope === "all"
        ? myStrategiesCount.base + myStrategiesCount.bnb
        : myStrategiesCount[currentChainKey];

    return {
      items: [
        {
          id: "position",
          label: "My Position Value",
          value: formatUsdCompact(myPositionUsd),
          hint: `${myVaults.length} vault(s) in scope`,
          tone: "white",
        },
        {
          id: "vaults",
          label: "My Vaults",
          value: String(myVaults.length),
          hint: chainScope === "all" ? "All chains" : chainLabel(currentChainKey),
          tone: "cyan",
        },
        {
          id: "strategies",
          label: "My Strategies",
          value: String(myStrategies),
          hint: "Registered strategies",
          tone: "blue",
        },
        {
          id: "apr",
          label: "Avg APR",
          value: formatPct(myAvgApr),
          hint: "My vault positions",
          tone: "white",
        },
        {
          id: "apy",
          label: "Avg APY",
          value: formatPct(myAvgApy),
          hint: "My vault positions",
          tone: "green",
        },
      ],
    };
  }, [chainScope, currentChainKey, myStrategiesCount, myVaults]);

  const filteredVaults = useMemo<TopVaultRow[]>(() => {
    const q = vaultQuery.trim().toLowerCase();

    const items = [...scopedVaults]
      .sort((a, b) => (Number(b.tvl_usd || 0) - Number(a.tvl_usd || 0)))
      .filter((item) => {
        if (!q) return true;

        const haystack = [
          item.name || "",
          item.alias || "",
          item.address || "",
          item.token0_symbol || "",
          item.token1_symbol || "",
          item.dex || "",
          item.chain || "",
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(q);
      })
      .slice(0, 8);

    return items.map((item) => ({
      id: String(item.id || item.alias || item.address),
      name:
        String(item.name || "").trim() ||
        `${String(item.token0_symbol || "T0")}/${String(item.token1_symbol || "T1")}`,
      address: item.address,
      href: `/vaults/${encodeURIComponent(item.address)}`,
      subtitle: item.alias || `${chainLabel(item.chain)} • ${dexLabel(item.dex)}`,
      dexLabel: dexLabel(item.dex),
      pairSymbols: [String(item.token0_symbol || "T0"), String(item.token1_symbol || "T1")].filter(Boolean),
      tvl: formatUsdCompact(item.tvl_usd),
      tvlDelta:
        typeof item.tvl_change_24h_pct === "number"
          ? `${item.tvl_change_24h_pct >= 0 ? "+" : ""}${item.tvl_change_24h_pct.toFixed(1)}% (24h)`
          : undefined,
      apy: formatPct(item.apy_pct),
      apr: formatPct(item.apr_pct),
      status: normalizeVaultStatus(item),
    }));
  }, [scopedVaults, vaultQuery]);

  const filteredStrategies = useMemo<TopStrategyRow[]>(() => {
    const q = strategyQuery.trim().toLowerCase();

    const items = [...scopedStrategies]
      .filter((item) => {
        if (!q) return true;

        const haystack = [
          item.name || "",
          item.symbol || "",
          item.indicatorSetId || "",
          item.alias || "",
          item.chain || "",
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(q);
      })
      .slice(0, 8);

    return items.map((item) => ({
      id: item.id,
      name: item.name || `Strategy ${item.strategyId}`,
      symbol: item.symbol || "-",
      indicatorSetLabel: item.indicatorSetId || "-",
      chainLabel: chainLabel(item.chain),
      status: item.status === "ACTIVE" ? "active" : "inactive",
      linkedVaultLabel: item.alias || undefined,
      updatedAtLabel: relativeTimeLabel(item.updatedAtIso, item.updatedAt),
      href: `/strategies/${encodeURIComponent(item.id)}`,
    }));
  }, [scopedStrategies, strategyQuery]);

  return {
    loading,
    error,
    walletConnected,

    chainScope,
    setChainScope,

    vaultQuery,
    setVaultQuery,

    strategyQuery,
    setStrategyQuery,

    kpis,
    snapshot,

    filteredVaults,
    filteredStrategies,

    refresh,
  };
}