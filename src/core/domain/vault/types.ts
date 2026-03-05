export type RewardSwapDetails = {
  enabled: boolean;
  tokenIn: string;
  tokenOut: string;
  fee: number;
  sqrtPriceLimitX96: string;
};

export type VaultDetails = {
  address: string;
  dex?: string;
  
  owner: string;
  executor: string;
  adapter: string;
  dexRouter: string;
  feeCollector: string;
  strategyId: number;

  token0: string;
  token1: string;

  automationEnabled: boolean;
  cooldownSec: number;
  maxSlippageBps: number;
  allowSwap: boolean;

  dailyHarvestEnabled?: boolean;
  dailyHarvestCooldownSec?: number;
  lastDailyHarvestTs?: number;

  compoundEnabled?: boolean;
  compoundCooldownSec?: number;
  lastCompoundTs?: number;

  rewardSwap: RewardSwapDetails;

  positionTokenId: string; // big number -> string
  lastRebalanceTs: number; // unix seconds
};

export type TxRunResponse = {
  tx_hash: string;
  broadcasted: boolean;
  receipt?: Record<string, any> | null;
  status?: number | null;

  gas?: {
    limit?: number;
    used?: number;
    price_wei?: number;
    effective_price_wei?: number;
    cost_eth?: number | null;
    cost_usd?: number | null;
  };

  budget?: {
    max_gas_usd?: number | null;
    eth_usd_hint?: number | null;
    usd_estimated_upper_bound?: number | null;
    budget_exceeded?: boolean;
  };

  result?: Record<string, any>;
  ts?: string;
};

export type SwapPoolItem = {
  dex: string;
  pool: string;
};

export type VaultJobsConfig = {
  harvest_job?: Record<string, any>;
  compound_job?: Record<string, any>;
};

export type VaultRegistryConfig = {
  address?: string;

  adapter: string;
  pool: string;
  nfpm: string;
  gauge?: string;

  rpc_url: string;
  version: string;

  swap_pools?: Record<string, SwapPoolItem>;
  reward_swap_pool?: string;

  jobs?: VaultJobsConfig;

  reward_swap?: Record<string, any>;
};

export type VaultRegistryDocument = {
  id?: string;

  dex: string;
  chain: string;

  owner: string;
  par_token: string;

  alias: string;
  name: string;
  description?: string;

  strategy_id: number;

  config: VaultRegistryConfig;

  is_active: boolean;

  created_at?: number;
  created_at_iso?: string;
  updated_at?: number;
  updated_at_iso?: string;
};

export type CreateClientVaultRequest = {
  chain: "base" | string;
  dex: string;
  owner: string;

  par_token: string;

  name: string;
  description?: string;

  strategy_id: number;

  config: {
    adapter: string;
    pool: string;
    nfpm: string;
    gauge?: string;

    rpc_url: string;
    version: string;

    swap_pools?: Record<string, SwapPoolItem>;

    jobs?: VaultJobsConfig;
    reward_swap?: Record<string, any>;
    reward_swap_pool?: string;
  };

  gas_strategy?: string;
};

export type CreateClientVaultResponse = TxRunResponse & {
  vault?: VaultRegistryDocument;
};

export type RegisterClientVaultRequest = {
  vault_address: string;
  chain: string;
  dex: string;
  owner: string;
  par_token: string;
  name: string;
  description?: string;
  strategy_id: number;
  config: any;
};

export type RegisterClientVaultResponse = {
  alias: string;
  mongo_id: string;
};

export type UpdateCompoundConfigRequest = {
  enabled: boolean;
  cooldown_sec: number;
};

export type UpdateCompoundConfigResponse = {
  ok: boolean;
  data?: any;
  message?: string;
};

export type UpdateDailyHarvestConfigRequest = {
  enabled: boolean;
  cooldown_sec: number;
};

export type UpdateDailyHarvestConfigResponse = {
  ok: boolean;
  data?: any;
  message?: string;
};

export type UpdateRewardSwapConfigRequest = {
  enabled: boolean;
  token_in: string;
  token_out: string;
  fee: number;
  sqrt_price_limit_x96: string;
};

export type UpdateRewardSwapConfigResponse = {
  ok: boolean;
  data?: any;
  message?: string;
};
