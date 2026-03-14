"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ConnectedWallet } from "@privy-io/react-auth";
import { usePrivy } from "@privy-io/react-auth";

import {
  listStrategiesUseCase,
  type StrategyListItem,
} from "@/core/usecases/user/strategies/listStrategies.usecase";
import { listVaultsByOwnerUseCase } from "@/core/application/vault/api/listVaultsByOwner.usecase";
import { registerClientVault } from "@/core/application/vault/api/registerClientVault.usecase";
import { createClientVaultOnchain } from "@/core/application/vault/onchain/createClientVault.usecase";
import type { VaultRegistryRecord } from "@/core/infra/api/api-lp/vault";
import { useActiveWallet } from "@/hooks/useActiveWallet";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { getActiveChainRuntime } from "@/shared/config/chainRuntime";
import {
  resolveVaultCreationPreview,
} from "@/core/usecases/user/vaults/resolveVaultCreationPreview.usecase";

import type {
  ConnectedContext,
  CreateVaultProgress,
  CreateVaultResult,
  MyVaultItem,
  MyVaultsKpis,
  StrategyOption,
  VaultCreateForm,
} from "./types";

const INITIAL_FORM: VaultCreateForm = {
  strategyId: "",
  vaultName: "",
  description: "",
  swapPoolsJson: "",
  rewardSwapPreview: "Reward swap config preview only",
  jobConfigPreview: "Job config preview only",
};

function normalizeText(value?: unknown): string {
  return String(value ?? "").trim();
}

function normalizeLower(value?: unknown): string {
  return normalizeText(value).toLowerCase();
}

function normalizeStrategyStatus(value?: unknown): "ACTIVE" | "INACTIVE" {
  return normalizeText(value).toUpperCase() === "ACTIVE" ? "ACTIVE" : "INACTIVE";
}

function formatAddress(value: string): string {
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function formatRelativeTime(input?: string | number | null): string {
  if (!input) return "—";

  const date =
    typeof input === "number"
      ? new Date(input)
      : new Date(String(input));

  if (Number.isNaN(date.getTime())) return "—";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));

  if (diffSec < 60) return "just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? "" : "s"} ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString();
}

function formatChainLabel(chainKey?: string | null): string {
  const key = normalizeLower(chainKey);

  if (key === "base") return "Base";
  if (key === "bnb") return "BNB Chain";
  if (key === "ethereum") return "Ethereum";
  if (key === "polygon") return "Polygon";
  if (key === "arbitrum") return "Arbitrum";

  if (!key) return "Unknown";

  return key
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDexLabel(dexKey?: string | null): string {
  const key = normalizeLower(dexKey);

  if (key === "uniswap_v3") return "Uniswap V3";
  if (key === "pancake_v3") return "Pancake V3";
  if (key === "aerodrome") return "Aerodrome";
  if (key === "quickswap") return "QuickSwap";

  if (!key) return "Unknown";

  return key
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function buildExplorerUrl(chainKey: string, address: string): string {
  const key = normalizeLower(chainKey);

  if (key === "base") return `https://basescan.org/address/${address}`;
  if (key === "bnb") return `https://bscscan.com/address/${address}`;
  if (key === "ethereum") return `https://etherscan.io/address/${address}`;
  if (key === "polygon") return `https://polygonscan.com/address/${address}`;
  if (key === "arbitrum") return `https://arbiscan.io/address/${address}`;

  return `https://basescan.org/address/${address}`;
}

function safeJsonParseObj(input: string): { ok: true; value?: Record<string, any> } | { ok: false; error: string } {
  const raw = normalizeText(input);
  if (!raw) return { ok: true, value: undefined };

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { ok: false, error: "Swap Pools JSON must be a valid JSON object." };
    }
    return { ok: true, value: parsed as Record<string, any> };
  } catch {
    return { ok: false, error: "Swap Pools JSON is invalid." };
  }
}

function getRuntimeChainKey(runtime: any): string {
  return normalizeLower(runtime?.chainKey || runtime?.chain_key || runtime?.chain || runtime?.key || "base");
}

function getRuntimeChainName(runtime: any): string {
  return (
    normalizeText(runtime?.label || runtime?.displayName || runtime?.name) ||
    formatChainLabel(getRuntimeChainKey(runtime))
  );
}

function getRuntimeRpcUrl(runtime: any): string {
  return normalizeText(runtime?.rpcUrl || runtime?.rpc_url || runtime?.rpc || "");
}

function extractOwnerAddress(ownerHookValue: any, wallet: ConnectedWallet | null): string {
  if (typeof ownerHookValue === "string" && ownerHookValue) {
    return ownerHookValue;
  }

  if (ownerHookValue?.ownerAddress) return String(ownerHookValue.ownerAddress);
  if (ownerHookValue?.address) return String(ownerHookValue.address);
  if (ownerHookValue?.ownerAddr) return String(ownerHookValue.ownerAddr);

  if (wallet?.address) return String(wallet.address);

  return "";
}

function extractActiveWallet(activeWalletHookValue: any): ConnectedWallet | null {
  if (!activeWalletHookValue) return null;

  if (activeWalletHookValue?.address && activeWalletHookValue?.walletClientType) {
    return activeWalletHookValue as ConnectedWallet;
  }

  if (activeWalletHookValue?.activeWallet) {
    return activeWalletHookValue.activeWallet as ConnectedWallet;
  }

  if (activeWalletHookValue?.wallet) {
    return activeWalletHookValue.wallet as ConnectedWallet;
  }

  return null;
}

async function resolveAccessToken(
  authHookValue: any,
  getAccessToken?: (() => Promise<string | null>) | undefined,
): Promise<string | null> {
  if (typeof authHookValue?.ensureTokenOrLogin === "function") {
    const token = await authHookValue.ensureTokenOrLogin();
    return token ? String(token) : null;
  }

  if (typeof authHookValue?.getAccessToken === "function") {
    const token = await authHookValue.getAccessToken();
    return token ? String(token) : null;
  }

  if (typeof authHookValue?.getToken === "function") {
    const token = await authHookValue.getToken();
    return token ? String(token) : null;
  }

  if (typeof authHookValue?.accessToken === "string" && authHookValue.accessToken) {
    return String(authHookValue.accessToken);
  }

  if (typeof getAccessToken === "function") {
    const token = await getAccessToken();
    return token ? String(token) : null;
  }

  return null;
}

function mapVaultRecordToItem(params: {
  record: VaultRegistryRecord;
  strategiesMap: Map<string, StrategyOption>;
}): MyVaultItem {
  const { record, strategiesMap } = params;

  const strategyId = String(record.strategy_id ?? "");
  const strategy = strategiesMap.get(strategyId);

  const chainKey = normalizeLower(record.chain || strategy?.chainKey || "base");
  const chainName = strategy?.chainName || formatChainLabel(chainKey);
  const dexName = strategy?.dexName || formatDexLabel(record.dex);

  return {
    id: normalizeText(record.id || record.address || record.alias),
    name: normalizeText(record.name || record.alias || "Vault"),
    subtitle: normalizeText(record.description || record.alias || "Registered vault"),
    address: normalizeText(record.address),
    strategyName: strategy?.name || `Strategy #${strategyId || "—"}`,
    strategyId,
    marketPair: strategy?.marketPair || "—",
    chainName,
    dexName,
    status: record.is_active ? "active" : "inactive",
    rangeState: "na",
    currentValueUsd: null,
    pnlPct: null,
    updatedLabel: formatRelativeTime(
      record.updated_at_iso || record.created_at_iso || record.updated_at || record.created_at,
    ),
    explorerUrl: buildExplorerUrl(chainKey, normalizeText(record.address)),
    detailsHref: `/vaults/${normalizeText(record.address)}`,
  };
}

function mapDbStrategyToOption(params: {
  record: StrategyListItem;
  ownerAddress: string;
  runtimeRpcUrl: string;
}): Promise<StrategyOption> {
  const { record, ownerAddress, runtimeRpcUrl } = params;

  return resolveVaultCreationPreview({
    adapterAddress: normalizeText(record.adapter),
    token0: normalizeText(record.token0),
    token1: normalizeText(record.token1),
    fallbackChainKey: normalizeText(record.chain),
    fallbackDexKey: normalizeText(record.dex),
    fallbackRpcUrl: runtimeRpcUrl,
  }).then((preview) => {
    const dbStatus = normalizeStrategyStatus(record.status);

    return {
      id: String(record.strategy_id ?? ""),
      name: normalizeText(record.name || `Strategy #${record.strategy_id}`),
      symbol: normalizeText(record.symbol || preview.marketPair.replace("/", "-")),
      description: normalizeText(record.description),
      status: dbStatus === "ACTIVE" ? "active" : "inactive",

      ownerAddress,

      adapter: normalizeText(record.adapter),
      dexRouter: normalizeText(record.dex_router),
      token0: normalizeText(record.token0),
      token1: normalizeText(record.token1),

      chainKey: normalizeLower(record.chain || preview.chainKey),
      chainName: preview.chainName || formatChainLabel(record.chain),

      dexKey: normalizeLower(record.dex || preview.dexKey),
      dexName: preview.dexName || formatDexLabel(record.dex),

      marketPair: preview.marketPair,
      parToken: preview.parToken,

      poolAddress: preview.poolAddress,
      nfpmAddress: preview.nfpmAddress,
      gaugeAddress: preview.gaugeAddress,
      rewardTokenAddress: preview.rewardTokenAddress,

      rpcUrl: preview.rpcUrl,
      version: preview.version,

      adapterCompatible:
        Boolean(preview.poolAddress) &&
        Boolean(preview.nfpmAddress) &&
        Boolean(normalizeText(record.adapter)),
    };
  });
}

export function useMyVaults() {
  const { authenticated, login, getAccessToken } = usePrivy();

  const activeWalletHookValue = useActiveWallet() as any;
  const authHookValue = useAuthToken() as any;
  const ownerHookValue = useOwnerAddress() as any;

  const activeWallet = extractActiveWallet(activeWalletHookValue);
  const ownerAddress = extractOwnerAddress(ownerHookValue, activeWallet);

  const [search, setSearch] = useState("");
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [lastRefreshAt, setLastRefreshAt] = useState<Date>(new Date());

  const [form, setForm] = useState<VaultCreateForm>(INITIAL_FORM);

  const [vaults, setVaults] = useState<MyVaultItem[]>([]);
  const [strategies, setStrategies] = useState<StrategyOption[]>([]);
  const [connectedContext, setConnectedContext] = useState<ConnectedContext>({
    ownerAddress: ownerAddress || "",
    chainName: "—",
    chainKey: "base",
  });

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pageError, setPageError] = useState<string>("");

  const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string>("");
  const [createProgress, setCreateProgress] = useState<CreateVaultProgress | null>(null);
  const [createResult, setCreateResult] = useState<CreateVaultResult | null>(null);

  const filteredVaults = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return vaults;

    return vaults.filter((vault) =>
      [
        vault.name,
        vault.subtitle,
        vault.address,
        vault.strategyName,
        vault.strategyId,
        vault.marketPair,
        vault.chainName,
        vault.dexName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [search, vaults]);

  const activeStrategies = useMemo(
    () => strategies.filter((item) => item.status === "active"),
    [strategies],
  );

  const kpis = useMemo<MyVaultsKpis>(() => {
    const totalVaults = vaults.length;
    const activeVaults = vaults.filter((item) => item.status === "active").length;
    const inactiveVaults = vaults.filter((item) => item.status === "inactive").length;
    const chains = new Set(vaults.map((item) => item.chainName)).size;
    const dexes = new Set(vaults.map((item) => item.dexName)).size;
    const totalValueUsd = vaults.reduce((acc, item) => acc + Number(item.currentValueUsd || 0), 0);

    return {
      totalVaults,
      activeVaults,
      inactiveVaults,
      chains,
      dexes,
      totalValueUsd,
    };
  }, [vaults]);

  const selectedStrategy =
    strategies.find((item) => item.id === form.strategyId) ??
    activeStrategies[0] ??
    null;

  const setFormField = useCallback(
    <K extends keyof VaultCreateForm>(field: K, value: VaultCreateForm[K]) => {
      setForm((current) => ({
        ...current,
        [field]: value,
      }));
    },
    [],
  );

  const resetCreateForm = useCallback((strategyList: StrategyOption[]) => {
    const firstActive = strategyList.find((item) => item.status === "active");

    setForm({
      ...INITIAL_FORM,
      strategyId: firstActive?.id ?? "",
    });
    setIsAdvancedOpen(false);
  }, []);

  const loadPageData = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = Boolean(options?.silent);

      if (!ownerAddress) {
        const runtime = await getActiveChainRuntime().catch(() => null);
        setConnectedContext({
          ownerAddress: "",
          chainKey: getRuntimeChainKey(runtime),
          chainName: getRuntimeChainName(runtime),
        });
        setVaults([]);
        setStrategies([]);
        setPageError("");
        setIsPageLoading(false);
        return;
      }

      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsPageLoading(true);
      }

      setPageError("");

      try {
        const runtime = await getActiveChainRuntime();
        const runtimeChainKey = getRuntimeChainKey(runtime);
        const runtimeChainName = getRuntimeChainName(runtime);
        const runtimeRpcUrl = getRuntimeRpcUrl(runtime);

        setConnectedContext({
          ownerAddress,
          chainKey: runtimeChainKey,
          chainName: runtimeChainName,
        });

        const token = await resolveAccessToken(authHookValue, getAccessToken);
        if (!token) {
          throw new Error("Missing access token. Please login again.");
        }

        const strategyResponse = await listStrategiesUseCase({
          accessToken: token,
          query: {
            chain: runtimeChainKey,
            owner: ownerAddress,
          },
        });

        if (!strategyResponse?.ok) {
          throw new Error(strategyResponse?.message || "Failed to load strategies.");
        }

        const resolvedStrategies = await Promise.all(
          (strategyResponse.data || []).map((record) =>
            mapDbStrategyToOption({
              record,
              ownerAddress,
              runtimeRpcUrl,
            }),
          ),
        );

        setStrategies(resolvedStrategies);

        setForm((current) => {
          const currentExists = current.strategyId
            ? resolvedStrategies.some((item) => item.id === current.strategyId && item.status === "active")
            : false;

          return {
            ...current,
            strategyId: currentExists
              ? current.strategyId
              : resolvedStrategies.find((item) => item.status === "active")?.id ?? "",
          };
        });

        const vaultsResponse = await listVaultsByOwnerUseCase({
          accessToken: token,
          query: {
            owner: ownerAddress,
          },
        });

        if (!vaultsResponse?.ok) {
          throw new Error(vaultsResponse?.message || "Failed to load vaults.");
        }

        const strategyMap = new Map(resolvedStrategies.map((item) => [item.id, item]));
        const mappedVaults = (vaultsResponse.data || []).map((record) =>
          mapVaultRecordToItem({
            record,
            strategiesMap: strategyMap,
          }),
        );

        setVaults(mappedVaults);
        setLastRefreshAt(new Date());
      } catch (error: any) {
        setPageError(error?.message || "Failed to load My Vaults.");
      } finally {
        setIsRefreshing(false);
        setIsPageLoading(false);
      }
    },
    [authHookValue, getAccessToken, ownerAddress],
  );

  useEffect(() => {
    void loadPageData();
  }, [loadPageData]);

  const openCreateDrawer = useCallback(() => {
    setCreateError("");
    setCreateResult(null);
    setCreateProgress(null);
    setIsCreateDrawerOpen(true);
  }, []);

  const closeCreateDrawer = useCallback(() => {
    if (isCreateSubmitting) return;
    setIsCreateDrawerOpen(false);
    setIsAdvancedOpen(false);
    setCreateError("");
    setCreateProgress(null);
  }, [isCreateSubmitting]);

  const handleRefresh = useCallback(async () => {
    await loadPageData({ silent: true });
  }, [loadPageData]);

  const selectStrategy = useCallback(
    (strategyId: string) => {
      const found = strategies.find((item) => item.id === strategyId);
      if (!found || found.status !== "active") return;

      setForm((current) => ({
        ...current,
        strategyId,
      }));
    },
    [strategies],
  );

  const submitCreateVault = useCallback(async () => {
    setCreateError("");
    setCreateResult(null);
    setCreateProgress(null);

    try {
      if (!authenticated) {
        login();
        return;
      }

      if (!ownerAddress) {
        throw new Error("Still without wallet address. Login again or reconnect your wallet.");
      }

      if (!activeWallet) {
        throw new Error("No active wallet connected.");
      }

      const strategy = selectedStrategy;
      if (!strategy) {
        throw new Error("No active strategy available for vault creation.");
      }

      if (strategy.status !== "active") {
        throw new Error("Only ACTIVE strategies can create a vault.");
      }

      if (!normalizeText(form.vaultName)) {
        throw new Error("Vault name is required.");
      }

      if (!normalizeText(strategy.dexKey)) {
        throw new Error("Selected strategy did not resolve a DEX key.");
      }

      if (!normalizeText(strategy.chainKey)) {
        throw new Error("Selected strategy did not resolve a chain key.");
      }

      if (!normalizeText(strategy.parToken)) {
        throw new Error("Selected strategy did not resolve a par token.");
      }

      if (!normalizeText(strategy.poolAddress)) {
        throw new Error("Selected strategy did not resolve a valid pool address.");
      }

      if (!normalizeText(strategy.nfpmAddress)) {
        throw new Error("Selected strategy did not resolve a valid NFPM address.");
      }

      if (!normalizeText(strategy.rpcUrl)) {
        throw new Error("Selected strategy did not resolve a valid rpc_url.");
      }

      if (!normalizeText(strategy.version)) {
        throw new Error("Selected strategy did not resolve a valid version.");
      }

      const swapPoolsParsed = safeJsonParseObj(form.swapPoolsJson);
      if (!swapPoolsParsed.ok) {
        throw new Error(swapPoolsParsed.error);
      }

      setIsCreateSubmitting(true);

      setCreateProgress({
        label: "Waiting wallet signature",
        detail: "The vault contract will be created on-chain first.",
      });

      const accessToken = await resolveAccessToken(authHookValue, getAccessToken);
      if (!accessToken) {
        throw new Error("Missing access token. Please login again.");
      }

      setCreateProgress({
        label: "Creating vault on-chain",
        detail: "Broadcasting transaction to the network.",
      });

      const onchain = await createClientVaultOnchain({
        wallet: activeWallet,
        strategyId: Number(strategy.id),
        owner: ownerAddress,
      });

      setCreateResult({
        txHash: onchain.tx_hash,
        vaultAddress: onchain.vault_address,
      });

      setCreateProgress({
        label: "Registering vault in database",
        detail: "Saving vault metadata in the app registry.",
      });

      const registerResponse = await registerClientVault({
        accessToken,
        payload: {
          vault_address: onchain.vault_address,
          chain: strategy.chainKey,
          dex: strategy.dexKey,
          owner: ownerAddress,
          par_token: strategy.parToken,
          name: normalizeText(form.vaultName),
          description: normalizeText(form.description) || undefined,
          strategy_id: Number(strategy.id),
          config: {
            adapter: strategy.adapter,
            pool: strategy.poolAddress,
            nfpm: strategy.nfpmAddress,
            gauge: strategy.gaugeAddress || undefined,
            rpc_url: strategy.rpcUrl,
            version: strategy.version,
            swap_pools: swapPoolsParsed.value,
          },
        },
      });

      setCreateResult({
        txHash: onchain.tx_hash,
        vaultAddress: onchain.vault_address,
        alias: registerResponse?.alias,
        mongoId: registerResponse?.mongo_id,
      });

      setCreateProgress({
        label: "Refreshing vault list",
        detail: "Loading the new vault from the registry.",
      });

      await loadPageData({ silent: true });

      setCreateProgress({
        label: "Vault created successfully",
        detail: registerResponse?.alias
          ? `Alias: ${registerResponse.alias}`
          : formatAddress(onchain.vault_address),
      });

      setIsCreateDrawerOpen(false);
      resetCreateForm(strategies);
    } catch (error: any) {
      const message = error?.message || "Create vault failed.";
      setCreateError(message);
    } finally {
      setIsCreateSubmitting(false);
    }
  }, [
    activeWallet,
    authHookValue,
    authenticated,
    form.description,
    form.swapPoolsJson,
    form.vaultName,
    getAccessToken,
    loadPageData,
    login,
    ownerAddress,
    resetCreateForm,
    selectedStrategy,
    strategies,
  ]);

  return {
    search,
    setSearch,

    vaults,
    filteredVaults,
    kpis,

    connectedContext,
    strategies,
    activeStrategies,
    selectedStrategy,

    form,
    setFormField,

    isCreateDrawerOpen,
    openCreateDrawer,
    closeCreateDrawer,

    isAdvancedOpen,
    setIsAdvancedOpen,
    selectStrategy,

    handleRefresh,
    lastRefreshAt,

    isPageLoading,
    isRefreshing,
    pageError,

    isCreateSubmitting,
    createError,
    createProgress,
    createResult,
    submitCreateVault,
  };
}