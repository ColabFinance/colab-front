export type StrategyStatus = "ACTIVE" | "INACTIVE";
export type MyStrategyChain = "base" | "bnb";
export type VaultLinkFilter = "all" | "linked" | "not_linked";

export type DexOption = {
  id: string;
  name: string;
};

export type PoolOption = {
  id: string;
  poolAddress: string;

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
  updatedAtLabel: string;

  indicatorSetId: string;
  indicatorStreamKey: string;
  indicatorSource: string;
  emaFast: number;
  emaSlow: number;
  atrWindow: number;
  marketSymbol: string;

  vaultAlias?: string | null;
  vaultLabel?: string | null;
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