export type StrategyStatus = "active" | "inactive";

export type StrategyChain = "ethereum" | "base" | "arbitrum" | "polygon" | "optimism";

export type StrategiesExploreSort = "updated_desc" | "name_asc" | "name_desc";

export type StrategiesExploreItem = {
  id: string;
  strategyIdLabel: string;

  name: string;
  code: string;

  indicatorSetName: string;
  indicatorSetCode: string;

  chain: StrategyChain;
  status: StrategyStatus;

  linkedVault: boolean;
  linkedVaultLabel?: string;

  updatedAtLabel: string;

  isPublic: boolean;
};