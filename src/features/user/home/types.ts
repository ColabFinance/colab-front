export type HomeChainScope = "current" | "all";

export type HomeKpi = {
  id: string;
  label: string;
  value: string;
  deltaLabel?: string;
  tone?: "blue" | "cyan" | "purple" | "green" | "amber";
};

export type HomeSnapshotMetric = {
  id: string;
  label: string;
  value: string;
  hint?: string;
  tone?: "white" | "green" | "cyan" | "blue";
};

export type HomeSnapshot = {
  items: HomeSnapshotMetric[];
};

export type VaultStatus = "active" | "paused" | "deprecated";

export type TopVaultRow = {
  id: string;
  name: string;
  address: string;
  href: string;

  subtitle: string;
  dexLabel: string;
  pairSymbols: string[];

  tvl: string;
  tvlDelta?: string;

  apy: string;
  apr: string;

  status: VaultStatus;
};

export type TopStrategyStatus = "active" | "inactive";

export type TopStrategyRow = {
  id: string;
  name: string;
  symbol: string;
  indicatorSetLabel: string;
  chainLabel: string;
  status: TopStrategyStatus;
  linkedVaultLabel?: string;
  updatedAtLabel: string;
  href: string;
};