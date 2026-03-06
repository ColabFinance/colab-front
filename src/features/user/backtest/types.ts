export type BacktestTab = "setup" | "results" | "history";

export type CandleTimeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

export type BacktestStrategyOption = {
  id: string;
  name: string;

  chainName: string;
  dexName: string;

  token0: string;
  token1: string;
  feeTierLabel: string;

  gaugeActive: boolean;
};

export type BacktestConfig = {
  startDate: string; // yyyy-mm-dd
  endDate: string; // yyyy-mm-dd
  timeframe: CandleTimeframe;
  initialCapitalUsd: number;
  includeFees: boolean;
  includeSlippage: boolean;
};

export type BacktestRunStatus = "completed" | "failed" | "running";

export type BacktestRun = {
  id: string;
  strategyId: string;

  dateRangeLabel: string;
  timeframeLabel: string;

  status: BacktestRunStatus;
  createdAtLabel: string;
};

export type BacktestSummary = {
  episodes: number;
  bars: number;
  finalEquityUsd: number;
  feesCollectedUsd: number;
  maxDrawdownPct: number; // negative number (e.g. -12.4)
};

export type BacktestCoreMetrics = Record<string, number | string>;

export type BreakdownLeafDetails = Record<string, number | string>;

export type BreakdownNode =
  | {
      id: string;
      kind: "group";
      label: string;
      children: BreakdownNode[];
    }
  | {
      id: string;
      kind: "leaf";
      label: string;
      deltaPct?: number; // positive/negative
      valueLabel?: string; // e.g. "No Data"
      details?: BreakdownLeafDetails;
    };

export type BacktestResults = {
  strategyId: string;
  summary: BacktestSummary;
  coreMetrics: BacktestCoreMetrics;
  breakdown: BreakdownNode; // root group
};