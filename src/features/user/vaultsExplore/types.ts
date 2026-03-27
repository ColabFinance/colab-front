export type VaultPairType = "stable" | "volatile";
export type VaultStatus = "active" | "paused" | "deprecated";
export type VaultRangeStatus = "inside" | "below" | "above";

export type VaultSort =
  | "tvl_desc"
  | "tvl_asc"
  | "apy_desc"
  | "apy_asc";

export type VaultsExploreView = "list" | "grid";
export type VaultOwnershipFilter = "all" | "my";
export type VaultGaugeFilter = "all" | "has_gauge" | "no_gauge";

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
  feeTierLabel: string | null;

  pairType: VaultPairType;

  chainId: string;
  chainName: string;

  dexId: string;
  dexName: string;

  tvlUsd: number | null;
  tvlChange24hPct: number | null;

  apyPct: number | null;
  aprPct: number | null;

  status: VaultStatus;
  rangeStatus: VaultRangeStatus | null;

  hasGauge: boolean;
  isMine: boolean;
  myPositionUsd?: number | null;

  favorited: boolean;
};