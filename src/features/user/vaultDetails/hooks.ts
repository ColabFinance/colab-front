"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ConnectedWallet } from "@privy-io/react-auth";
import { useWallets } from "@privy-io/react-auth";

import { useAuthToken } from "@/hooks/useAuthToken";

import { getVaultStatus } from "@/core/application/vault/api/getVaultStatus.usecase";
import { getVaultPerformanceUseCase } from "@/core/application/vault/api/getVaultPerformance.usecase";
import { listVaultUserEventsUseCase } from "@/core/application/vault/api/listVaultUserEvents.usecase";
import { persistVaultDepositEventUseCase } from "@/core/application/vault/api/persistVaultDepositEvent.usecase";
import { persistVaultWithdrawEventUseCase } from "@/core/application/vault/api/persistVaultWithdrawEvent.usecase";

import { getVaultDetails } from "@/core/application/vault/onchain/getVaultDetails.usecase";
import { getVaultFeeBufferBalances } from "@/core/application/vault/onchain/getVaultFeeBufferBalances.usecase";
import { depositToken } from "@/core/application/vault/onchain/depositToken.usecase";
import { exitWithdrawAll } from "@/core/application/vault/onchain/exitWithdrawAll.usecase";
import { setAutomationConfig } from "@/core/application/vault/onchain/setAutomationConfig.usecase";
import { setAutomationEnabled } from "@/core/application/vault/onchain/setAutomationEnabled.usecase";
import { setDailyHarvestConfigOnchain } from "@/core/application/vault/onchain/setDailyHarvestConfig.usecase";
import { setCompoundConfigOnchain } from "@/core/application/vault/onchain/setCompoundConfig.usecase";
import { setRewardSwapConfigOnchain } from "@/core/application/vault/onchain/setRewardSwapConfig.usecase";

import { updateDailyHarvestConfigUseCase } from "@/core/application/vault/api/updateDailyHarvestConfig.usecase";
import { updateCompoundConfigUseCase } from "@/core/application/vault/api/updateCompoundConfig.usecase";
import { updateRewardSwapConfigUseCase } from "@/core/application/vault/api/updateRewardSwapConfig.usecase";

import {
  ActionFeedback,
  DepositAssetOption,
  OwnerConfigFormState,
  VaultDrawerKey,
  VaultHeaderView,
  VaultResolvedData,
  VaultTabKey,
} from "./types";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

function normalizeAddress(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function shortAddress(value?: string | null) {
  const v = value || "";
  if (v.length < 10) return v;
  return `${v.slice(0, 6)}...${v.slice(-4)}`;
}

function formatChainLabel(value?: string | null) {
  const key = (value || "").trim().toLowerCase();
  if (key === "base") return "Base";
  if (key === "bnb") return "BNB Chain";
  if (key === "ethereum") return "Ethereum";
  return value || "Unknown chain";
}

function formatDexLabel(value?: string | null) {
  const key = (value || "").trim().toLowerCase();
  if (key === "pancake" || key === "pancake_v3") return "Pancake V3";
  if (key === "uniswap" || key === "uniswap_v3") return "Uniswap V3";
  if (key === "aerodrome") return "Aerodrome";
  return value || "Unknown DEX";
}

function formatUpdatedLabel(date: Date) {
  return `Refreshed ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function toErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unexpected error.";
}

function serializeReceipt(value: any): Record<string, any> | null {
  try {
    return JSON.parse(
      JSON.stringify(value, (_, current) =>
        typeof current === "bigint" ? current.toString() : current,
      ),
    );
  } catch {
    return null;
  }
}

function defaultConfigForm(): OwnerConfigFormState {
  return {
    automationEnabled: false,
    cooldownSec: 0,
    maxSlippageBps: 0,
    allowSwap: false,
    dailyHarvestEnabled: false,
    dailyHarvestCooldownSec: 0,
    compoundEnabled: false,
    compoundCooldownSec: 0,
    rewardSwapEnabled: false,
    rewardSwapTokenIn: ZERO_ADDRESS,
    rewardSwapTokenOut: ZERO_ADDRESS,
    rewardSwapFee: 0,
    rewardSwapSqrtPriceLimitX96: "0",
  };
}

export function useVaultDetails(address: string) {
  const { token, ensureTokenOrLogin } = useAuthToken();
  const { wallets } = useWallets();

  const connectedWallet = (wallets?.[0] as ConnectedWallet | undefined) ?? undefined;
  const viewerWalletAddress = connectedWallet?.address || "";

  const [tab, setTab] = useState<VaultTabKey>("overview");
  const [drawer, setDrawer] = useState<VaultDrawerKey>(null);
  const [configOpen, setConfigOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>("");

  const [data, setData] = useState<VaultResolvedData>({
    status: null,
    details: null,
    performance: null,
    feeBuffer: null,
    events: [],
  });

  const [lastLoadedAtLabel, setLastLoadedAtLabel] = useState<string>("");

  const [depositAssetAddress, setDepositAssetAddress] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState<string>("");

  const [actionFeedback, setActionFeedback] = useState<ActionFeedback>({ kind: "idle" });
  const [configFeedback, setConfigFeedback] = useState<ActionFeedback>({ kind: "idle" });

  const [configForm, setConfigForm] = useState<OwnerConfigFormState>(defaultConfigForm());

  const [eventTypeFilter, setEventTypeFilter] = useState<"all" | "deposit" | "withdraw">("all");
  const [eventSearch, setEventSearch] = useState("");
  const [eventTokenFilter, setEventTokenFilter] = useState("all");
  const [eventFromDate, setEventFromDate] = useState("");
  const [eventToDate, setEventToDate] = useState("");

  const hasLoadedRef = useRef(false);
  const tokenRef = useRef(token);
  const depositAssetAddressRef = useRef(depositAssetAddress);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    depositAssetAddressRef.current = depositAssetAddress;
  }, [depositAssetAddress]);

  const registry = data.performance?.vault || {};
  const status = data.status;
  const details = data.details;
  const feeBuffer = data.feeBuffer;

  const canManage = useMemo(() => {
    const owner = details?.owner || status?.owner || registry.owner || "";
    return (
      !!connectedWallet &&
      normalizeAddress(owner) === normalizeAddress(viewerWalletAddress)
    );
  }, [connectedWallet, details?.owner, registry.owner, status?.owner, viewerWalletAddress]);

  const depositAssets = useMemo<DepositAssetOption[]>(() => {
    if (!status) return [];
    return [
      {
        symbol: status.token0.symbol,
        address: status.token0.address,
        decimals: status.token0.decimals,
      },
      {
        symbol: status.token1.symbol,
        address: status.token1.address,
        decimals: status.token1.decimals,
      },
    ];
  }, [status]);

  const selectedDepositAsset = useMemo(() => {
    return (
      depositAssets.find((item) => normalizeAddress(item.address) === normalizeAddress(depositAssetAddress)) ||
      depositAssets[0] ||
      null
    );
  }, [depositAssetAddress, depositAssets]);

  const availableEventTokens = useMemo(() => {
    const items = new Set<string>();
    for (const event of data.events) {
      if (event.token) items.add(event.token);
      for (const transfer of event.transfers || []) {
        if (transfer.symbol) items.add(transfer.symbol);
        if (transfer.token) items.add(transfer.token);
      }
    }
    return ["all", ...Array.from(items)];
  }, [data.events]);

  const filteredEvents = useMemo(() => {
    return data.events.filter((event) => {
      if (eventTypeFilter !== "all" && event.event_type !== eventTypeFilter) return false;

      if (eventTokenFilter !== "all") {
        const hasToken =
          normalizeAddress(event.token) === normalizeAddress(eventTokenFilter) ||
          event.token === eventTokenFilter ||
          (event.transfers || []).some(
            (transfer) =>
              normalizeAddress(transfer.token) === normalizeAddress(eventTokenFilter) ||
              transfer.symbol === eventTokenFilter,
          );
        if (!hasToken) return false;
      }

      const search = eventSearch.trim().toLowerCase();
      if (search) {
        const haystack = [
          event.tx_hash,
          event.owner,
          event.vault,
          event.token,
          event.event_type,
          event.alias,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(search)) return false;
      }

      const eventDate = new Date(event.ts_iso).getTime();

      if (eventFromDate) {
        const from = new Date(`${eventFromDate}T00:00:00`).getTime();
        if (eventDate < from) return false;
      }

      if (eventToDate) {
        const to = new Date(`${eventToDate}T23:59:59`).getTime();
        if (eventDate > to) return false;
      }

      return true;
    });
  }, [data.events, eventFromDate, eventSearch, eventToDate, eventTokenFilter, eventTypeFilter]);

  const header = useMemo<VaultHeaderView>(() => {
    const token0Symbol = status?.token0.symbol || "TOKEN0";
    const token1Symbol = status?.token1.symbol || "TOKEN1";

    return {
      title: registry.alias || shortAddress(address),
      pairLabel: `${token0Symbol}-${token1Symbol}`,
      chainLabel: formatChainLabel(registry.chain),
      dexLabel: formatDexLabel(registry.dex),
      vaultAddress: address,
      poolAddress: status?.pool || registry.config?.pool || "",
      statusLabel: status?.out_of_range ? "Out of Range" : "Active",
      updatedLabel: lastLoadedAtLabel || "Not refreshed yet",
      token0Symbol,
      token1Symbol,
    };
  }, [address, lastLoadedAtLabel, registry.alias, registry.chain, registry.config?.pool, registry.dex, status]);

  const hydrateConfigForm = useCallback(
    (nextDetails: VaultResolvedData["details"], nextStatus: VaultResolvedData["status"]) => {
      const rewardTokenIn =
        nextDetails?.rewardSwap?.tokenIn ||
        nextStatus?.gauge_rewards?.reward_token ||
        ZERO_ADDRESS;

      const defaultRewardOut =
        nextDetails?.rewardSwap?.tokenOut ||
        nextStatus?.token1?.address ||
        nextStatus?.token0?.address ||
        ZERO_ADDRESS;

      setConfigForm({
        automationEnabled: Boolean(nextDetails?.automationEnabled),
        cooldownSec: Number(nextDetails?.cooldownSec || 0),
        maxSlippageBps: Number(nextDetails?.maxSlippageBps || 0),
        allowSwap: Boolean(nextDetails?.allowSwap),

        dailyHarvestEnabled: Boolean(nextDetails?.dailyHarvestEnabled),
        dailyHarvestCooldownSec: Number(nextDetails?.dailyHarvestCooldownSec || 0),

        compoundEnabled: Boolean(nextDetails?.compoundEnabled),
        compoundCooldownSec: Number(nextDetails?.compoundCooldownSec || 0),

        rewardSwapEnabled: Boolean(nextDetails?.rewardSwap?.enabled),
        rewardSwapTokenIn: rewardTokenIn || ZERO_ADDRESS,
        rewardSwapTokenOut: defaultRewardOut || ZERO_ADDRESS,
        rewardSwapFee: Number(nextDetails?.rewardSwap?.fee || 0),
        rewardSwapSqrtPriceLimitX96:
          String(nextDetails?.rewardSwap?.sqrtPriceLimitX96 || "0"),
      });
    },
    [],
  );

  const loadVault = useCallback(
    async (freshOnchain = false) => {
      try {
        setError("");

        if (hasLoadedRef.current) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const accessToken = tokenRef.current || undefined;

        const [statusResponse, detailsResponse, performanceResponse, eventsResponse] =
          await Promise.all([
            getVaultStatus({ vaultAddress: address, freshOnchain }),
            getVaultDetails(address),
            getVaultPerformanceUseCase({
              accessToken,
              vault: address,
              episodesLimit: 150,
            }),
            listVaultUserEventsUseCase({
              accessToken,
              vault: address,
              limit: 200,
              offset: 0,
            }),
          ]);

        let feeBufferResponse: VaultResolvedData["feeBuffer"] = null;

        try {
          const rewardToken =
            statusResponse?.gauge_rewards?.reward_token &&
            normalizeAddress(statusResponse.gauge_rewards.reward_token) !== normalizeAddress(ZERO_ADDRESS)
              ? statusResponse.gauge_rewards.reward_token
              : undefined;

          feeBufferResponse = await getVaultFeeBufferBalances({
            vaultAddress: address,
            token0: statusResponse.token0.address,
            token1: statusResponse.token1.address,
            rewardToken,
          });
        } catch {
          feeBufferResponse = null;
        }

        const nextData: VaultResolvedData = {
          status: statusResponse,
          details: detailsResponse,
          performance: performanceResponse?.data || null,
          feeBuffer: feeBufferResponse,
          events: eventsResponse?.data || [],
        };

        setData(nextData);
        hydrateConfigForm(nextData.details, nextData.status);

        if (!depositAssetAddressRef.current && nextData.status) {
          const preferred =
            nextData.status.token1.symbol.toUpperCase().includes("USD")
              ? nextData.status.token1.address
              : nextData.status.token0.address;

          setDepositAssetAddress(preferred);
          depositAssetAddressRef.current = preferred;
        }

        setLastLoadedAtLabel(formatUpdatedLabel(new Date()));
        hasLoadedRef.current = true;
      } catch (nextError) {
        setError(toErrorMessage(nextError));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [address, hydrateConfigForm],
  );

  useEffect(() => {
    hasLoadedRef.current = false;
    void loadVault(false);
  }, [address, loadVault]);

  const updateConfigField = useCallback(
    (field: keyof OwnerConfigFormState, value: string | number | boolean) => {
      setConfigForm((current) => ({
        ...current,
        [field]: value,
      }));
    },
    [],
  );

  const requireWallet = useCallback(() => {
    if (!connectedWallet) {
      throw new Error("Connect wallet first.");
    }
    return connectedWallet;
  }, [connectedWallet]);

  const requireOwner = useCallback(() => {
    if (!canManage) {
      throw new Error("Only the vault owner can perform this action.");
    }
  }, [canManage]);

  const openDrawer = useCallback((next: Exclude<VaultDrawerKey, null>) => {
    setActionFeedback({ kind: "idle" });
    setDrawer(next);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawer(null);
    setActionFeedback({ kind: "idle" });
  }, []);

  const openConfig = useCallback(() => {
    setConfigFeedback({ kind: "idle" });
    setConfigOpen(true);
  }, []);

  const closeConfig = useCallback(() => {
    setConfigOpen(false);
    setConfigFeedback({ kind: "idle" });
  }, []);

  const refresh = useCallback(async () => {
    await loadVault(true);
  }, [loadVault]);

  const submitDeposit = useCallback(async () => {
    try {
      requireOwner();
      const wallet = requireWallet();
      if (!selectedDepositAsset) throw new Error("Select a token to deposit.");
      if (!depositAmount || Number(depositAmount) <= 0) {
        throw new Error("Enter a valid deposit amount.");
      }

      setActionFeedback({ kind: "loading", message: "Submitting deposit..." });

      const tx = await depositToken({
        wallet,
        tokenAddress: selectedDepositAsset.address,
        vaultAddress: address,
        amount: depositAmount,
        decimals: selectedDepositAsset.decimals,
      });

      const accessToken = await ensureTokenOrLogin();

      await persistVaultDepositEventUseCase({
        accessToken: accessToken || undefined,
        vault: address,
        payload: {
          chain: (registry.chain as string) || "base",
          dex: (registry.dex as string) || undefined,
          owner: viewerWalletAddress,
          token: selectedDepositAsset.address,
          amount_human: depositAmount,
          decimals: selectedDepositAsset.decimals,
          tx_hash: tx.tx_hash,
          receipt: serializeReceipt(tx.receipt),
          from_addr: viewerWalletAddress,
          to_addr: address,
        },
      });

      setActionFeedback({
        kind: "success",
        message: "Deposit completed.",
        txHash: tx.tx_hash,
      });

      setDepositAmount("");
      await loadVault(true);
    } catch (nextError) {
      setActionFeedback({
        kind: "error",
        message: toErrorMessage(nextError),
      });
    }
  }, [
    address,
    depositAmount,
    ensureTokenOrLogin,
    loadVault,
    registry.chain,
    registry.dex,
    requireOwner,
    requireWallet,
    selectedDepositAsset,
    viewerWalletAddress,
  ]);

  const submitWithdrawAll = useCallback(async () => {
    try {
      requireOwner();
      const wallet = requireWallet();
      if (!status) throw new Error("Vault status not loaded.");

      setActionFeedback({ kind: "loading", message: "Exiting and withdrawing all assets..." });

      const tx = await exitWithdrawAll({
        wallet,
        vaultAddress: address,
        to: viewerWalletAddress,
      });

      const accessToken = await ensureTokenOrLogin();

      const tokenAddresses = [
        status.token0.address,
        status.token1.address,
        status.gauge_rewards?.reward_token,
      ].filter((item): item is string => Boolean(item) && normalizeAddress(item) !== normalizeAddress(ZERO_ADDRESS));

      await persistVaultWithdrawEventUseCase({
        accessToken: accessToken || undefined,
        vault: address,
        payload: {
          chain: (registry.chain as string) || "base",
          dex: (registry.dex as string) || undefined,
          owner: viewerWalletAddress,
          to: viewerWalletAddress,
          tx_hash: tx.tx_hash,
          receipt: serializeReceipt(tx.receipt),
          token_addresses: tokenAddresses,
        },
      });

      setActionFeedback({
        kind: "success",
        message: "Withdraw completed.",
        txHash: tx.tx_hash,
      });

      await loadVault(true);
    } catch (nextError) {
      setActionFeedback({
        kind: "error",
        message: toErrorMessage(nextError),
      });
    }
  }, [
    address,
    ensureTokenOrLogin,
    loadVault,
    registry.chain,
    registry.dex,
    requireOwner,
    requireWallet,
    status,
    viewerWalletAddress,
  ]);

  const saveAutomationToggle = useCallback(async () => {
    try {
      requireOwner();
      const wallet = requireWallet();

      setConfigFeedback({ kind: "loading", message: "Updating automation toggle..." });

      const tx = await setAutomationEnabled({
        wallet,
        vaultAddress: address,
        enabled: configForm.automationEnabled,
      });

      setConfigFeedback({
        kind: "success",
        message: "Automation toggle updated.",
        txHash: tx.tx_hash,
      });

      await loadVault(true);
    } catch (nextError) {
      setConfigFeedback({ kind: "error", message: toErrorMessage(nextError) });
    }
  }, [address, configForm.automationEnabled, loadVault, requireOwner, requireWallet]);

  const saveAutomationConfig = useCallback(async () => {
    try {
      requireOwner();
      const wallet = requireWallet();

      setConfigFeedback({ kind: "loading", message: "Updating automation config..." });

      const tx = await setAutomationConfig({
        wallet,
        vaultAddress: address,
        cooldown_sec: configForm.cooldownSec,
        max_slippage_bps: configForm.maxSlippageBps,
        allow_swap: configForm.allowSwap,
      });

      setConfigFeedback({
        kind: "success",
        message: "Automation config updated.",
        txHash: tx.tx_hash,
      });

      await loadVault(true);
    } catch (nextError) {
      setConfigFeedback({ kind: "error", message: toErrorMessage(nextError) });
    }
  }, [
    address,
    configForm.allowSwap,
    configForm.cooldownSec,
    configForm.maxSlippageBps,
    loadVault,
    requireOwner,
    requireWallet,
  ]);

  const saveDailyHarvestConfig = useCallback(async () => {
    try {
      requireOwner();
      const wallet = requireWallet();
      const accessToken = await ensureTokenOrLogin();

      setConfigFeedback({ kind: "loading", message: "Updating daily harvest config..." });

      const tx = await setDailyHarvestConfigOnchain({
        wallet,
        vault: address,
        enabled: configForm.dailyHarvestEnabled,
        cooldownSec: configForm.dailyHarvestCooldownSec,
      });

      await updateDailyHarvestConfigUseCase({
        accessToken,
        vault: address,
        payload: {
          enabled: configForm.dailyHarvestEnabled,
          cooldown_sec: configForm.dailyHarvestCooldownSec,
        },
      });

      setConfigFeedback({
        kind: "success",
        message: "Daily harvest config updated.",
        txHash: tx.tx_hash,
      });

      await loadVault(true);
    } catch (nextError) {
      setConfigFeedback({ kind: "error", message: toErrorMessage(nextError) });
    }
  }, [
    address,
    configForm.dailyHarvestCooldownSec,
    configForm.dailyHarvestEnabled,
    ensureTokenOrLogin,
    loadVault,
    requireOwner,
    requireWallet,
  ]);

  const saveCompoundConfig = useCallback(async () => {
    try {
      requireOwner();
      const wallet = requireWallet();
      const accessToken = await ensureTokenOrLogin();

      setConfigFeedback({ kind: "loading", message: "Updating compound config..." });

      const tx = await setCompoundConfigOnchain({
        wallet,
        vault: address,
        enabled: configForm.compoundEnabled,
        cooldownSec: configForm.compoundCooldownSec,
      });

      await updateCompoundConfigUseCase({
        accessToken,
        vault: address,
        payload: {
          enabled: configForm.compoundEnabled,
          cooldown_sec: configForm.compoundCooldownSec,
        },
      });

      setConfigFeedback({
        kind: "success",
        message: "Compound config updated.",
        txHash: tx.tx_hash,
      });

      await loadVault(true);
    } catch (nextError) {
      setConfigFeedback({ kind: "error", message: toErrorMessage(nextError) });
    }
  }, [
    address,
    configForm.compoundCooldownSec,
    configForm.compoundEnabled,
    ensureTokenOrLogin,
    loadVault,
    requireOwner,
    requireWallet,
  ]);

  const saveRewardSwapConfig = useCallback(async () => {
    try {
      requireOwner();
      const wallet = requireWallet();
      const accessToken = await ensureTokenOrLogin();

      setConfigFeedback({ kind: "loading", message: "Updating reward swap config..." });

      const tx = await setRewardSwapConfigOnchain({
        wallet,
        vault: address,
        enabled: configForm.rewardSwapEnabled,
        tokenIn: configForm.rewardSwapTokenIn,
        tokenOut: configForm.rewardSwapTokenOut,
        fee: String(configForm.rewardSwapFee),
        sqrtPriceLimitX96: configForm.rewardSwapSqrtPriceLimitX96 || "0",
      });

      await updateRewardSwapConfigUseCase({
        accessToken,
        vault: address,
        payload: {
          enabled: configForm.rewardSwapEnabled,
          token_in: configForm.rewardSwapTokenIn,
          token_out: configForm.rewardSwapTokenOut,
          fee: configForm.rewardSwapFee,
          sqrt_price_limit_x96: configForm.rewardSwapSqrtPriceLimitX96 || "0",
        },
      });

      setConfigFeedback({
        kind: "success",
        message: "Reward swap config updated.",
        txHash: tx.tx_hash,
      });

      await loadVault(true);
    } catch (nextError) {
      setConfigFeedback({ kind: "error", message: toErrorMessage(nextError) });
    }
  }, [
    address,
    configForm.rewardSwapEnabled,
    configForm.rewardSwapFee,
    configForm.rewardSwapSqrtPriceLimitX96,
    configForm.rewardSwapTokenIn,
    configForm.rewardSwapTokenOut,
    ensureTokenOrLogin,
    loadVault,
    requireOwner,
    requireWallet,
  ]);

  return {
    tab,
    setTab,

    loading,
    refreshing,
    error,

    data,
    status,
    details,
    feeBuffer,
    registry,
    header,
    canManage,

    drawer,
    openDrawer,
    closeDrawer,

    configOpen,
    openConfig,
    closeConfig,

    depositAssets,
    selectedDepositAsset,
    depositAssetAddress,
    setDepositAssetAddress,
    depositAmount,
    setDepositAmount,

    actionFeedback,
    submitDeposit,
    submitWithdrawAll,

    configForm,
    updateConfigField,
    configFeedback,
    saveAutomationToggle,
    saveAutomationConfig,
    saveDailyHarvestConfig,
    saveCompoundConfig,
    saveRewardSwapConfig,

    eventTypeFilter,
    setEventTypeFilter,
    eventSearch,
    setEventSearch,
    eventTokenFilter,
    setEventTokenFilter,
    eventFromDate,
    setEventFromDate,
    eventToDate,
    setEventToDate,
    availableEventTokens,
    filteredEvents,

    refresh,
  };
}