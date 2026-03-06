export type VaultTabKey = "overview" | "performance" | "events" | "position";

export type VaultStatus = "ACTIVE" | "PAUSED" | "ERROR";

export type TokenInfo = {
  symbol: string;
  name: string;
};

export type VaultKpis = {
  tvlUsd: number;
  tvlChange24hPct: number;

  apyPct: number;
  aprPct: number;

  profitToDateUsd: number;
  profitToDatePct: number;

  uncollectedFeesUsd: number;
  uncollectedFees24hUsd: number;

  utilizationPct: number;
};

export type VaultComposition = {
  totalUsd: number;

  inPositionUsd: number;
  inPositionPct: number;
  inPositionToken0Amount: number;
  inPositionToken1Amount: number;

  idleUsd: number;
  idlePct: number;
  idleToken0Amount: number;
  idleToken1Amount: number;
};

export type VaultRange = {
  lastRebalanceLabel: string;
  inRange: boolean;

  minPrice: number;
  currentPrice: number;
  maxPrice: number;

  // purely visual band (like the highlighted range in your html mock)
  bandStartPct: number; // 0..100
  bandEndPct: number; // 0..100
};

export type FeeBufferItem = {
  symbol: string;
  label: string;
  amount: number;
  note: string;
  tone?: "slate" | "cyan" | "blue" | "green" | "amber" | "red" | "purple";
};

export type SystemHealth = {
  adapterStatus: "OPERATIONAL" | "DEGRADED" | "DOWN";
  poolConnection: "SYNCED" | "LAGGING" | "DISCONNECTED";
  readLatencyMs: number;

  allowlistCheck: "PASSED" | "FAILED";
  feeBufferHealth: "OPTIMAL" | "WARN" | "BAD";
};

export type VaultDetails = {
  address: string;

  chainName: string;
  dexName: string;

  token0: TokenInfo;
  token1: TokenInfo;

  feeTierLabel: string;
  poolAddress: string;

  status: VaultStatus;
  updatedAtLabel: string;

  kpis: VaultKpis;
  composition: VaultComposition;
  range: VaultRange;
  feeBuffer: FeeBufferItem[];
  health: SystemHealth;
};