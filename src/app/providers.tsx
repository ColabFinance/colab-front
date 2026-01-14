"use client";

import React, { useEffect } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { ToastProvider } from "@/shared/ui/toast/ToastProvider";
import { ToastViewport } from "@/shared/ui/toast/ToastViewport";

import type { ChainKey } from "@/shared/config/env";
import { getRpcUrl } from "@/shared/config/env";

import { clearContractRegistryCache, loadContractRegistry } from "@/infra/api-lp/contractRegistry";
import { getActiveChainRuntime, onChainChanged, onAccountsChanged } from "@/shared/config/chainRuntime";

// --- Privy chains (static list is OK) ---
const baseChain = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [getRpcUrl("base")] } },
} as const;

const bnbChain = {
  id: 56,
  name: "BNB Smart Chain",
  network: "bsc",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: { default: { http: [getRpcUrl("bnb")] } },
} as const;

function assertRegistryHasFactories(reg: any) {
  if (!reg?.data?.strategy_factory?.address) {
    throw new Error("Assert providers: contract strategy registry not loaded: strategy_factory.address");
  }
  if (!reg?.data?.vault_factory?.address) {
    throw new Error("Contract registry not loaded: vault_factory.address");
  }
}

async function loadRegistryFor(chainKey: ChainKey) {
  // IMPORTANT: per-chain cache must be clean if user switched networks
  clearContractRegistryCache(chainKey);
  const reg = await loadContractRegistry(chainKey);
  assertRegistryHasFactories(reg);
  return reg;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const rt = await getActiveChainRuntime();
        if (!mounted) return;
        await loadRegistryFor(rt.chainKey);
      } catch (e) {
        // If no provider or unsupported chain, we just don't preload registry.
        console.error(e);
      }
    })();

    const offChain = onChainChanged(async (rt) => {
      try {
        if (!mounted) return;
        await loadRegistryFor(rt.chainKey);
      } catch (e) {
        console.error(e);
      }
    });

    const offAcc = onAccountsChanged(async () => {
      try {
        const rt = await getActiveChainRuntime();
        await loadRegistryFor(rt.chainKey);
      } catch (e) {
        console.error(e);
      }
    });

    return () => {
      mounted = false;
      offChain();
      offAcc();
    };
  }, []);

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["wallet", "email"],
        embeddedWallets: { createOnLogin: "users-without-wallets" },

        // Support both networks; the user can switch.
        supportedChains: [baseChain, bnbChain],

        // Default only affects initial suggestion; real chain is driven by wallet anyway.
        defaultChain: baseChain,
      }}
    >
      <ToastProvider>
        {children}
        <ToastViewport />
      </ToastProvider>
    </PrivyProvider>
  );
}
