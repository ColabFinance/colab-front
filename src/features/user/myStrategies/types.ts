export type StrategyStatus = "ACTIVE" | "INACTIVE";

export type DexOption = {
  id: string;
  name: string;
};

export type PoolOption = {
  id: string;
  dexId: string;
  dexName: string;

  token0Symbol: string;
  token1Symbol: string;
  pairLabel: string;
  feeLabel: string;

  adapterAddress: string;
  routerAddress: string;

  gaugeAvailable?: boolean;
};

export type MyStrategyRow = {
  id: number;

  name: string;
  symbol: string;

  dexName: string;
  poolPairLabel: string;
  feeLabel: string;

  token0Symbol: string;
  token1Symbol: string;

  status: StrategyStatus;
  updatedAtLabel: string;

  indicatorSetId: string;
  chainName: string;
};

export type CreateStrategyDraft = {
  dexId: string;
  poolId: string;

  name: string;
  description: string;
  symbol: string;

  indicatorSource: string;
  emaFast: number;
  emaSlow: number;
  atrWindow: number;
};

export type EditParamsDraft = {
  status: StrategyStatus;
  indicatorSetId: string;
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
  inrangeResizeMode: "skew_swap" | "preserve";

  gaugeEnabled: boolean;

  tiersJson: string;
};