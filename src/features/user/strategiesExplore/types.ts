export type StrategyStatus = "active" | "inactive";

export type StrategyChain = "base" | "bnb";

export type StrategiesExploreSort = "updated_desc" | "name_asc" | "name_desc";

export type StrategiesExploreItem = {
  id: string;

  strategyId: number;
  strategyIdLabel: string;

  name: string;
  code: string;

  indicatorSetName: string;
  indicatorSetCode?: string | null;

  chain: StrategyChain;
  status: StrategyStatus;

  linkedVault: boolean;
  linkedVaultLabel?: string;

  updatedAtLabel: string;
  isPublic: boolean;
};