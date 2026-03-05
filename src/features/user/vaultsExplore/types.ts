export type VaultPairType = "stable" | "volatile";
export type VaultStatus = "active" | "paused" | "deprecated";

export type VaultSort =
  | "tvl_desc"
  | "tvl_asc"
  | "apy_desc"
  | "apy_asc";

export type VaultsExploreView = "list" | "grid";

export type ChainOption = {
  id: string;
  name: string;
};

export type DexOption = {
  id: string;
  name: string;
};

export type VaultExploreItem = {
  id: string;

  name: string;
  address: string;

  token0Symbol: string;
  token1Symbol: string;
  feeTierLabel: string;

  pairType: VaultPairType;

  chainId: string;
  chainName: string;

  dexId: string;
  dexName: string;

  tvlUsd: number;
  tvlChange24hPct: number;

  apyPct: number;
  aprPct: number;

  status: VaultStatus;
  favorited: boolean;
};