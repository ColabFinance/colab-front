export type PricesBlock = {
  tick: number;
  p_t1_t0: number;
  p_t0_t1: number;
};

export type PricesPanel = {
  current: PricesBlock;
  lower: PricesBlock;
  upper: PricesBlock;
};

export type FeesUncollected = {
  token0: number;
  token1: number;
  usd?: number | null;
};

export type HoldingsSide = {
  token0: number;
  token1: number;
  total_usd?: number | null;
};

export type HoldingsBlock = {
  vault_idle: HoldingsSide;
  in_position: HoldingsSide;
  totals: HoldingsSide;
  symbols: {
    token0: string;
    token1: string;
  };
  addresses: {
    token0: string;
    token1: string;
  };
};

export type TokenMeta = {
  address: string;
  symbol: string;
  decimals: number;
};

export type GaugeRewards = {
  reward_token: string;
  reward_symbol: string;
  pending_raw: number;
  pending_amount: number;
  pending_usd_est?: number | null;
};

export type GaugeRewardBalances = {
  token: string;
  symbol: string;
  decimals: number;
  in_vault_raw: number;
  in_vault: number;
};

export type VaultStatus = {
  vault: string;

  owner: string;
  executor: string;
  adapter: string;
  dex_router: string;
  fee_collector: string;
  strategy_id: number;

  pool: string;
  nfpm: string;
  gauge: string;

  token0: TokenMeta;
  token1: TokenMeta;

  position_token_id: number;
  liquidity: number;
  lower_tick: number;
  upper_tick: number;
  tick_spacing: number;

  tick: number;
  sqrt_price_x96: number;
  prices: PricesPanel;

  out_of_range: boolean;
  range_side: "inside" | "below" | "above";

  holdings: HoldingsBlock;
  fees_uncollected: FeesUncollected;

  last_rebalance_ts: number;

  has_gauge: boolean;
  staked: boolean;
  position_location: "none" | "pool" | "gauge";

  gauge_rewards: GaugeRewards;
  gauge_reward_balances: GaugeRewardBalances;
};

export function isVaultStatus(x: any): x is VaultStatus {
  return (
    !!x &&
    typeof x === "object" &&
    typeof x.vault === "string" &&
    typeof x.owner === "string" &&
    typeof x.executor === "string" &&
    typeof x.adapter === "string" &&
    typeof x.pool === "string" &&
    typeof x.nfpm === "string" &&
    typeof x.gauge === "string" &&
    typeof x.strategy_id === "number" &&
    typeof x.position_token_id === "number" &&
    typeof x.liquidity === "number" &&
    typeof x.tick === "number" &&
    typeof x.lower_tick === "number" &&
    typeof x.upper_tick === "number" &&
    typeof x.tick_spacing === "number" &&
    typeof x.out_of_range === "boolean" &&
    typeof x.range_side === "string" &&
    !!x.token0 &&
    typeof x.token0.symbol === "string" &&
    !!x.token1 &&
    typeof x.token1.symbol === "string" &&
    !!x.prices &&
    !!x.holdings &&
    !!x.fees_uncollected &&
    !!x.gauge_rewards &&
    !!x.gauge_reward_balances
  );
}