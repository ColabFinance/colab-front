export type TxRunResponse = {
  tx_hash?: string;
  broadcasted?: boolean | null;
  receipt?: unknown;
  status?: number | null;
  gas_limit_used?: number | null;
  gas_price_wei?: number | null;
  gas_budget_check?: Record<string, unknown> | null;
};

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