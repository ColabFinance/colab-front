import { apiLpGet, apiLpPost } from "@/infra/api-lp/client";

export type AdminResult = {
  ok: boolean;
  message: string;
  data?: unknown;
};

export type ChainKey = "base" | "bnb";

export type CreateStrategyRegistryBody = {
  chain: ChainKey;
  gas_strategy?: "default" | "buffered" | "aggressive";
  initial_owner: string;
};

export type CreateVaultFactoryBody = {
  chain: ChainKey;
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
  chain: ChainKey;
  gas_strategy?: "default" | "buffered" | "aggressive";

  dex: string;

  pool: string;
  nfpm: string;
  gauge: string;

  fee_buffer: string;

  token0: string;
  token1: string;

  pool_name: string;
  fee_bps: string;
  status?: "ACTIVE" | "INACTIVE";
};

export type CreateDexBody = {
  chain: ChainKey;
  dex: string;
  dex_router: string;
  status?: "ACTIVE" | "INACTIVE";
};

export type CreateDexPoolBody = {
  chain: ChainKey;
  dex: string;

  pool: string;
  nfpm: string;
  gauge: string;

  token0: string;
  token1: string;

  pair?: string;
  symbol?: string;

  fee_bps: number;

  adapter?: string | null;
  reward_token?: string | null;
  reward_swap_pool?: string | null;
  status?: "ACTIVE" | "INACTIVE";
};

export type CreateProtocolFeeCollectorBody = {
  chain: ChainKey;
  gas_strategy?: "default" | "buffered" | "aggressive";
  initial_owner: string;
  treasury: string;
  protocol_fee_bps: number; // uint16
};

export type CreateVaultFeeBufferBody = {
  chain: ChainKey;
  gas_strategy?: "default" | "buffered" | "aggressive";
  initial_owner: string;
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

export async function apiLpAdminListAdapters(
  accessToken: string,
  chain: ChainKey
): Promise<AdminResult> {
  return apiLpGet<AdminResult>(`/admin/adapters?chain=${chain}`, accessToken);
}

export async function apiLpAdminCreateDex(accessToken: string, body: CreateDexBody): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/dexes/create", body, accessToken);
}

export async function apiLpAdminCreateDexPool(accessToken: string, body: CreateDexPoolBody): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/dexes/pools/create", body, accessToken);
}

export async function apiLpAdminCreateProtocolFeeCollector(
  accessToken: string,
  body: CreateProtocolFeeCollectorBody
): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/protocol-fee-collector/create", body, accessToken);
}

export async function apiLpAdminCreateVaultFeeBuffer(
  accessToken: string,
  body: CreateVaultFeeBufferBody
): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/vault-fee-buffer/create", body, accessToken);
}