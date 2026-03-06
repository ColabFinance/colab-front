import { StrategyDetails, VaultUsingStrategy } from "./types";

export const MOCK_STRATEGIES: StrategyDetails[] = [
  {
    id: "strat_dn_lp_v3",
    name: "Delta Neutral LP",
    symbol: "DN-LP-V3",
    chainId: 1,
    chainName: "Ethereum",
    dexKey: "uniswap_v3",
    dexName: "Uniswap V3",
    pairLabel: "WETH/USDC",
    feeTierLabel: "0.05%",
    risk: "low",
    overview: {
      paragraphs: [
        "The Delta Neutral LP strategy is designed to provide market-neutral yield farming on Uniswap V3. It achieves this by providing liquidity in a defined range while hedging inventory risk using a lending protocol.",
        "The goal is to capture DEX fees while reducing exposure to directional moves. The strategy can rebalance the hedge ratio and the LP range to maintain neutrality within thresholds.",
      ],
    },
    optimizes: [
      { title: "Fee Maximization", description: "Concentrates liquidity around active price." },
      { title: "Range Management", description: "Auto-shifts range when price drifts." },
      { title: "Reward Compounding", description: "Harvests and reinvests rewards automatically." },
    ],
    risks: [
      { title: "Impermanent Loss", description: "Extreme volatility may exceed hedge capacity." },
      { title: "Gas Impact", description: "Frequent rebalancing can erode profits in high gas." },
      { title: "Liquidation Risk", description: "Hedge position on lending protocol needs monitoring." },
    ],
    params: {
      tiers: { total: 3, labels: ["Narrow", "Wide", "Hedge"] },
      thresholds: [
        { label: "Price Deviation", value: "±2.5%", tone: "cyan" },
        { label: "Hedge Delta", value: "0.05", tone: "cyan" },
        { label: "LTV Max", value: "75%", tone: "amber" },
      ],
      limits: [{ label: "Rebalance Cooldown", value: "4 Hours" }],
    },
  },
  {
    id: "strat_grid_long",
    name: "Grid Long (Trend)",
    symbol: "GRID-LONG",
    chainId: 1,
    chainName: "Ethereum",
    dexKey: "pancake_v3",
    dexName: "Pancake V3",
    pairLabel: "WETH/USDC",
    feeTierLabel: "0.05%",
    risk: "medium",
    overview: {
      paragraphs: [
        "Grid Long (Trend) is a directional strategy that allocates ranges and repositions based on trend regime.",
        "It focuses on capturing favorable moves and controlling downside via tiered ranges and cooldown rules.",
      ],
    },
    optimizes: [
      { title: "Trend Capture", description: "Increases exposure when trend is favorable." },
      { title: "Risk Budget", description: "Caps re-open frequency via cooldowns." },
      { title: "Simplicity", description: "Clear rules for open/close based on regime." },
    ],
    risks: [
      { title: "Whipsaw", description: "Choppy regimes can cause repeated entries/exits." },
      { title: "Slippage", description: "Fast moves may reduce expected fills." },
      { title: "Latency", description: "Execution delays can degrade performance." },
    ],
    params: {
      tiers: { total: 2, labels: ["Base", "Wide"] },
      thresholds: [
        { label: "Trend Confirm", value: "3 Bars", tone: "cyan" },
        { label: "Stop Distance", value: "1.8%", tone: "amber" },
        { label: "Re-open Gate", value: "6 Bars", tone: "cyan" },
      ],
      limits: [{ label: "Rebalance Cooldown", value: "6 Hours" }],
    },
  },
];

export const MOCK_VAULTS_BY_STRATEGY: Record<string, VaultUsingStrategy[]> = {
  strat_dn_lp_v3: [
    {
      id: "vault_alpha_core_eth",
      name: "Alpha Core ETH",
      address: "0x4a000000000000000000000000000000000092b1",
      pairLabel: "WETH/USDC",
      feeTierLabel: "0.05%",
      tvlUsd: 1245890,
      aprPct: 12.4,
      apyPct: 14.8,
      status: "active",
    },
    {
      id: "vault_btc_yield_max",
      name: "BTC Yield Max",
      address: "0x8f000000000000000000000000000000000033a2",
      pairLabel: "WBTC/USDC",
      feeTierLabel: "0.3%",
      tvlUsd: 842100,
      aprPct: 8.2,
      apyPct: 9.5,
      status: "active",
    },
    {
      id: "vault_stable_reserve",
      name: "Stable Reserve",
      address: "0x2c000000000000000000000000000000000011e9",
      pairLabel: "ETH/USDT",
      feeTierLabel: "0.05%",
      tvlUsd: 45200,
      aprPct: 11.1,
      apyPct: 12.8,
      status: "paused",
    },
  ],
  strat_grid_long: [
    {
      id: "vault_trend_core",
      name: "Trend Core",
      address: "0x990000000000000000000000000000000000aa11",
      pairLabel: "WETH/USDC",
      feeTierLabel: "0.05%",
      tvlUsd: 310500,
      aprPct: 6.8,
      apyPct: 7.1,
      status: "active",
    },
  ],
};