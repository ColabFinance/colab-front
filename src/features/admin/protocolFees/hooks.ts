"use client";

import { useMemo, useState } from "react";
import { MOCK_BALANCES, MOCK_COLLECTOR, MOCK_WITHDRAW_HISTORY } from "./mock";
import { ProtocolFeeBalanceItem } from "./types";

export type ProtocolFeesFilters = {
  tokenQuery: string;
};

export function useProtocolFees() {
  const [filters, setFilters] = useState<ProtocolFeesFilters>({
    tokenQuery: "",
  });

  const collector = useMemo(() => MOCK_COLLECTOR, []);
  const balances = useMemo(() => MOCK_BALANCES, []);
  const withdrawHistory = useMemo(() => MOCK_WITHDRAW_HISTORY, []);

  const filteredBalances = useMemo(() => {
    const q = filters.tokenQuery.trim().toLowerCase();
    if (!q) return balances;

    return balances.filter((b) => {
      const hay = `${b.symbol} ${b.name} ${b.tokenAddress}`.toLowerCase();
      return hay.includes(q);
    });
  }, [balances, filters.tokenQuery]);

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedBalanceId, setSelectedBalanceId] = useState<string>(balances[0]?.id ?? "");

  const selectedBalance: ProtocolFeeBalanceItem | undefined = useMemo(() => {
    return balances.find((b) => b.id === selectedBalanceId) ?? balances[0];
  }, [balances, selectedBalanceId]);

  function openWithdraw(balanceId?: string) {
    if (balanceId) setSelectedBalanceId(balanceId);
    setWithdrawOpen(true);
  }

  function closeWithdraw() {
    setWithdrawOpen(false);
  }

  function refreshBalances() {
    // mock-only placeholder
  }

  return {
    filters,
    setFilters,

    collector,
    balances,
    filteredBalances,
    withdrawHistory,

    withdrawOpen,
    openWithdraw,
    closeWithdraw,

    selectedBalanceId,
    setSelectedBalanceId,
    selectedBalance,

    refreshBalances,
  };
}