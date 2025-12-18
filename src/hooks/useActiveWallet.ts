"use client";

import { useMemo } from "react";
import { useWallets } from "@privy-io/react-auth";

export function useActiveWallet() {
  const { wallets } = useWallets();

  const activeWallet = useMemo(() => {
    const embedded = wallets.find((w) => w.walletClientType === "privy");
    return embedded ?? wallets[0];
  }, [wallets]);

  return { activeWallet, wallets };
}
