export type PoolStatus = "active" | "paused";
export type PoolType = "VOLATILE" | "STABLE" | "WEIGHTED" | "CONCENTRATED";

export type ChainOption = {
  key: string;
  name: string;
  chainId: number;
};

export type DexOption = {
  key: string;
  label: string;
};

export type DexPoolRow = {
  id: string;

  chainKey: string;
  chainName: string;

  dexKey: string;

  poolAddressShort: string;
  poolAddressFull: string;

  token0Symbol: string;
  token0AddressFull: string;
  token0AddressShort: string;

  token1Symbol: string;
  token1AddressFull: string;
  token1AddressShort: string;

  feeTierLabel: string;
  feeTierBps: number;
  tickSpacing: string;
  type: PoolType;

  status: PoolStatus;
  updatedAt: Date;

  nfpm: string;
  gauge: string;
  pair: string;
  symbol: string;
  adapter: string;
  rewardToken: string;
  rewardSwapPool: string;
};

export type PoolsFilters = {
  chain: string;
  dexKey: string;
  tokenSymbol: string;
  feeTier: string;
  status: "all" | PoolStatus;
};

export type PoolDraft = {
  chain: string;
  dexKey: string;

  poolAddress: string;
  nfpm: string;
  gauge: string;

  token0Address: string;
  token1Address: string;

  pair: string;
  symbol: string;

  feeTier: string;
  tickSpacing: string;
  poolType: PoolType;

  adapterAddress: string;
  rewardToken: string;
  rewardSwapPool: string;

  isActive: boolean;
};