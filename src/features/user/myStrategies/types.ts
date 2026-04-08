export type StrategyStatus = "ACTIVE" | "INACTIVE";
export type MyStrategyChain = "base" | "bnb";
export type VaultLinkFilter = "all" | "linked" | "not_linked";
export type StrategyVisibilityFilter = "all" | "public" | "private";
export type OpenSide = "down" | "up";

export type AtrWidthRuleDraft = {
  max_atr_pct: number;
  width_pct: number;
  name: string;
};

export type DexOption = {
  id: string;
  name: string;
};

export type PoolOption = {
  id: string;
  poolAddress: string;
  streamKey?: string;

  chainKey: "base" | "bnb";

  dexId: string;
  dexName: string;

  token0Symbol: string;
  token1Symbol: string;
  pairLabel: string;
  feeLabel: string;

  token0Address: string;
  token1Address: string;

  adapterAddress: string;
  routerAddress: string;

  gaugeAvailable?: boolean;
};

export type StrategyConfigFields = {
  status: StrategyStatus;
  isPublic: boolean;
  symbol: string;

  fixedRangeWidthPct: number;

  breakoutDownBelowShare: number;
  breakoutDownAboveShare: number;
  breakoutUpBelowShare: number;
  breakoutUpAboveShare: number;
  breakoutConfirmBars: number;
  breakoutUseHighLow: boolean;

  initialSide: OpenSide;

  atrEnabled: boolean;
  atrPeriod: number;

  atrRebalanceEnabled: boolean;
  atrRebalanceMinWidthDeltaPct: number;

  atrHysteresisEnabled: boolean;
  atrHysteresisGapPct: number;

  atrRebalanceCooldownBars: number;
  atrRebalanceMinAgeBars: number;

  swapFeePercent: number;

  entryFiltersEnabled: boolean;
  allowCashWhenFilterFails: boolean;
  entryCooldownBars: number;

  entryAtrQuantileWindow: number;
  entryAtrQuantile: number;

  entryTrendMaWindow: number;
  entryMaxMaDistancePct: number;
  entryMaxMaSlopePct: number;

  entryChannelWindow: number;
  entryChannelPosMin: number;
  entryChannelPosMax: number;

  eps: number;
  gaugeEnabled: boolean;

  atrWidthRulesJson: string;
};

export type MyStrategyRow = {
  id: number;

  chainKey: MyStrategyChain;
  chainName: string;
  owner: string;

  name: string;
  symbol: string;

  dexKey?: string | null;
  dexName: string;
  poolPairLabel: string;
  feeLabel: string;

  token0Symbol: string;
  token1Symbol: string;
  token0Address?: string | null;
  token1Address?: string | null;

  adapterAddress?: string | null;
  dexRouterAddress?: string | null;

  status: StrategyStatus;
  isPublic: boolean;
  updatedAtLabel: string;

  indicatorSetId: string;
  streamKey: string;

  strategyVersion: string;
  fixedRangeWidthPct: number;
  initialSide: OpenSide;

  breakoutConfirmBars: number;
  breakoutUseHighLow: boolean;

  atrEnabled: boolean;
  atrPeriod: number;
  atrRebalanceEnabled: boolean;

  entryFiltersEnabled: boolean;
  allowCashWhenFilterFails: boolean;

  gaugeEnabled: boolean;
  atrWidthRuleCount: number;

  vaultAlias?: string | null;
  vaultLabel?: string | null;
};

export type CreateStrategyDraft = {
  dexId: string;
  poolId: string;

  name: string;
  description: string;
} & StrategyConfigFields;

export type EditParamsDraft = {
  indicatorSetId: string;
  streamKey: string;
} & StrategyConfigFields;