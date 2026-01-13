import { apiLpGet, apiLpPost } from "@/infra/api-lp/client";

export type AdminResult = {
  ok: boolean;
  message: string;
  data?: unknown;
};

export type CreateStrategyRegistryBody = {
  gas_strategy?: "default" | "buffered" | "aggressive";
  initial_owner: string;
};

export type CreateVaultFactoryBody = {
  gas_strategy?: "default" | "buffered" | "aggressive";
  initial_owner: string;
  strategy_registry: string;
  executor: string;
  fee_collector?: string;
  default_cooldown_sec?: number;
  default_max_slippage_bps?: number;
  default_allow_swap?: boolean;
};

export type CreateAdapterBody = {
  gas_strategy?: "default" | "buffered" | "aggressive";

  dex: string;

  pool: string;
  nfpm: string;
  gauge: string;

  token0: string;
  token1: string;

  pool_name: string;
  fee_bps: string;
  status?: "ACTIVE" | "INACTIVE";
};

export async function apiLpAdminCreateStrategyRegistry(
  accessToken: string,
  body: CreateStrategyRegistryBody
): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/strategy-registry/create", body, accessToken);
}

export async function apiLpAdminCreateVaultFactory(
  accessToken: string,
  body: CreateVaultFactoryBody
): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/vault-factory/create", body, accessToken);
}

export async function apiLpAdminListOwners(accessToken: string): Promise<any[]> {
  return apiLpGet<any[]>("/admin/owners", accessToken);
}

export async function apiLpAdminListUsers(accessToken: string): Promise<any[]> {
  return apiLpGet<any[]>("/admin/users", accessToken);
}

export async function apiLpAdminCreateAdapter(accessToken: string, payload: CreateAdapterBody): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/adapters/create", payload, accessToken);
}

export async function apiLpAdminListAdapters(accessToken: string): Promise<AdminResult> {
  return apiLpGet<AdminResult>("/admin/adapters", accessToken);
}