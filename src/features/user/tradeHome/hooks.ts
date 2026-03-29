"use client";

import { useCallback, useMemo, useState } from "react";
import {
  TRADE_HOME_ACTIVE_POSITIONS,
  TRADE_HOME_METADATA,
  TRADE_HOME_RUNTIME_HIGHLIGHTS,
  TRADE_HOME_SIGNALS,
  TRADE_HOME_STRATEGIES,
  TRADE_HOME_WARNINGS,
} from "./mock";
import type { TradeHomeKpis, TradeHomeStatusFilter } from "./types";

function normalizeAccount(account: string | null) {
  return account ?? "Unassigned";
}

export function useTradeHomePage() {
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<TradeHomeStatusFilter>("all");
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState("just now");

  const accounts = useMemo(() => {
    const values = new Set<string>();
    TRADE_HOME_STRATEGIES.forEach((item) => values.add(normalizeAccount(item.executionAccount)));
    return Array.from(values);
  }, []);

  const filteredStrategies = useMemo(() => {
    return TRADE_HOME_STRATEGIES.filter((item) => {
      const accountMatch =
        selectedAccount === "all" ||
        normalizeAccount(item.executionAccount) === selectedAccount;

      const statusMatch = selectedStatus === "all" || item.status === selectedStatus;

      return accountMatch && statusMatch;
    });
  }, [selectedAccount, selectedStatus]);

  const filteredStrategyIds = useMemo(() => {
    return new Set(filteredStrategies.map((item) => item.id));
  }, [filteredStrategies]);

  const filteredRuntimeHighlights = useMemo(() => {
    return TRADE_HOME_RUNTIME_HIGHLIGHTS.filter((item) =>
      filteredStrategyIds.has(item.strategyId)
    );
  }, [filteredStrategyIds]);

  const filteredActivePositions = useMemo(() => {
    return TRADE_HOME_ACTIVE_POSITIONS.filter((item) =>
      filteredStrategyIds.has(item.strategyId)
    );
  }, [filteredStrategyIds]);

  const filteredSignals = useMemo(() => {
    return TRADE_HOME_SIGNALS.filter((item) => filteredStrategyIds.has(item.strategyId));
  }, [filteredStrategyIds]);

  const kpis = useMemo<TradeHomeKpis>(() => {
    return {
      totalTradeStrategies: filteredStrategies.length,
      activeTradeStrategies: filteredStrategies.filter((item) => item.status === "active").length,
      activePositions: filteredActivePositions.length,
      pendingSignals: filteredSignals.filter((item) => item.status === "pending").length,
      failedSignals: filteredSignals.filter((item) => item.status === "failed").length,
      enabledExecutionProfiles: TRADE_HOME_METADATA.enabledExecutionProfiles,
    };
  }, [filteredStrategies, filteredActivePositions, filteredSignals]);

  const refresh = useCallback(() => {
    setLastUpdatedLabel("just now");
  }, []);

  return {
    selectedAccount,
    setSelectedAccount,
    selectedStatus,
    setSelectedStatus,
    accounts,
    kpis,
    strategies: filteredStrategies,
    runtimeHighlights: filteredRuntimeHighlights,
    activePositions: filteredActivePositions,
    signals: filteredSignals,
    warnings: TRADE_HOME_WARNINGS,
    lastUpdatedLabel,
    refresh,
  };
}