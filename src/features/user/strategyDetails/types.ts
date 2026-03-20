export type StrategyStatus = "ACTIVE" | "INACTIVE";

export type StrategyTier = {
  name: string;
  atrPctThreshold: number;
  atrPctThresholdDown: number;
  barsRequired: number;
  maxMajorSidePct: number;
  allowedFrom: string[];
};

export type StrategyDetails = {
  id: number;
  name: string;
  symbol: string;
  status: StrategyStatus;
  isPublic: boolean;

  chainKey: "base" | "bnb";
  chainName: string;

  dexKey?: string | null;
  dexName: string;

  pairLabel: string;
  feeTierLabel: string;

  owner: string;
  strategyId: number;

  indicatorSetId: string;
  indicatorSource: string;
  indicatorStreamKey: string;
  marketSymbol: string;

  emaFast: number;
  emaSlow: number;
  atrWindow: number;

  vaultAlias?: string | null;
  vaultHref?: string | null;

  adapterAddress?: string | null;
  dexRouterAddress?: string | null;
  token0Address?: string | null;
  token1Address?: string | null;
  txHash?: string | null;

  createdAtIso?: string | null;
  updatedAtIso?: string | null;
  updatedAtLabel: string;

  rawParams: Record<string, any>;
  tiers: StrategyTier[];
};

export type VaultUsingStrategy = {
  id: string;
  alias: string;
  name: string;
  address: string;

  chainKey: "base" | "bnb";
  chainName: string;

  dexName: string;
  status: "active" | "paused";

  href: string;
};

export type StrategyEditDraft = {
  status: StrategyStatus;
  isPublic: boolean;
  symbol: string;

  indicatorSource: string;
  emaFast: number;
  emaSlow: number;
  atrWindow: number;

  skewLowPct: number;
  skewHighPct: number;
  eps: number;
  cooloffBars: number;
  breakoutConfirmBars: number;
  gaugeEnabled: boolean;

  tiersJson: string;
};