export type StrategyRisk = "low" | "medium" | "high";

export type StrategyType =
  | "delta_neutral"
  | "momentum"
  | "stable_compound"
  | "mean_reversion"
  | "passive"
  | "custom";

export type StrategiesExploreSort = "tvl_desc" | "apy_desc" | "apr_desc" | "vaults_desc";

export type StrategiesExploreItem = {
  id: string;
  name: string;
  code: string;
  description: string;

  risk: StrategyRisk;
  type: StrategyType;

  vaults: number;

  aprPct: number; // 0..100
  apyPct: number; // 0..100
  tvlUsd: number;

  tags: string[];
  updatedAtLabel: string;
};