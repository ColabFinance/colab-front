export type VaultUserEventTransfer = {
  token: string;
  from: string;
  to: string;
  amount_raw: string;
  symbol?: string;
  decimals?: number;
};

export type VaultUserEvent = {
  id: string;

  vault: string;
  alias?: string;

  chain: string;
  dex?: string;

  event_type: "deposit" | "withdraw";
  owner?: string;

  token?: string;
  amount_human?: string;
  amount_raw?: string;
  decimals?: number;

  to?: string;
  transfers?: VaultUserEventTransfer[];

  tx_hash: string;
  block_number?: number;

  ts_ms: number;
  ts_iso: string;
};

export type VaultUserEventsListResponse = {
  ok: boolean;
  message: string;
  data: VaultUserEvent[];
  total?: number;
};

export type PersistDepositEventRequest = {
  chain: string;
  dex?: string;
  owner?: string;

  token: string;
  amount_human?: string;
  amount_raw?: string;
  decimals?: number;

  tx_hash: string;
  receipt?: Record<string, any> | null;

  from_addr?: string;
  to_addr?: string;
};

export type PersistWithdrawEventRequest = {
  chain: string;
  dex?: string;
  owner?: string;

  to: string;

  tx_hash: string;
  receipt?: Record<string, any> | null;

  token_addresses?: string[];
};
