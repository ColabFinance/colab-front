// src/domain/vault/status.ts

export type PricesBlock = {
  tick: number;
  p_t1_t0: number; // token1 per token0
  p_t0_t1: number; // token0 per token1
};

export type PricesPanel = {
  current: PricesBlock;
  lower: PricesBlock;
  upper: PricesBlock;
};

export type FeesUncollected = {
  token0: number;
  token1: number;
  usd?: number; // opcional (você pode não ter ainda)
};

export type HoldingsSide = {
  token0: number;
  token1: number;
  usd?: number; // opcional
};

export type HoldingsBlock = {
  totals: HoldingsSide;
  vault_idle?: HoldingsSide;     // opcional (se o back ainda não envia)
  in_position?: HoldingsSide;    // opcional
};

export type TokenMeta = {
  address: string;
  symbol: string;
  decimals: number;
};

export type VaultStatus = {
  // identity / wiring
  vault: string;
  pool: string;
  adapter: string;
  nfpm: string | null;
  gauge: string | null;

  tick_spacing: string | null;

  // token meta
  token0: TokenMeta;
  token1: TokenMeta;

  // prices + range
  tick: number;
  lower_tick: number;
  upper_tick: number;
  range_side: "inside" | "below" | "above";
  out_of_range: boolean;

  prices: PricesPanel;

  // fees + holdings
  fees_uncollected: FeesUncollected;
  holdings: HoldingsBlock;

  // timestamps
  last_rebalance_ts: number;
};

export function isVaultStatus(x: any): x is VaultStatus {
  return (
    !!x &&
    typeof x === "object" &&
    typeof x.vault === "string" &&
    typeof x.pool === "string" &&
    typeof x.tick === "number" &&
    typeof x.lower_tick === "number" &&
    typeof x.upper_tick === "number" &&
    !!x.token0 &&
    typeof x.token0.symbol === "string" &&
    !!x.token1 &&
    typeof x.token1.symbol === "string"
  );
}
