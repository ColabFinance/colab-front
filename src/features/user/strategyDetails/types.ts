export type StrategyRisk = "low" | "medium" | "high";

export type StrategyDetails = {
  id: string;
  name: string;
  symbol: string;

  chainId: number;
  chainName: string;

  dexKey: string;
  dexName: string;

  pairLabel: string;
  feeTierLabel: string;

  risk: StrategyRisk;

  overview: {
    paragraphs: string[];
  };

  optimizes: Array<{
    title: string;
    description: string;
  }>;

  risks: Array<{
    title: string;
    description: string;
  }>;

  params: {
    tiers: {
      total: number;
      labels: string[];
    };
    thresholds: Array<{
      label: string;
      value: string;
      tone?: "cyan" | "amber";
    }>;
    limits: Array<{
      label: string;
      value: string;
    }>;
  };
};

export type VaultUsingStrategy = {
  id: string;
  name: string;
  address: string;

  pairLabel: string;
  feeTierLabel: string;

  tvlUsd: number;
  aprPct: number;
  apyPct: number;

  status: "active" | "paused";
};