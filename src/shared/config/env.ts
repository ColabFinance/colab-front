// src/shared/config/env.ts
function required(name: string, value?: string) {
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

function optional(value?: string, fallback?: string) {
  return value ?? fallback ?? "";
}

/**
 * IMPORTANT:
 * Next only inlines envs in client bundles when access is STATIC
 * (process.env.NEXT_PUBLIC_XXX). Dynamic indexing breaks it.
 */
const ENV = {
  // RPC per chain
  NEXT_PUBLIC_RPC_BASE: process.env.NEXT_PUBLIC_RPC_BASE,
  NEXT_PUBLIC_RPC_BNB: process.env.NEXT_PUBLIC_RPC_BNB,

  // API
  NEXT_PUBLIC_API_LP_BASE_URL: process.env.API_LP_ORIGIN,
  NEXT_PUBLIC_API_SIGNALS_BASE_URL: process.env.API_SIGNALS_ORIGIN,
  NEXT_PUBLIC_API_MARKET_DATA_URL: process.env.API_MARKET_DATA_ORIGIN,

  // Admin
  NEXT_PUBLIC_ADMIN_WALLETS: process.env.NEXT_PUBLIC_ADMIN_WALLETS,
};

export type ChainKey = "base" | "bnb";

export function getRpcUrl(chain: ChainKey): string {
  if (chain === "base") return required("NEXT_PUBLIC_RPC_BASE", ENV.NEXT_PUBLIC_RPC_BASE);
  // if (chain === "bnb") return required("NEXT_PUBLIC_RPC_BNB", ENV.NEXT_PUBLIC_RPC_BNB);
  return required("NEXT_PUBLIC_RPC_BASE", ENV.NEXT_PUBLIC_RPC_BASE);
}

export const CONFIG = {
  apiLpBaseUrl: optional(ENV.NEXT_PUBLIC_API_LP_BASE_URL, "http://127.0.0.1:8000/api"),
  apiSignalsBaseUrl: optional(ENV.NEXT_PUBLIC_API_SIGNALS_BASE_URL, "http://127.0.0.1:8080/api"),
  apiMarketDataUrl: optional(ENV.NEXT_PUBLIC_API_MARKET_DATA_URL, "http://127.0.0.1:8081/api"),
  
  /**
   * Admin allowlist (client guard only).
   * MUST be enforced again in api-lp (server-side) as the source of truth.
   */
  adminWallets: optional(ENV.NEXT_PUBLIC_ADMIN_WALLETS, "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean),
};
