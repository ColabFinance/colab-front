"use client";

import { useMemo, useState } from "react";
import { MOCK_KPIS, MOCK_SNAPSHOT, MOCK_TOP_VAULTS } from "./mock";
import type { HomeChainScope, TopVaultRow } from "./types";

export function useUserHome() {
  const [chainScope, setChainScope] = useState<HomeChainScope>("current");
  const [vaultQuery, setVaultQuery] = useState("");
  const [depositOpen, setDepositOpen] = useState(false);
  const [selectedVault, setSelectedVault] = useState<TopVaultRow | null>(null);

  const kpis = useMemo(() => MOCK_KPIS, []);
  const snapshot = useMemo(() => MOCK_SNAPSHOT, []);
  const vaults = useMemo(() => MOCK_TOP_VAULTS, []);

  const filteredVaults = useMemo(() => {
    const q = vaultQuery.trim().toLowerCase();
    if (!q) return vaults;
    return vaults.filter((v) => `${v.name} ${v.subtitle} ${v.dexLabel}`.toLowerCase().includes(q));
  }, [vaults, vaultQuery]);

  function openDeposit(v: TopVaultRow) {
    setSelectedVault(v);
    setDepositOpen(true);
  }

  function closeDeposit() {
    setDepositOpen(false);
    setSelectedVault(null);
  }

  return {
    chainScope,
    setChainScope,

    vaultQuery,
    setVaultQuery,

    kpis,
    snapshot,
    filteredVaults,

    depositOpen,
    selectedVault,
    openDeposit,
    closeDeposit,
  };
}