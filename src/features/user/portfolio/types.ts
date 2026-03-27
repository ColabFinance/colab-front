export type PortfolioTab = "active" | "history";

export type RiskLevel = "low" | "medium" | "high";

export type PositionStatus = "active" | "paused" | "closed";

export type PortfolioKpis = {
  totalDepositedUsd: number;
  currentValueUsd: number;
  netProfitUsd: number;
  netProfitPct: number;

  unclaimedRewardsUsd: number;

  avgApyPct: number;
  avgAprPct: number;

  activePositions: number;
  totalPositions: number;
};

export type PortfolioPosition = {
  id: string;

  vaultName: string;
  pairLabel: string;

  risk: RiskLevel;

  depositedUsd: number;
  depositedSubLabel?: string;

  currentValueUsd: number;

  profitUsd: number;
  profitPct: number;

  apyPct: number;
  aprPct: number;

  status: PositionStatus;

  iconVariant: "blueCyan" | "orangeRed" | "purpleIndigo" | "slate";
};

export type AllocationSlice = {
  id: string;
  label: string;
  pct: number; // 0..100
  color: string; // hex for donut chart
};