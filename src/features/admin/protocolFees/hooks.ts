"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { parseUnits } from "ethers";

import { useAuthToken } from "@/hooks/useAuthToken";
import { useActiveWallet } from "@/hooks/useActiveWallet";

import { listChainsUseCase } from "@/core/usecases/admin/chains/listChains.usecase";
import { listProtocolFeeDashboardUseCase } from "@/core/usecases/admin/fees/listProtocolFeeDashboard.usecase";
import { recordProtocolFeeWithdrawalUseCase } from "@/core/usecases/admin/fees/recordProtocolFeeWithdrawal.usecase";
import { trackProtocolFeeTokenUseCase } from "@/core/usecases/admin/fees/trackProtocolFeeToken.usecase";

import { getProtocolFeeCollectorConfigUseCase } from "@/core/application/admin/onchain/getProtocolFeeCollectorConfig.usecase";
import { listProtocolFeeCollectorBalancesUseCase } from "@/core/application/admin/onchain/listProtocolFeeCollectorBalances.usecase";
import { withdrawProtocolFeeCollectorFeesUseCase } from "@/core/application/admin/onchain/withdrawProtocolFeeCollectorFees.usecase";

import { ProtocolFeeBalanceItem, ProtocolFeeCollectorSummary, ProtocolFeeWithdrawHistoryItem } from "./types";

export type ProtocolFeesFilters = {
  tokenQuery: string;
};

type ChainOption = {
  chainId: number;
  name: string;
  key: string;
};

function shortHash(v: string) {
  if (!v) return "—";
  return `${v.slice(0, 6)}…${v.slice(-4)}`;
}

function shortAddress(v: string) {
  if (!v) return "—";
  return `${v.slice(0, 6)}…${v.slice(-4)}`;
}

function isAddressLike(v: string) {
  const s = v.trim();
  return /^0x[a-fA-F0-9]{40}$/.test(s);
}

function computeTotalApproxUsd(items: ProtocolFeeBalanceItem[]) {
  let total = 0;

  for (const item of items) {
    if (!item.valueUsdLabel || item.valueUsdLabel === "—") continue;
    const cleaned = item.valueUsdLabel.replaceAll("$", "").replaceAll(",", "");
    const n = Number(cleaned);
    if (Number.isFinite(n)) total += n;
  }

  if (total === 0) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(total);
}

export function useProtocolFees() {
  const { token, ensureTokenOrLogin, ready } = useAuthToken();
  const activeWallet = useActiveWallet();

  const [filters, setFilters] = useState<ProtocolFeesFilters>({ tokenQuery: "" });

  const [chainOptions, setChainOptions] = useState<ChainOption[]>([]);
  const [chainId, setChainId] = useState<number>(1);

  const [collector, setCollector] = useState<ProtocolFeeCollectorSummary>({
    contractName: "ProtocolFeeCollector",
    contractAddress: "",
    treasuryAddress: "",
    feeBps: 0,
    totalValueUsdLabel: "—",
    totalValueDeltaLabel: "No tracked tokens yet",
    lastWithdrawalLabel: "No withdrawals yet",
  });

  const [balances, setBalances] = useState<ProtocolFeeBalanceItem[]>([]);
  const [withdrawHistory, setWithdrawHistory] = useState<ProtocolFeeWithdrawHistoryItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);
  const [error, setError] = useState("");

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedBalanceId, setSelectedBalanceId] = useState<string>("");

  const currentChain = useMemo(
    () => chainOptions.find((c) => c.chainId === chainId) ?? null,
    [chainId, chainOptions]
  );

  const chainKey = currentChain?.key ?? "";

  const filteredBalances = useMemo(() => {
    const q = filters.tokenQuery.trim().toLowerCase();
    if (!q) return balances;

    return balances.filter((b) => {
      const hay = `${b.symbol} ${b.name} ${b.tokenAddress}`.toLowerCase();
      return hay.includes(q);
    });
  }, [balances, filters.tokenQuery]);

  const selectedBalance: ProtocolFeeBalanceItem | undefined = useMemo(() => {
    return balances.find((b) => b.id === selectedBalanceId) ?? balances[0];
  }, [balances, selectedBalanceId]);

  async function resolveAccessToken() {
    const accessToken = token || (await ensureTokenOrLogin());
    if (!accessToken) throw new Error("Admin access token not available.");
    return accessToken;
  }

  function resolveWallet() {
    if (!activeWallet) throw new Error("Connect the admin wallet first.");
    return activeWallet;
  }

  const loadChains = useCallback(async () => {
    if (!token) return;

    const out = await listChainsUseCase({ accessToken: token, limit: 500 });
    const next = (out.data ?? []).map((item: any) => ({
      chainId: Number(item.chain_id),
      name: String(item.name),
      key: String(item.key),
    }));

    setChainOptions(next);

    if (next.length > 0) {
      setChainId((prev) => (next.some((x) => x.chainId === prev) ? prev : next[0].chainId));
    }
  }, [token]);

  const loadDashboard = useCallback(async () => {
    if (!token || !chainKey) return;

    setLoading(true);
    try {
      const [dashboard, onchainConfig] = await Promise.all([
        listProtocolFeeDashboardUseCase({
          accessToken: token,
          chain: chainKey,
        }),
        getProtocolFeeCollectorConfigUseCase().catch(() => null),
      ]);

      const trackedTokens = dashboard.data?.tracked_tokens ?? [];
      const withdrawals = dashboard.data?.withdrawals ?? [];
      const contract = dashboard.data?.contract ?? null;

      const liveBalances = await listProtocolFeeCollectorBalancesUseCase({
        trackedTokens: trackedTokens.map((item) => ({
          id: item.id,
          tokenAddress: item.token_address,
          label: item.label,
        })),
      });

      setBalances(liveBalances);

      setWithdrawHistory(
        withdrawals.map((row) => ({
          id: row.id || row.tx_hash,
          txHash: row.tx_hash,
          txHashShort: shortHash(row.tx_hash),
          tokenSymbol: row.token_symbol || "TOKEN",
          amountLabel: row.amount_label || row.amount_raw,
          destinationShort: shortAddress(row.destination),
          destination: row.destination,
          status: row.status,
          timestampLabel: row.created_at_iso || row.updated_at_iso || "—",
        }))
      );

      const totalUsd = computeTotalApproxUsd(liveBalances);
      const lastWithdrawal = withdrawals[0];

      setCollector({
        contractName: "ProtocolFeeCollector",
        contractAddress: onchainConfig?.contractAddress || contract?.address || "",
        treasuryAddress: onchainConfig?.treasuryAddress || contract?.treasury || "",
        feeBps: onchainConfig?.feeBps ?? contract?.protocol_fee_bps ?? 0,
        totalValueUsdLabel: totalUsd,
        totalValueDeltaLabel:
          liveBalances.length > 0
            ? `${liveBalances.length} tracked token${liveBalances.length > 1 ? "s" : ""}`
            : "No tracked tokens yet",
        lastWithdrawalLabel: lastWithdrawal
          ? `${lastWithdrawal.amount_label || lastWithdrawal.amount_raw} → ${shortAddress(lastWithdrawal.destination)}`
          : "No withdrawals yet",
      });

      setError("");
    } catch (e: any) {
      setError(e?.message || "Failed to load protocol fee dashboard.");
    } finally {
      setLoading(false);
    }
  }, [token, chainKey]);

  useEffect(() => {
    if (!ready) return;
    void loadChains();
  }, [ready, loadChains]);

  useEffect(() => {
    if (!ready || !token || !chainKey) return;
    void loadDashboard();
  }, [ready, token, chainKey, loadDashboard]);

  useEffect(() => {
    if (!selectedBalanceId && balances[0]?.id) {
      setSelectedBalanceId(balances[0].id);
    }
  }, [balances, selectedBalanceId]);

  function openWithdraw(balanceId?: string) {
    if (balanceId) setSelectedBalanceId(balanceId);
    setWithdrawOpen(true);
  }

  function closeWithdraw() {
    setWithdrawOpen(false);
  }

  async function refreshBalances() {
    await loadDashboard();
  }

  async function trackToken() {
    const accessToken = await resolveAccessToken();

    const tokenAddress = window.prompt("Token address to track in ProtocolFeeCollector:", "");
    if (!tokenAddress || !isAddressLike(tokenAddress)) return;

    const label = window.prompt("Optional label for this token:", "") || undefined;

    await trackProtocolFeeTokenUseCase({
      accessToken,
      body: {
        chain: chainKey,
        token_address: tokenAddress.trim(),
        label,
      },
    });

    await loadDashboard();
  }

  async function submitWithdraw(params: { balanceId: string; amount: string }) {
    const wallet = resolveWallet();
    const accessToken = await resolveAccessToken();

    const balance = balances.find((b) => b.id === params.balanceId);
    if (!balance) throw new Error("Selected balance not found.");

    const amountInput = (params.amount || "").trim();
    if (!amountInput) throw new Error("Amount is required.");

    const rawAmount = parseUnits(amountInput, balance.decimals);
    if (rawAmount <= 0n) throw new Error("Amount must be greater than zero.");

    setSubmittingWithdraw(true);
    try {
      const tx = await withdrawProtocolFeeCollectorFeesUseCase({
        activeWallet: wallet,
        token: balance.tokenAddress,
        amount: rawAmount,
        to: collector.treasuryAddress,
      });

      await recordProtocolFeeWithdrawalUseCase({
        accessToken,
        body: {
          chain: chainKey,
          tx_hash: tx.txHash,
          token_address: balance.tokenAddress,
          token_symbol: balance.symbol,
          amount_raw: rawAmount.toString(),
          amount_label: `${amountInput} ${balance.symbol}`,
          destination: collector.treasuryAddress,
          status: "success",
        },
      });

      await loadDashboard();
      closeWithdraw();
    } finally {
      setSubmittingWithdraw(false);
    }
  }

  return {
    filters,
    setFilters,

    chainOptions,
    chainId,
    setChainId,

    collector,
    balances,
    filteredBalances,
    withdrawHistory,

    loading,
    error,

    withdrawOpen,
    openWithdraw,
    closeWithdraw,

    selectedBalanceId,
    setSelectedBalanceId,
    selectedBalance,

    submittingWithdraw,

    refreshBalances,
    trackToken,
    submitWithdraw,
  };
}