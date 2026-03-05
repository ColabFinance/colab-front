import type { HomeKpi, HomeSnapshot, TopVaultRow } from "./types";

export const MOCK_KPIS: HomeKpi[] = [
  { id: "tvl", label: "Total TVL", value: "$142.5M", deltaLabel: "+2.4%", tone: "blue" },
  { id: "vaults", label: "Vaults", value: "48", tone: "cyan" },
  { id: "strategies", label: "Strategies", value: "12", tone: "purple" },
  { id: "fees", label: "Fees (24h)", value: "$12.4k", tone: "green" },
  { id: "apy", label: "Avg APY", value: "8.45%", tone: "amber" },
  { id: "health", label: "Health", value: "OK", tone: "green" },
];

export const MOCK_SNAPSHOT: HomeSnapshot = {
  totalDepositedUsd: "$24,500.00",
  totalDepositedLabel: "~ 12.45 ETH",
  currentValueUsd: "$25,120.45",
  currentValueHint: "All time high",
  totalProfitUsd: "+$620.45",
  totalProfitHint: "Net of gas fees",
  avgApr: { value: "4.2%", progressPct: 45 },
  avgApy: { value: "5.8%", progressPct: 60 },
};

export const MOCK_TOP_VAULTS: TopVaultRow[] = [
  {
    id: "eth-usdc-alpha",
    name: "ETH-USDC Alpha",
    subtitle: "Delta Neutral Strategy",
    dexLabel: "Uniswap V3",
    pairSymbols: ["ETH", "USDC"],
    tvl: "$4.2M",
    tvlDelta: "+12% (7d)",
    apy: "12.5% APY",
    apr: "8.2% APR",
    status: "active",
  },
  {
    id: "wbtc-eth-core",
    name: "WBTC-ETH Core",
    subtitle: "Rebalancing Strategy",
    dexLabel: "Curve",
    pairSymbols: ["WBTC", "ETH"],
    tvl: "$12.8M",
    tvlDelta: "Stable",
    apy: "5.4% APY",
    apr: "4.1% APR",
    status: "active",
  },
  {
    id: "usdc-yield-max",
    name: "USDC Yield Max",
    subtitle: "Lending Aggregator",
    dexLabel: "Aave V3",
    pairSymbols: ["USDC"],
    tvl: "$8.1M",
    tvlDelta: "+5% (24h)",
    apy: "4.8% APY",
    apr: "4.5% APR",
    status: "capped",
  },
  {
    id: "eth-leverage",
    name: "ETH Leverage",
    subtitle: "Looping Strategy",
    dexLabel: "Compound",
    pairSymbols: ["ETH"],
    tvl: "$1.5M",
    tvlDelta: "Stable",
    apy: "18.2% APY",
    apr: "15.0% APR",
    status: "active",
  },
];