export type CashflowItem = {
  event_type: string; // deposit|withdraw
  ts_ms: number;
  ts_iso: string;

  token?: string | null;
  amount_human?: string | null;
  amount_raw?: string | null;
  decimals?: number | null;

  amount_usd?: number | null;
  amount_usd_source?: string | null; // stable|spot_est|unknown

  tx_hash: string;
};

export type CashflowTotals = {
  deposited_usd?: number | null;
  withdrawn_usd?: number | null;
  net_contributed_usd?: number | null;

  missing_usd_count: number;
};

export type CurrentValueBlock = {
  total_usd?: number | null;
  in_position_usd?: number | null;
  vault_idle_usd?: number | null;

  fees_uncollected_usd?: number | null;
  rewards_pending_usd?: number | null;

  source: string; // live_status|last_episode|unknown
};

export type ProfitAnnualized = {
  method: string; // modified_dietz
  days?: number | null;

  daily_rate?: number | null;
  apr?: number | null;
  apy_daily_compound?: number | null;
};

export type ProfitBlock = {
  profit_usd?: number | null;
  profit_pct?: number | null;

  profit_net_gas_usd?: number | null;
  profit_net_gas_pct?: number | null;

  annualized: ProfitAnnualized;
};

export type EpisodeItem = {
  id?: string | null;
  status: string;

  open_time: number;
  open_time_iso?: string | null;
  close_time?: number | null;
  close_time_iso?: string | null;

  open_price?: number | null;
  close_price?: number | null;

  Pa?: number | null;
  Pb?: number | null;

  pool_type?: string | null;
  mode_on_open?: string | null;
  majority_on_open?: string | null;

  last_event_bar?: number | null;
  metrics?: Record<string, any> | null;
};

export type EpisodesBlock = {
  items: EpisodeItem[];
  total?: number | null;
};

export type GasCostsBlock = {
  total_gas_usd: number;
  tx_count: number;
};

export type VaultPerformanceData = {
  vault: Record<string, any>;
  period: Record<string, any>;

  cashflows: CashflowItem[];
  cashflows_totals: CashflowTotals;

  current_value: CurrentValueBlock;

  gas_costs: GasCostsBlock;
  profit: ProfitBlock;

  episodes: EpisodesBlock;
};

export type VaultPerformanceResponse = {
  ok: boolean;
  message: string;
  data: VaultPerformanceData;
};
