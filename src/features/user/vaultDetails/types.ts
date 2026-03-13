export type VaultTabKey = "overview" | "performance" | "events";
export type VaultDrawerKey = "deposit" | "withdraw" | "claim" | null;

export type VaultStatus = "ACTIVE" | "PAUSED" | "ERROR";
export type VaultTone = "slate" | "cyan" | "blue" | "green" | "amber" | "red";

export type TokenInfo = {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
};

export type ViewerInfo = {
  connected: boolean;
  walletAddress: string;
};

export type HeaderStatBadge = {
  label: string;
  tone?: VaultTone;
};

export type VaultHeaderData = {
  name: string;
  pairLabel: string;
  address: string;
  poolAddress: string;
  chainName: string;
  dexName: string;
  feeTierLabel: string;
  status: VaultStatus;
  updatedAtLabel: string;
  subtitle: string;
  badges: HeaderStatBadge[];
};

export type OverviewKpi = {
  label: string;
  value: string;
  meta?: string;
  tone?: VaultTone;
};

export type HoldingBucket = {
  token0Amount: number;
  token1Amount: number;
  totalUsd: number;
};

export type VaultRange = {
  currentPrice: number;
  lowerPrice: number;
  upperPrice: number;
  currentTick: number;
  lowerTick: number;
  upperTick: number;
  outOfRange: boolean;
  rangeSide: string;
  positionLocation: string;
  staked: boolean;
  hasGauge: boolean;
  bandStartPct: number;
  bandEndPct: number;
  lastRebalanceLabel: string;
};

export type FeesRewardsData = {
  uncollectedToken0: number;
  uncollectedToken1: number;
  uncollectedUsd: number;
  rewardSymbol: string;
  pendingRewardAmount: number;
  pendingRewardUsd: number;
  inVaultRewardAmount: number;
};

export type VaultConfiguration = {
  ownerAddress: string;
  executorAddress: string;
  adapterAddress: string;
  dexRouterAddress: string;
  feeCollectorAddress: string;
  poolAddress: string;
  nfpmAddress: string;
  gaugeAddress?: string;
  strategyId: number;
  version: string;
  isActive: boolean;
};

export type PerformanceSummaryCard = {
  label: string;
  value: string;
  meta?: string;
  tone?: VaultTone;
};

export type EpisodeExecutionStep = {
  id: string;
  tsLabel: string;
  phase: string;
  step: string;
  attempt: number;
  txHash?: string;
  gasLabel?: string;
  summary: string;
};

export type VaultEpisode = {
  id: string;
  status: "OPEN" | "CLOSED";
  openTimeLabel: string;
  closeTimeLabel?: string;
  openPrice: string;
  closePrice?: string;
  rangeLabel: string;
  poolType: string;
  modeOnOpen: string;
  majorityOnOpen: string;
  closeReason?: string;
  feesUsd: string;
  aprAnnualized: string;
  totalValueUsd: string;
  candleCount: number;
  outOfRangeCandles: number;
  executionSteps: EpisodeExecutionStep[];
};

export type VaultEventType =
  | "deposit"
  | "withdraw"
  | "claim"
  | "rebalance"
  | "collect";

export type VaultEventTransfer = {
  tokenSymbol: string;
  tokenAddress: string;
  from: string;
  to: string;
  amountRaw: string;
};

export type VaultEvent = {
  id: string;
  type: VaultEventType;
  txHash: string;
  blockNumber: number;
  owner: string;
  tokenSymbol?: string;
  amountHuman?: string;
  tsIso: string;
  timestampLabel: string;
  vaultAddress: string;
  transfers: VaultEventTransfer[];
};

export type DrawerAssetOption = {
  symbol: string;
  label: string;
  balanceLabel: string;
  maxAmount: string;
  usdLabel?: string;
};

export type ClaimSummary = {
  rewardSymbol: string;
  pendingAmountLabel: string;
  pendingUsdLabel: string;
  inVaultAmountLabel: string;
  destinationWallet: string;
};

export type VaultDetails = {
  viewer: ViewerInfo;
  ownerAddress: string;
  header: VaultHeaderData;
  token0: TokenInfo;
  token1: TokenInfo;
  overviewKpis: OverviewKpi[];
  range: VaultRange;
  holdings: {
    vaultIdle: HoldingBucket;
    inPosition: HoldingBucket;
    totals: HoldingBucket;
  };
  feesRewards: FeesRewardsData;
  configuration: VaultConfiguration;
  performanceSummary: PerformanceSummaryCard[];
  episodes: VaultEpisode[];
  events: VaultEvent[];
  depositAssets: DrawerAssetOption[];
  withdrawAssets: DrawerAssetOption[];
  claim: ClaimSummary;
};