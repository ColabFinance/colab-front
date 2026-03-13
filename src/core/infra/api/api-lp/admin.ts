import { apiLpGet, apiLpPost } from "@/core/infra/api/api-lp/client";

export type AdminResult = {
  ok: boolean;
  message: string;
  tx_hash?: string;
  result?: unknown;
  data?: unknown;
  detail?: unknown;
};

export type ChainKey = "base" | "bnb";

export type ChainRegistryStatus = "ENABLED" | "MAINTENANCE" | "DISABLED";

export type AdminChainItem = {
  id?: string;
  key: string;
  name: string;
  chain_id: number;
  status: ChainRegistryStatus;

  rpc_url: string;

  explorer_url: string;
  explorer_label: string;

  native_symbol: string;
  stables: string[];

  logo_url?: string;

  created_at?: number;
  created_at_iso?: string;
  updated_at?: number;
  updated_at_iso?: string;
};

export type AdminChainResult = AdminResult & {
  data?: AdminChainItem;
};

export type AdminChainsResult = AdminResult & {
  data?: AdminChainItem[];
};

export type CreateChainBody = {
  name: string;
  chain_id: number;
  native_symbol: string;

  rpc_url: string;

  explorer_url: string;
  explorer_label?: string;

  stables: string[];
  status?: ChainRegistryStatus;

  logo_url?: string | null;
};

export type UpdateChainBody = CreateChainBody & {
  key: string;
};

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

export type CreateProtocolFeeCollectorBody = {
  chain: ChainKey;
  gas_strategy?: "default" | "buffered" | "aggressive";
  initial_owner: string;
  treasury: string;
  protocol_fee_bps: number;
};

export type CreateVaultFeeBufferBody = {
  chain: ChainKey;
  gas_strategy?: "default" | "buffered" | "aggressive";
  initial_owner: string;
};

export type AdminContractRecord = {
  chain: string;
  address: string;
  status: string;
  tx_hash?: string | null;

  owner?: string | null;

  treasury?: string | null;
  protocol_fee_bps?: number | null;

  strategy_registry?: string | null;
  executor?: string | null;
  fee_collector?: string | null;
  default_cooldown_sec?: number | null;
  default_max_slippage_bps?: number | null;
  default_allow_swap?: boolean | null;

  created_at?: number | null;
  created_at_iso?: string | null;
  updated_at?: number | null;
  updated_at_iso?: string | null;
};

export type AdminContractListPayload = {
  active?: AdminContractRecord | null;
  history?: AdminContractRecord[];
};

export type AdminContractListResult = AdminResult & {
  result?: AdminContractListPayload;
};

export async function apiLpAdminCreateChain(
  accessToken: string,
  body: CreateChainBody
): Promise<AdminChainResult> {
  return apiLpPost<AdminChainResult>("/admin/chains/create", body, accessToken);
}

export async function apiLpAdminUpdateChain(
  accessToken: string,
  body: UpdateChainBody
): Promise<AdminChainResult> {
  return apiLpPost<AdminChainResult>("/admin/chains/update", body, accessToken);
}

export async function apiLpAdminListChains(
  accessToken: string,
  limit = 500
): Promise<AdminChainsResult> {
  return apiLpGet<AdminChainsResult>(`/admin/chains?limit=${limit}`, accessToken);
}

export async function apiLpAdminCreateStrategyRegistry(
  accessToken: string,
  body: CreateStrategyRegistryBody
): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/strategy-registry/create", body, accessToken);
}

export async function apiLpAdminListStrategyRegistries(
  accessToken: string,
  chain: ChainKey,
  limit = 50
): Promise<AdminContractListResult> {
  return apiLpGet<AdminContractListResult>(
    `/admin/strategy-registry?chain=${chain}&limit=${limit}`,
    accessToken
  );
}

export async function apiLpAdminCreateVaultFactory(
  accessToken: string,
  body: CreateVaultFactoryBody
): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/vault-factory/create", body, accessToken);
}

export async function apiLpAdminListVaultFactories(
  accessToken: string,
  chain: ChainKey,
  limit = 50
): Promise<AdminContractListResult> {
  return apiLpGet<AdminContractListResult>(
    `/admin/vault-factory?chain=${chain}&limit=${limit}`,
    accessToken
  );
}

export async function apiLpAdminListOwners(accessToken: string): Promise<any[]> {
  return apiLpGet<any[]>("/admin/owners", accessToken);
}

export async function apiLpAdminListUsers(accessToken: string): Promise<any[]> {
  return apiLpGet<any[]>("/admin/users", accessToken);
}

export async function apiLpAdminCreateProtocolFeeCollector(
  accessToken: string,
  body: CreateProtocolFeeCollectorBody
): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/protocol-fee-collector/create", body, accessToken);
}

export async function apiLpAdminListProtocolFeeCollectors(
  accessToken: string,
  chain: ChainKey,
  limit = 50
): Promise<AdminContractListResult> {
  return apiLpGet<AdminContractListResult>(
    `/admin/protocol-fee-collector?chain=${chain}&limit=${limit}`,
    accessToken
  );
}

export async function apiLpAdminCreateVaultFeeBuffer(
  accessToken: string,
  body: CreateVaultFeeBufferBody
): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/vault-fee-buffer/create", body, accessToken);
}

export async function apiLpAdminListVaultFeeBuffers(
  accessToken: string,
  chain: ChainKey,
  limit = 50
): Promise<AdminContractListResult> {
  return apiLpGet<AdminContractListResult>(
    `/admin/vault-fee-buffer?chain=${chain}&limit=${limit}`,
    accessToken
  );
}

export type CreateDexBody = {
  chain: ChainKey | string;
  dex: string;
  dex_router: string;
  status?: "ACTIVE" | "INACTIVE";
};

export type UpdateDexBody = {
  chain: ChainKey | string;
  dex: string;
  dex_router: string;
  status?: "ACTIVE" | "INACTIVE";
};

export type AdminDexPoolType = "VOLATILE" | "STABLE" | "WEIGHTED" | "CONCENTRATED";

export type CreateDexPoolBody = {
  chain: ChainKey | string;
  dex: string;

  pool: string;
  nfpm: string;
  gauge: string;

  token0: string;
  token1: string;

  pair?: string;
  symbol?: string;

  fee_bps: number;
  tick_spacing?: number | null;
  pool_type?: AdminDexPoolType;

  adapter?: string | null;
  reward_token: string;
  reward_swap_pool?: string | null;
  status?: "ACTIVE" | "INACTIVE";
};

export type UpdateDexPoolBody = {
  chain: ChainKey | string;
  dex: string;

  pool: string;
  nfpm: string;
  gauge: string;

  token0: string;
  token1: string;

  pair?: string;
  symbol?: string;

  fee_bps: number;
  tick_spacing?: number | null;
  pool_type?: AdminDexPoolType;

  adapter?: string | null;
  reward_token: string;
  reward_swap_pool?: string | null;
  status?: "ACTIVE" | "INACTIVE";
};

export type AdminDexItem = {
  chain: string;
  dex: string;
  dex_router: string;
  status: "ACTIVE" | "INACTIVE";
  created_at?: number | null;
  created_at_iso?: string | null;
  updated_at?: number | null;
  updated_at_iso?: string | null;
};

export type AdminDexesResult = AdminResult & {
  data?: AdminDexItem[];
};

export type AdminDexPoolItem = {
  chain: string;
  dex: string;
  pool: string;
  nfpm: string;
  gauge: string;
  token0: string;
  token1: string;
  pair?: string | null;
  symbol?: string | null;
  fee_bps: number;
  fee_rate: string;
  tick_spacing?: number | null;
  pool_type?: AdminDexPoolType | null;
  adapter?: string | null;
  reward_token?: string | null;
  reward_swap_pool?: string | null;
  status: "ACTIVE" | "INACTIVE";
  created_at?: number | string | null;
  created_at_iso?: string | null;
  updated_at?: number | string | null;
  updated_at_iso?: string | null;
};

export type AdminDexPoolsResult = AdminResult & {
  data?: AdminDexPoolItem[];
};

export async function apiLpAdminCreateDex(
  accessToken: string,
  body: CreateDexBody
): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/dexes/create", body, accessToken);
}

export async function apiLpAdminUpdateDex(
  accessToken: string,
  body: UpdateDexBody
): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/dexes/update", body, accessToken);
}

export async function apiLpAdminListDexes(
  accessToken: string,
  chain: string,
  limit = 200
): Promise<AdminDexesResult> {
  return apiLpGet<AdminDexesResult>(`/admin/dexes?chain=${chain}&limit=${limit}`, accessToken);
}

export async function apiLpAdminCreateDexPool(
  accessToken: string,
  body: CreateDexPoolBody
): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/dexes/pools/create", body, accessToken);
}

export async function apiLpAdminUpdateDexPool(
  accessToken: string,
  body: UpdateDexPoolBody
): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/dexes/pools/update", body, accessToken);
}

export async function apiLpAdminListDexPools(
  accessToken: string,
  chain: string,
  dex: string,
  limit = 500
): Promise<AdminDexPoolsResult> {
  return apiLpGet<AdminDexPoolsResult>(
    `/admin/dexes/pools?chain=${chain}&dex=${dex}&limit=${limit}`,
    accessToken
  );
}

export type AdminAdapterStatus = "ACTIVE" | "ARCHIVED_CAN_CREATE_NEW";

export type CreateAdapterBody = {
  chain: string;
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
  status?: AdminAdapterStatus;
};

export type AdminAdapterItem = {
  chain: string;
  address: string;
  tx_hash?: string | null;

  dex: string;

  pool: string;
  nfpm: string;
  gauge: string;
  fee_buffer: string;

  token0: string;
  token1: string;

  pool_name: string;
  fee_bps: string;
  status: AdminAdapterStatus;

  created_at?: string | null;
  created_by?: string | null;
};

export type AdminAdaptersResult = AdminResult & {
  data?: AdminAdapterItem[];
};

export async function apiLpAdminCreateAdapter(
  accessToken: string,
  payload: CreateAdapterBody
): Promise<AdminResult> {
  return apiLpPost<AdminResult>("/admin/adapters/create", payload, accessToken);
}

export async function apiLpAdminListAdapters(
  accessToken: string,
  chain: string
): Promise<AdminAdaptersResult> {
  return apiLpGet<AdminAdaptersResult>(`/admin/adapters?chain=${chain}`, accessToken);
}

export type AdminOnchainContractRef = {
  chain: string;
  address: string;
  status: string;
  tx_hash?: string | null;
  owner?: string | null;
  created_at?: number | null;
  created_at_iso?: string | null;
  updated_at?: number | null;
  updated_at_iso?: string | null;
};

export type AdminOnchainStrategyAllowlistRecord = {
  id?: string;
  chain: string;
  contract_address: string;
  entry_type: "router" | "adapter";
  address: string;
  label: string;
  adapter_type?: string | null;
  desired_allowed: boolean;
  tx_hash?: string | null;
  updated_by?: string | null;
  created_at?: number | null;
  created_at_iso?: string | null;
  updated_at?: number | null;
  updated_at_iso?: string | null;
};

export type AdminOnchainVaultFactoryConfigRecord = {
  id?: string;
  chain: string;
  contract_address: string;
  executor: string;
  fee_collector: string;
  default_cooldown_sec: number;
  default_max_slippage_bps: number;
  default_allow_swap: boolean;
  tx_hash?: string | null;
  updated_by?: string | null;
  created_at?: number | null;
  created_at_iso?: string | null;
  updated_at?: number | null;
  updated_at_iso?: string | null;
};

export type AdminOnchainProtocolFeeCollectorConfigRecord = {
  id?: string;
  chain: string;
  contract_address: string;
  treasury: string;
  protocol_fee_bps: number;
  tx_hash?: string | null;
  updated_by?: string | null;
  created_at?: number | null;
  created_at_iso?: string | null;
  updated_at?: number | null;
  updated_at_iso?: string | null;
};

export type AdminOnchainProtocolFeeReporterRecord = {
  id?: string;
  chain: string;
  contract_address: string;
  reporter: string;
  desired_allowed: boolean;
  tx_hash?: string | null;
  updated_by?: string | null;
  created_at?: number | null;
  created_at_iso?: string | null;
  updated_at?: number | null;
  updated_at_iso?: string | null;
};

export type AdminOnchainVaultFeeBufferDepositorRecord = {
  id?: string;
  chain: string;
  contract_address: string;
  depositor: string;
  label?: string | null;
  desired_allowed: boolean;
  tx_hash?: string | null;
  updated_by?: string | null;
  created_at?: number | null;
  created_at_iso?: string | null;
  updated_at?: number | null;
  updated_at_iso?: string | null;
};

export type AdminOnchainStrategyRegistryStateResult = AdminResult & {
  data?: {
    contract?: AdminOnchainContractRef | null;
    routers: AdminOnchainStrategyAllowlistRecord[];
    adapters: AdminOnchainStrategyAllowlistRecord[];
  };
};

export type AdminOnchainVaultFactoryStateResult = AdminResult & {
  data?: {
    contract?: AdminOnchainContractRef | null;
    saved_config?: AdminOnchainVaultFactoryConfigRecord | null;
  };
};

export type AdminOnchainProtocolFeeCollectorStateResult = AdminResult & {
  data?: {
    contract?: AdminOnchainContractRef | null;
    saved_config?: AdminOnchainProtocolFeeCollectorConfigRecord | null;
    reporters: AdminOnchainProtocolFeeReporterRecord[];
  };
};

export type AdminOnchainVaultFeeBufferStateResult = AdminResult & {
  data?: {
    contract?: AdminOnchainContractRef | null;
    depositors: AdminOnchainVaultFeeBufferDepositorRecord[];
  };
};

export type SaveStrategyRouterStateBody = {
  chain: string;
  contract_address?: string | null;
  address: string;
  name: string;
  allowed: boolean;
  tx_hash?: string | null;
};

export type SaveStrategyAdapterStateBody = {
  chain: string;
  contract_address?: string | null;
  address: string;
  label: string;
  adapter_type?: string | null;
  allowed: boolean;
  tx_hash?: string | null;
};

export type SaveVaultFactoryStateBody = {
  chain: string;
  contract_address?: string | null;
  executor: string;
  fee_collector: string;
  default_cooldown_sec: number;
  default_max_slippage_bps: number;
  default_allow_swap: boolean;
  tx_hash?: string | null;
};

export type SaveProtocolFeeCollectorStateBody = {
  chain: string;
  contract_address?: string | null;
  treasury: string;
  protocol_fee_bps: number;
  tx_hash?: string | null;
};

export type SaveProtocolFeeReporterStateBody = {
  chain: string;
  contract_address?: string | null;
  reporter: string;
  allowed: boolean;
  tx_hash?: string | null;
};

export type SaveVaultFeeBufferDepositorStateBody = {
  chain: string;
  contract_address?: string | null;
  depositor: string;
  label?: string | null;
  allowed: boolean;
  tx_hash?: string | null;
};

export async function apiLpAdminListOnchainStrategyRegistryState(
  accessToken: string,
  chain: string
): Promise<AdminOnchainStrategyRegistryStateResult> {
  return apiLpGet<AdminOnchainStrategyRegistryStateResult>(
    `/admin/onchain-config/strategy-registry?chain=${chain}`,
    accessToken
  );
}

export async function apiLpAdminSaveStrategyRouterState(
  accessToken: string,
  body: SaveStrategyRouterStateBody
): Promise<AdminOnchainStrategyRegistryStateResult> {
  return apiLpPost<AdminOnchainStrategyRegistryStateResult>(
    "/admin/onchain-config/strategy-registry/router",
    body,
    accessToken
  );
}

export async function apiLpAdminSaveStrategyAdapterState(
  accessToken: string,
  body: SaveStrategyAdapterStateBody
): Promise<AdminOnchainStrategyRegistryStateResult> {
  return apiLpPost<AdminOnchainStrategyRegistryStateResult>(
    "/admin/onchain-config/strategy-registry/adapter",
    body,
    accessToken
  );
}

export async function apiLpAdminListOnchainVaultFactoryState(
  accessToken: string,
  chain: string
): Promise<AdminOnchainVaultFactoryStateResult> {
  return apiLpGet<AdminOnchainVaultFactoryStateResult>(
    `/admin/onchain-config/vault-factory?chain=${chain}`,
    accessToken
  );
}

export async function apiLpAdminSaveVaultFactoryState(
  accessToken: string,
  body: SaveVaultFactoryStateBody
): Promise<AdminOnchainVaultFactoryStateResult> {
  return apiLpPost<AdminOnchainVaultFactoryStateResult>(
    "/admin/onchain-config/vault-factory",
    body,
    accessToken
  );
}

export async function apiLpAdminListOnchainProtocolFeeCollectorState(
  accessToken: string,
  chain: string
): Promise<AdminOnchainProtocolFeeCollectorStateResult> {
  return apiLpGet<AdminOnchainProtocolFeeCollectorStateResult>(
    `/admin/onchain-config/protocol-fee-collector?chain=${chain}`,
    accessToken
  );
}

export async function apiLpAdminSaveProtocolFeeCollectorState(
  accessToken: string,
  body: SaveProtocolFeeCollectorStateBody
): Promise<AdminOnchainProtocolFeeCollectorStateResult> {
  return apiLpPost<AdminOnchainProtocolFeeCollectorStateResult>(
    "/admin/onchain-config/protocol-fee-collector",
    body,
    accessToken
  );
}

export async function apiLpAdminSaveProtocolFeeReporterState(
  accessToken: string,
  body: SaveProtocolFeeReporterStateBody
): Promise<AdminOnchainProtocolFeeCollectorStateResult> {
  return apiLpPost<AdminOnchainProtocolFeeCollectorStateResult>(
    "/admin/onchain-config/protocol-fee-collector/reporter",
    body,
    accessToken
  );
}

export async function apiLpAdminListOnchainVaultFeeBufferState(
  accessToken: string,
  chain: string
): Promise<AdminOnchainVaultFeeBufferStateResult> {
  return apiLpGet<AdminOnchainVaultFeeBufferStateResult>(
    `/admin/onchain-config/vault-fee-buffer?chain=${chain}`,
    accessToken
  );
}

export async function apiLpAdminSaveVaultFeeBufferDepositorState(
  accessToken: string,
  body: SaveVaultFeeBufferDepositorStateBody
): Promise<AdminOnchainVaultFeeBufferStateResult> {
  return apiLpPost<AdminOnchainVaultFeeBufferStateResult>(
    "/admin/onchain-config/vault-fee-buffer/depositor",
    body,
    accessToken
  );
}