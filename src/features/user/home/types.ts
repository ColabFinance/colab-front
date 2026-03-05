export type HomeChainScope = "current" | "all";

export type HomeKpi = {
  id: string;
  label: string;
  value: string;
  deltaLabel?: string;
  tone?: "blue" | "cyan" | "purple" | "green" | "amber";
};

export type HomeSnapshot = {
  totalDepositedUsd: string;
  totalDepositedLabel: string;
  currentValueUsd: string;
  currentValueHint: string;
  totalProfitUsd: string;
  totalProfitHint: string;
  avgApr: { value: string; progressPct: number };
  avgApy: { value: string; progressPct: number };
};

export type VaultStatus = "active" | "capped" | "disabled";

export type TopVaultRow = {
  id: string;
  name: string;
  subtitle: string;

  dexLabel: string;
  pairSymbols: string[];

  tvl: string;
  tvlDelta?: string;

  apy: string;
  apr: string;

  status: VaultStatus;
};