"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getTradeHomeSnapshotUseCase } from "@/core/usecases/user/trade/tradeHome/getTradeHomeSnapshot.usecase";
import type {
  ActivePositionRow,
  OperationalWarning,
  RuntimeHighlightRow,
  TradeHomeKpis,
  TradeHomeStatusFilter,
  TradeSignalRow,
  TradeStrategyRow,
} from "./types";

type TradeHomeState = {
  accounts: string[];
  statusOptions: string[];
  kpis: TradeHomeKpis;
  strategies: TradeStrategyRow[];
  runtimeHighlights: RuntimeHighlightRow[];
  activePositions: ActivePositionRow[];
  signals: TradeSignalRow[];
  warnings: OperationalWarning[];
};

const EMPTY_STATE: TradeHomeState = {
  accounts: [],
  statusOptions: [],
  kpis: {
    totalTradeStrategies: 0,
    activeTradeStrategies: 0,
    activePositions: 0,
    pendingSignals: 0,
    failedSignals: 0,
    enabledExecutionProfiles: 0,
  },
  strategies: [],
  runtimeHighlights: [],
  activePositions: [],
  signals: [],
  warnings: [],
};

export function useTradeHomePage() {
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<TradeHomeStatusFilter>("all");
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState("just now");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [data, setData] = useState<TradeHomeState>(EMPTY_STATE);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const snapshot = await getTradeHomeSnapshotUseCase();

      setData({
        accounts: snapshot.accounts,
        statusOptions: snapshot.statusOptions,
        kpis: snapshot.kpis,
        strategies: snapshot.strategies,
        runtimeHighlights: snapshot.runtimeHighlights,
        activePositions: snapshot.activePositions,
        signals: snapshot.signals,
        warnings: snapshot.warnings,
      });

      setLastUpdatedLabel("just now");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load trade home data");
      setData(EMPTY_STATE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredStrategies = useMemo(() => {
    return data.strategies.filter((item) => {
      const accountMatch = selectedAccount === "all" || item.executionAccount === selectedAccount;
      const statusMatch = selectedStatus === "all" || item.status === selectedStatus;
      return accountMatch && statusMatch;
    });
  }, [data.strategies, selectedAccount, selectedStatus]);

  const strategyIds = useMemo(() => {
    return new Set(filteredStrategies.map((item) => item.id));
  }, [filteredStrategies]);

  const filteredRuntimeHighlights = useMemo(() => {
    return data.runtimeHighlights.filter((item) => strategyIds.has(item.strategyId));
  }, [data.runtimeHighlights, strategyIds]);

  const filteredActivePositions = useMemo(() => {
    return data.activePositions.filter((item) => strategyIds.has(item.strategyId));
  }, [data.activePositions, strategyIds]);

  const filteredSignals = useMemo(() => {
    return data.signals.filter((item) => strategyIds.has(item.strategyId));
  }, [data.signals, strategyIds]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  return {
    selectedAccount,
    setSelectedAccount,
    selectedStatus,
    setSelectedStatus,
    accounts: data.accounts,
    statusOptions: data.statusOptions,
    kpis: {
      ...data.kpis,
      totalTradeStrategies: filteredStrategies.length,
      activeTradeStrategies: filteredStrategies.filter((item) => item.status === "ACTIVE").length,
      activePositions: filteredActivePositions.length,
      pendingSignals: filteredSignals.filter((item) => item.status === "PENDING").length,
      failedSignals: filteredSignals.filter((item) => item.status === "FAILED").length,
    },
    strategies: filteredStrategies,
    runtimeHighlights: filteredRuntimeHighlights,
    activePositions: filteredActivePositions,
    signals: filteredSignals,
    warnings: data.warnings,
    lastUpdatedLabel,
    refresh,
    isLoading,
    errorMessage,
  };
}