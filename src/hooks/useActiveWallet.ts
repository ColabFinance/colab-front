"use client";

import { useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";
import type { Wallet } from "@privy-io/react-auth";

function isMetaMask(w?: Wallet | null) {
  const t = (w?.walletClientType || "").toLowerCase();
  return t.includes("metamask");
}

function isEmbedded(w?: Wallet | null) {
  const t = (w?.walletClientType || "").toLowerCase();
  return t.includes("privy") || t.includes("embedded");
}

export function useActiveWallet() {
  const { wallets, user } = usePrivy();

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
