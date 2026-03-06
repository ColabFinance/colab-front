import { BacktestConfig, BacktestResults, BacktestRun, BacktestStrategyOption } from "./types";

export const TIMEFRAME_OPTIONS = [
  { value: "1m", label: "1 Minute" },
  { value: "5m", label: "5 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" },
] as const;

export const STRATEGIES: BacktestStrategyOption[] = [
  {
    id: "strat_delta_neutral_eth_usdc",
    name: "Delta Neutral LP",
    chainName: "Ethereum",
    dexName: "Uniswap V3",
    token0: "WETH",
    token1: "USDC",
    feeTierLabel: "0.05%",
    gaugeActive: true,
  },
  {
    id: "strat_ma_crossover",
    name: "Moving Average Crossover",
    chainName: "Ethereum",
    dexName: "Uniswap V3",
    token0: "WETH",
    token1: "USDC",
    feeTierLabel: "0.30%",
    gaugeActive: false,
  },
  {
    id: "strat_rsi_mean_reversion",
    name: "RSI Mean Reversion",
    chainName: "Ethereum",
    dexName: "Uniswap V3",
    token0: "WETH",
    token1: "USDC",
    feeTierLabel: "0.05%",
    gaugeActive: true,
  },
  {
    id: "strat_boll_breakout",
    name: "Bollinger Band Breakout",
    chainName: "Ethereum",
    dexName: "Uniswap V3",
    token0: "WETH",
    token1: "USDC",
    feeTierLabel: "0.30%",
    gaugeActive: false,
  },
];

export const DEFAULT_CONFIG: BacktestConfig = {
  startDate: "2023-01-01",
  endDate: "2023-12-31",
  timeframe: "5m",
  initialCapitalUsd: 10_000,
  includeFees: true,
  includeSlippage: false,
};

export const INITIAL_HISTORY: BacktestRun[] = [
  {
    id: "run_8291",
    strategyId: "strat_delta_neutral_eth_usdc",
    dateRangeLabel: "Jan 1 - Dec 31, 2023",
    timeframeLabel: "5m",
    status: "completed",
    createdAtLabel: "2 mins ago",
  },
  {
    id: "run_8290",
    strategyId: "strat_rsi_mean_reversion",
    dateRangeLabel: "Jun 1 - Dec 31, 2023",
    timeframeLabel: "1h",
    status: "completed",
    createdAtLabel: "2 hours ago",
  },
  {
    id: "run_8289",
    strategyId: "strat_boll_breakout",
    dateRangeLabel: "Jan 1 - Jun 30, 2023",
    timeframeLabel: "15m",
    status: "failed",
    createdAtLabel: "Yesterday",
  },
];

export function mockResultsForStrategy(strategyId: string): BacktestResults {
  // same skeleton, lightly varied numbers
  const baseFees = strategyId.includes("delta") ? 845.2 : strategyId.includes("rsi") ? 610.55 : 120.4;
  const baseFinal = strategyId.includes("delta") ? 14250.8 : strategyId.includes("rsi") ? 13110.2 : 10880.4;
  const dd = strategyId.includes("boll") ? -18.9 : strategyId.includes("ma") ? -14.2 : -12.4;

  return {
    strategyId,
    summary: {
      episodes: 42,
      bars: 105_120,
      finalEquityUsd: baseFinal,
      feesCollectedUsd: baseFees,
      maxDrawdownPct: dd,
    },
    coreMetrics: {
      fee_total_collected: baseFees.toFixed(2),
      final_total_usd_no_fee: (baseFinal - baseFees).toFixed(2),
      final_equity_with_fees: baseFinal.toFixed(2),
      dd_max_overall_pct: `${dd.toFixed(2)}%`,
      dd_mean_overall_pct: "-4.20%",
      ddw_short_max_pct: "-5.10%",
      ddw_medium_max_pct: "-8.30%",
    },
    breakdown: {
      id: "by_pool_type",
      kind: "group",
      label: "by_pool_type",
      children: [
        {
          id: "high_vol.trend_up",
          kind: "leaf",
          label: "high_vol.trend_up",
          deltaPct: 12.4,
          details: {
            minutes_total: 18_320,
            in_range_pct: "58.2%",
            fee_in_range: `$${(baseFees * 0.62).toFixed(2)}`,
          },
        },
        {
          id: "high_vol.trend_down",
          kind: "leaf",
          label: "high_vol.trend_down",
          deltaPct: -4.2,
          details: {
            minutes_total: 14_200,
            in_range_pct: "42.5%",
            fee_in_range: `$${(baseFees * 0.14).toFixed(2)}`,
          },
        },
        {
          id: "tier7",
          kind: "leaf",
          label: "tier7",
          valueLabel: "No Data",
        },
      ],
    },
  };
}