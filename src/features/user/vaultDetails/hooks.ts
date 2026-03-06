"use client";

import { useMemo, useState } from "react";
import { MOCK_VAULT_DETAILS } from "./mock";
import { VaultDetails, VaultTabKey } from "./types";

export function useVaultDetails(address: string) {
  const [tab, setTab] = useState<VaultTabKey>("overview");

  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>("");

  const data: VaultDetails = useMemo(() => {
    // mock-only for now; later you’ll fetch by address
    void address;
    return MOCK_VAULT_DETAILS;
  }, [address]);

  const breadcrumbLabel = useMemo(() => {
    return `${data.token0.symbol}-${data.token1.symbol} ${data.feeTierLabel}`;
  }, [data.feeTierLabel, data.token0.symbol, data.token1.symbol]);

  function openDeposit() {
    setDepositOpen(true);
  }

  function closeDeposit() {
    setDepositOpen(false);
  }

  function setMaxDeposit() {
    // mock-only (matches the HTML “MAX” feel)
    setDepositAmount("1420.50");
  }

  return {
    tab,
    setTab,

    data,
    breadcrumbLabel,

    depositOpen,
    openDeposit,
    closeDeposit,

    depositAmount,
    setDepositAmount,
    setMaxDeposit,
  };
}