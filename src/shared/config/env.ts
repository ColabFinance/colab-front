import type { ChainKey } from "@/shared/config/chains";
import { CHAINS } from "@/shared/config/chains";

function required(name: string, value?: string) {
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

function optional(value?: string, fallback?: string) {
  return value ?? fallback ?? "";
}

function normalizeChainKey(raw?: string): ChainKey {
  const x = (raw || "").toLowerCase().trim();
  if (x === "base") return "base";
  if (x === "bnb" || x === "bsc") return "bnb";
  return "base";
}

/**
 * IMPORTANT:
 * Next only inlines envs in client bundles when access is STATIC
 * (process.env.NEXT_PUBLIC_XXX). Dynamic indexing breaks it.
 */
const ENV = {
  NEXT_PUBLIC_CHAIN: process.env.NEXT_PUBLIC_CHAIN,

  // RPC per chain
  NEXT_PUBLIC_RPC_BASE: process.env.NEXT_PUBLIC_RPC_BASE,
  NEXT_PUBLIC_RPC_BNB: process.env.NEXT_PUBLIC_RPC_BNB,

  // Contracts per chain
  NEXT_PUBLIC_STRATEGY_REGISTRY_ADDRESS_BASE: process.env.NEXT_PUBLIC_STRATEGY_REGISTRY_ADDRESS_BASE,
  NEXT_PUBLIC_VAULT_FACTORY_ADDRESS_BASE: process.env.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS_BASE,
  NEXT_PUBLIC_ADAPTER_ADDRESS_BASE: process.env.NEXT_PUBLIC_ADAPTER_ADDRESS_BASE,
  NEXT_PUBLIC_FEE_COLLECTOR_ADDRESS_BASE: process.env.NEXT_PUBLIC_FEE_COLLECTOR_ADDRESS_BASE,

  NEXT_PUBLIC_STRATEGY_REGISTRY_ADDRESS_BNB: process.env.NEXT_PUBLIC_STRATEGY_REGISTRY_ADDRESS_BNB,
  NEXT_PUBLIC_VAULT_FACTORY_ADDRESS_BNB: process.env.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS_BNB,
  NEXT_PUBLIC_ADAPTER_ADDRESS_BNB: process.env.NEXT_PUBLIC_ADAPTER_ADDRESS_BNB,
  NEXT_PUBLIC_FEE_COLLECTOR_ADDRESS_BNB: process.env.NEXT_PUBLIC_FEE_COLLECTOR_ADDRESS_BNB,

  // API
  NEXT_PUBLIC_API_LP_BASE_URL: process.env.NEXT_PUBLIC_API_LP_BASE_URL,

  // Admin
  NEXT_PUBLIC_ADMIN_WALLETS: process.env.NEXT_PUBLIC_ADMIN_WALLETS,
};

const chainKey = normalizeChainKey(ENV.NEXT_PUBLIC_CHAIN);

function pickRpc(chain: ChainKey) {
  if (chain === "base") return required("NEXT_PUBLIC_RPC_BASE", ENV.NEXT_PUBLIC_RPC_BASE);
  if (chain === "bnb") return required("NEXT_PUBLIC_RPC_BNB", ENV.NEXT_PUBLIC_RPC_BNB);
  return required("NEXT_PUBLIC_RPC_BASE", ENV.NEXT_PUBLIC_RPC_BASE);
}

function pickContracts(chain: ChainKey) {
  if (chain === "base") {
    return {
      strategyRegistry: required(
        "NEXT_PUBLIC_STRATEGY_REGISTRY_ADDRESS_BASE",
        ENV.NEXT_PUBLIC_STRATEGY_REGISTRY_ADDRESS_BASE
      ),
      vaultFactory: required("NEXT_PUBLIC_VAULT_FACTORY_ADDRESS_BASE", ENV.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS_BASE),
      adapter: required("NEXT_PUBLIC_ADAPTER_ADDRESS_BASE", ENV.NEXT_PUBLIC_ADAPTER_ADDRESS_BASE),
      feeCollector: required("NEXT_PUBLIC_FEE_COLLECTOR_ADDRESS_BASE", ENV.NEXT_PUBLIC_FEE_COLLECTOR_ADDRESS_BASE),
    };
  }

  // bnb
  return {
    strategyRegistry: required(
      "NEXT_PUBLIC_STRATEGY_REGISTRY_ADDRESS_BNB",
      ENV.NEXT_PUBLIC_STRATEGY_REGISTRY_ADDRESS_BNB
    ),
    vaultFactory: required("NEXT_PUBLIC_VAULT_FACTORY_ADDRESS_BNB", ENV.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS_BNB),
    adapter: required("NEXT_PUBLIC_ADAPTER_ADDRESS_BNB", ENV.NEXT_PUBLIC_ADAPTER_ADDRESS_BNB),
    feeCollector: required("NEXT_PUBLIC_FEE_COLLECTOR_ADDRESS_BNB", ENV.NEXT_PUBLIC_FEE_COLLECTOR_ADDRESS_BNB),
  };
}

export const CONFIG = {
  chainKey,
  chain: CHAINS[chainKey],
  rpcUrl: pickRpc(chainKey),
  contracts: pickContracts(chainKey),
  apiLpBaseUrl: optional(ENV.NEXT_PUBLIC_API_LP_BASE_URL, "http://127.0.0.1:8000/api"),

  /**
   * Admin allowlist (client guard only).
   * MUST be enforced again in api-lp (server-side) as the source of truth.
   */
  adminWallets: optional(ENV.NEXT_PUBLIC_ADMIN_WALLETS, "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean),
};
