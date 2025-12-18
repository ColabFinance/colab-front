"use client";

import { useMemo } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";

export function useOwnerAddress() {
  const { user, authenticated, createWallet, linkWallet } = usePrivy();
  const { wallets } = useWallets();

  const activeWallet = useMemo(() => {
    const embedded = wallets.find((w) => w.walletClientType === "privy");
    return embedded ?? wallets[0];
  }, [wallets]);

  const ownerAddr =
    activeWallet?.address ??
    (user?.wallet?.address as string | undefined);

  async function ensureWallet() {
    if (!authenticated) return;
    if (ownerAddr) return;
    await createWallet();
  }

  async function linkExternal() {
    if (!authenticated) return;
    await linkWallet();
  }

  return {
    wallets,
    activeWallet,
    ownerAddr,
    ensureWallet,
    linkExternal,
  };
}
