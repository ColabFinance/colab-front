import type { DexOption, PoolOption, MyStrategyRow } from "./types";

export const DEX_OPTIONS: DexOption[] = [
  { id: "uniswap_v3", name: "Uniswap V3" },
  { id: "curve", name: "Curve" },
  { id: "quickswap", name: "QuickSwap" },
];

export const POOL_OPTIONS: PoolOption[] = [
  {
    id: "pool_eth_usdc_005",
    dexId: "uniswap_v3",
    dexName: "Uniswap V3",
    token0Symbol: "ETH",
    token1Symbol: "USDC",
    pairLabel: "ETH/USDC",
    feeLabel: "0.05%",
    adapterAddress: "0x7a2e...9b3c",
    routerAddress: "0x3f1...8e2d",
    gaugeAvailable: true,
  },
  {
    id: "pool_wbtc_usdc_03",
    dexId: "quickswap",
    dexName: "QuickSwap",
    token0Symbol: "WBTC",
    token1Symbol: "USDC",
    pairLabel: "WBTC/USDC",
    feeLabel: "0.3%",
    adapterAddress: "0x12aa...43d1",
    routerAddress: "0x9c01...11f2",
    gaugeAvailable: false,
  },
];

export const MOCK_MY_STRATEGIES: MyStrategyRow[] = [
  {
    id: 24,
    name: "Momentum Alpha",
    symbol: "MOM-ALPHA",
    dexName: "Uniswap V3",
    poolPairLabel: "ETH/USDC",
    feeLabel: "0.05%",
    token0Symbol: "ETH",
    token1Symbol: "USDC",
    status: "ACTIVE",
    updatedAtLabel: "2 hours ago",
    indicatorSetId: "0x7a2e...9b3c",
    chainName: "Ethereum",
  },
  {
    id: 23,
    name: "BTC Rebal Core",
    symbol: "BTC-REBAL",
    dexName: "QuickSwap",
    poolPairLabel: "WBTC/USDC",
    feeLabel: "0.3%",
    token0Symbol: "WBTC",
    token1Symbol: "USDC",
    status: "INACTIVE",
    updatedAtLabel: "2 days ago",
    indicatorSetId: "0x12aa...43d1",
    chainName: "Ethereum",
  },
];