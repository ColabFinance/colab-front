"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { ToastProvider } from "@/shared/ui/toast/ToastProvider";
import { ToastViewport } from "@/shared/ui/toast/ToastViewport";
import { CONFIG } from "@/shared/config/env";

const anvilChain = {
  id: CONFIG.chainId,
  name: "Anvil Local",
  network: "anvil",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [CONFIG.rpcUrl] } },
} as const;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["wallet", "email"],
        embeddedWallets: { createOnLogin: "users-without-wallets" },

        supportedChains: [anvilChain],

        defaultChain: anvilChain,
      }}
    >
      <ToastProvider>
        {children}
        <ToastViewport />
      </ToastProvider>
    </PrivyProvider>
  );
}
