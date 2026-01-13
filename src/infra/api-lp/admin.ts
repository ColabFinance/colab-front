import { apiLpGet, apiLpPost } from "@/infra/api-lp/client";

export type AdminFactoryResult = {
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

export async function apiLpAdminCreateStrategyRegistry(
  accessToken: string,
  body: CreateStrategyRegistryBody
): Promise<AdminFactoryResult> {
  return apiLpPost<AdminFactoryResult>("/admin/strategy-registry/create", body, accessToken);
}

export async function apiLpAdminCreateVaultFactory(
  accessToken: string,
  body: CreateVaultFactoryBody
): Promise<AdminFactoryResult> {
  return apiLpPost<AdminFactoryResult>("/admin/vault-factory/create", body, accessToken);
}

export async function apiLpAdminListOwners(accessToken: string): Promise<any[]> {
  return apiLpGet<any[]>("/admin/owners", accessToken);
}

export async function apiLpAdminListUsers(accessToken: string): Promise<any[]> {
  return apiLpGet<any[]>("/admin/users", accessToken);
}
