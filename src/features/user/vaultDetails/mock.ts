import { VaultDetails } from "./types";

export const MOCK_VAULT_DETAILS: VaultDetails = {
  address: "0x88e6...2158",
  chainName: "Ethereum",
  dexName: "Uniswap V3",

  token0: { symbol: "USDC", name: "USD Coin" },
  token1: { symbol: "ETH", name: "Ethereum" },

  feeTierLabel: "0.05%",
  poolAddress: "0x8ad5...92c4",

  status: "ACTIVE",
  updatedAtLabel: "Updated 2m ago",

  kpis: {
    tvlUsd: 14205892,
    tvlChange24hPct: 2.4,

    apyPct: 18.42,
    aprPct: 16.8,

    profitToDateUsd: 1240505,
    profitToDatePct: 12.5,

    uncollectedFeesUsd: 4290.5,
    uncollectedFees24hUsd: 842.1,

    utilizationPct: 94.2,
  },

  composition: {
    totalUsd: 14205892,

    inPositionUsd: 13495597,
    inPositionPct: 95,
    inPositionToken0Amount: 6747798.5,
    inPositionToken1Amount: 3598.42,

    idleUsd: 710295,
    idlePct: 5,
    idleToken0Amount: 355147.5,
    idleToken1Amount: 189.39,
  },

  range: {
    lastRebalanceLabel: "4h ago",
    inRange: true,
    minPrice: 1650,
    currentPrice: 1875.42,
    maxPrice: 2100,

    // highlight band only for visuals
    bandStartPct: 30,
    bandEndPct: 80,
  },

  feeBuffer: [
    { symbol: "USDC", label: "USDC", amount: 4290.5, note: "Pending Collect", tone: "cyan" },
    { symbol: "ETH", label: "ETH", amount: 2.14, note: "Pending Collect", tone: "blue" },
    { symbol: "RWD", label: "Reward", amount: 142.5, note: "Auto-Compounding", tone: "purple" },
  ],

  health: {
    adapterStatus: "OPERATIONAL",
    poolConnection: "SYNCED",
    readLatencyMs: 42,
    allowlistCheck: "PASSED",
    feeBufferHealth: "OPTIMAL",
  },
};