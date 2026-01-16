
export type VaultDetails = {
  address: string;

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

export type VaultRegistryConfig = {
  address?: string;

  adapter: string;
  pool: string;
  nfpm: string;
  gauge?: string;

  rpc_url: string;
  version: string;

  swap_pools?: Record<string, SwapPoolItem>;
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
  // identity
  chain: "base" | string;
  dex: string;
  owner: string;

  // alias generation key
  par_token: string;

  // metadata
  name: string;
  description?: string;

  // wiring
  strategy_id: number;

  // config for vault_registry
  config: {
    adapter: string;
    pool: string;
    nfpm: string;
    gauge?: string;

    rpc_url: string;
    version: string;

    swap_pools?: Record<string, SwapPoolItem>;
  };

  // tx
  gas_strategy?: string;
};

export type CreateClientVaultResponse = TxRunResponse & {
  vault?: VaultRegistryDocument;
};
