"use client";

import { useCallback, useMemo } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import type { ConnectedWallet } from "@privy-io/react-auth";

function normalizeAddr(a?: string | null) {
  if (!a) return "";
  return String(a);
}

function isEmbeddedWallet(w?: ConnectedWallet | null) {
  const t = (w?.walletClientType || "").toLowerCase();
  return t.includes("privy") || t.includes("embedded");
}

export function useOwnerAddress() {
  const { authenticated, user, createWallet, linkWallet } = usePrivy();
  const { wallets } = useWallets();

  // Prefer: user.wallet (embedded primary) if exists; otherwise first wallet in list
  const embedded = useMemo(() => {
    const w = wallets?.find((x) => isEmbeddedWallet(x));
    return w || null;
  }, [wallets]);

  const activeWallet = useMemo(() => {
    // Se MetaMask estiver linkada, você pode escolher priorizar MetaMask.
    // Aqui eu mantenho “embedded-first” pra previsibilidade (muito comum em apps com Privy).
    return embedded || wallets?.[0] || null;
  }, [embedded, wallets]);

  const ownerAddr = useMemo(() => {
    return normalizeAddr(activeWallet?.address || user?.wallet?.address);
  }, [activeWallet?.address, user?.wallet?.address]);

  // Evita “criar várias”: lock simples no localStorage
  const ensureWallet = useCallback(async () => {
    if (!authenticated) return;

    const existing = user?.wallet?.address || embedded?.address;
    if (existing) return;

    const lockKey = `privy_wallet_create_lock_${user?.id || "unknown"}`;
    const locked = typeof window !== "undefined" ? window.localStorage.getItem(lockKey) : "1";
    if (locked === "1") {
      // já tentamos criar uma vez
      return;
    }

    if (typeof window !== "undefined") window.localStorage.setItem(lockKey, "1");
    await createWallet();
  }, [authenticated, user?.id, user?.wallet?.address, embedded?.address, createWallet]);

  const linkExternal = useCallback(async () => {
    await linkWallet();
  }, [linkWallet]);

  return {
    ownerAddr,
    activeWallet,
    wallets: wallets || [],
    ensureWallet,
    linkExternal,
  };
}
