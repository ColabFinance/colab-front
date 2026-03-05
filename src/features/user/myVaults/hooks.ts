"use client";

import { useMemo, useState } from "react";
import { MOCK_STRATEGIES, MOCK_VAULTS } from "./mock";
import { StrategyOption, VaultRow } from "./types";

export type MyVaultsTab = "list" | "create" | "automation";

export type CreateVaultFormState = {
  strategyId: string;
  alias: string;
  internalName: string;
  description: string;
  swapPoolsJson: string;
  advancedOpen: boolean;
};

export function useMyVaults() {
  const [activeTab, setActiveTab] = useState<MyVaultsTab>("list");
  const [search, setSearch] = useState("");

  const strategies = useMemo(() => MOCK_STRATEGIES, []);
  const vaults = useMemo(() => MOCK_VAULTS, []);

  const filteredVaults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vaults;

    return vaults.filter((v) => {
      const hay = [
        v.alias,
        v.subtitle ?? "",
        v.vaultAddress,
        v.strategyName,
        v.strategyKey,
        v.chainName,
        v.dexName,
        v.pairLabel,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [vaults, search]);

  const [createState, setCreateState] = useState<CreateVaultFormState>({
    strategyId: strategies[0]?.id ?? "",
    alias: "",
    internalName: "",
    description: "",
    swapPoolsJson: "",
    advancedOpen: false,
  });

  const selectedStrategy: StrategyOption | undefined = useMemo(() => {
    return strategies.find((s) => s.id === createState.strategyId);
  }, [strategies, createState.strategyId]);

  const [depositOpen, setDepositOpen] = useState(false);
  const [depositVault, setDepositVault] = useState<VaultRow | null>(null);

  function openCreate() {
    setActiveTab("create");
  }

  function openList() {
    setActiveTab("list");
  }

  function openAutomation() {
    setActiveTab("automation");
  }

  function onDeposit(v: VaultRow) {
    setDepositVault(v);
    setDepositOpen(true);
  }

  function closeDeposit() {
    setDepositOpen(false);
    setDepositVault(null);
  }

  return {
    activeTab,
    setActiveTab,
    openCreate,
    openList,
    openAutomation,

    search,
    setSearch,

    strategies,
    vaults,
    filteredVaults,

    createState,
    setCreateState,
    selectedStrategy,

    depositOpen,
    depositVault,
    onDeposit,
    closeDeposit,
  };
}