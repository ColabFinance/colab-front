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

  // Client base URLs (should be rewrite paths)
  NEXT_PUBLIC_API_LP_BASE_URL: process.env.NEXT_PUBLIC_API_LP_BASE_URL,
  NEXT_PUBLIC_API_SIGNALS_BASE_URL: process.env.NEXT_PUBLIC_API_SIGNALS_BASE_URL,
  NEXT_PUBLIC_API_MARKET_DATA_URL: process.env.NEXT_PUBLIC_API_MARKET_DATA_URL,

  // Admin
  NEXT_PUBLIC_ADMIN_WALLETS: process.env.NEXT_PUBLIC_ADMIN_WALLETS,
};

export type ChainKey = "base" | "bnb";

export function getRpcUrl(chain: ChainKey): string {
  if (chain === "base") return required("NEXT_PUBLIC_RPC_BASE", ENV.NEXT_PUBLIC_RPC_BASE);
  // if (chain === "bnb") return required("NEXT_PUBLIC_RPC_BNB", ENV.NEXT_PUBLIC_RPC_BNB);
  return required("NEXT_PUBLIC_RPC_BASE", ENV.NEXT_PUBLIC_RPC_BASE);
}

/**
 * Used by client code (fetch base URLs).
 * Defaults to rewrite paths to avoid CORS in production.
 */
export const CONFIG = {
  apiLpBaseUrl: optional(ENV.NEXT_PUBLIC_API_LP_BASE_URL, "/lp/api"),
  apiSignalsBaseUrl: optional(ENV.NEXT_PUBLIC_API_SIGNALS_BASE_URL, "/signals/api"),
  apiMarketDataUrl: optional(ENV.NEXT_PUBLIC_API_MARKET_DATA_URL, "/market-data/api"),

  adminWallets: optional(ENV.NEXT_PUBLIC_ADMIN_WALLETS, "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean),
};
