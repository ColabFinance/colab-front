"use client";

import { useMemo, useState } from "react";
import { MOCK_STRATEGIES, MOCK_VAULTS_BY_STRATEGY } from "./mock";
import { StrategyDetails, VaultUsingStrategy } from "./types";

export function useStrategyDetails(strategyId?: string) {
  const [vaultFilter, setVaultFilter] = useState("");

  const strategy: StrategyDetails | undefined = useMemo(() => {
    if (!strategyId) return MOCK_STRATEGIES[0];
    return MOCK_STRATEGIES.find((s) => s.id === strategyId) ?? MOCK_STRATEGIES[0];
  }, [strategyId]);

  const vaults: VaultUsingStrategy[] = useMemo(() => {
    if (!strategy) return [];
    return MOCK_VAULTS_BY_STRATEGY[strategy.id] ?? [];
  }, [strategy]);

  const filteredVaults = useMemo(() => {
    const q = vaultFilter.trim().toLowerCase();
    if (!q) return vaults;

    return vaults.filter((v) => {
      const hay = `${v.name} ${v.address} ${v.pairLabel} ${v.feeTierLabel} ${v.status}`.toLowerCase();
      return hay.includes(q);
    });
  }, [vaults, vaultFilter]);

  return {
    strategy,
    vaults,
    vaultFilter,
    setVaultFilter,
    filteredVaults,
  };
}