export type TxRunResponse = {
  tx_hash?: string;
  broadcasted?: boolean | null;
  receipt?: unknown;
  status?: number | null;
  gas_limit_used?: number | null;
  gas_price_wei?: number | null;
  gas_budget_check?: Record<string, unknown> | null;
};
