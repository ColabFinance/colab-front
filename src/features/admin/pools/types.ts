export type PoolStatus = "active" | "paused";
export type PoolType = "VOLATILE" | "STABLE" | "WEIGHTED";

export type DexPoolRow = {
  id: string;
  chainName: string;
  dexKey: string;
  poolAddressShort: string;
  poolAddressFull: string;

  token0Symbol: string;
  token0AddressShort: string;

  token1Symbol: string;
  token1AddressShort: string;

  feeTierLabel: string; // e.g. "0.05%"
  feeTierBps: number;   // e.g. 500
  tickSpacing: string;  // e.g. "10" or "-"
  type: PoolType;

  status: PoolStatus;
  updatedAt: Date;
};

export type PoolsFilters = {
  chain: string;        // e.g. "Ethereum"
  dexKey: string;       // e.g. "uniswap_v3"
  tokenSymbol: string;  // e.g. "USDC"
  feeTier: string;      // e.g. "500"
  status: "all" | PoolStatus;
};

export type PoolDraft = {
  dexKey: string;
  poolAddress: string;

  token0Address: string;
  token1Address: string;

  feeTier: string;
  tickSpacing: string;

  isStablePair: boolean;
  isActive: boolean;
};