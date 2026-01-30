"use client";

import { useMemo } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import type { ConnectedWallet } from "@privy-io/react-auth";

function isMetaMask(w?: ConnectedWallet | null) {
  const t = (w?.walletClientType || "").toLowerCase();
  return t.includes("metamask");
}

function isEmbedded(w?: ConnectedWallet | null) {
  const t = (w?.walletClientType || "").toLowerCase();
  return t.includes("privy") || t.includes("embedded");
}

export function useActiveWallet() {
  const { user } = usePrivy();
  const { wallets } = useWallets();

  const activeWallet = useMemo(() => {
    // regra UX:
    // - se MetaMask existir, ela é mais “esperada” para assinar ações pesadas (power-user)
    // - senão, embedded.
    const mm = wallets?.find((w) => isMetaMask(w));
    if (mm) return mm;

    const emb = wallets?.find((w) => isEmbedded(w));
    if (emb) return emb;

    // fallback
    const userWalletAddr = user?.wallet?.address;
    const any = wallets?.[0];
    if (any) return any;
    return userWalletAddr ? ({ address: userWalletAddr } as any) : null;
  }, [wallets, user?.wallet?.address]);

  return { activeWallet };
}
