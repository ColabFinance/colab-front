export const ClientVaultAbi = [
  // ---------------------------------------------------------------------------
  // views (immutables / state)
  // ---------------------------------------------------------------------------
  {
    type: "function",
    name: "owner",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "executor",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "adapter",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "dexRouter",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "feeCollector",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "strategyId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },

  // automation config (rebalance)
  {
    type: "function",
    name: "automationEnabled",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "cooldownSec",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint32" }],
  },
  {
    type: "function",
    name: "maxSlippageBps",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint16" }],
  },
  {
    type: "function",
    name: "allowSwap",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "getAutomationConfig",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "enabled", type: "bool" },
      { name: "cooldown", type: "uint32" },
      { name: "slippageBps", type: "uint16" },
      { name: "swapAllowed", type: "bool" },
    ],
  },

  // daily harvest config (harvest_job)
  {
    type: "function",
    name: "dailyHarvestEnabled",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "dailyHarvestCooldownSec",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint32" }],
  },
  {
    type: "function",
    name: "lastDailyHarvestTs",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },

  // compound config (compound_job)
  {
    type: "function",
    name: "compoundEnabled",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "compoundCooldownSec",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint32" }],
  },
  {
    type: "function",
    name: "lastCompoundTs",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },

  // reward swap config (public struct getter)
  // rewardSwap() returns: (bool enabled, address tokenIn, address tokenOut, uint24 fee, uint160 sqrtPriceLimitX96)
  {
    type: "function",
    name: "rewardSwap",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "enabled", type: "bool" },
      { name: "tokenIn", type: "address" },
      { name: "tokenOut", type: "address" },
      { name: "fee", type: "uint24" },
      { name: "sqrtPriceLimitX96", type: "uint160" },
    ],
  },

  // position state
  {
    type: "function",
    name: "positionTokenId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "lastRebalanceTs",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "tokens",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "token0", type: "address" },
      { name: "token1", type: "address" },
    ],
  },
  {
    type: "function",
    name: "positionTokenIdView",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },

  // ---------------------------------------------------------------------------
  // owner txs
  // ---------------------------------------------------------------------------
  {
    type: "function",
    name: "setAutomationEnabled",
    stateMutability: "nonpayable",
    inputs: [{ name: "enabled", type: "bool" }],
    outputs: [],
  },
  {
    type: "function",
    name: "setAutomationConfig",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_cooldownSec", type: "uint32" },
      { name: "_maxSlippageBps", type: "uint16" },
      { name: "_allowSwap", type: "bool" },
    ],
    outputs: [],
  },

  {
    type: "function",
    name: "swapExactInPancake",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenIn", type: "address" },
      { name: "tokenOut", type: "address" },
      { name: "fee", type: "uint24" },
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMinimum", type: "uint256" },
      { name: "sqrtPriceLimitX96", type: "uint160" },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
  },

  // daily harvest / compound / reward swap setters
  {
    type: "function",
    name: "setDailyHarvestConfig",
    stateMutability: "nonpayable",
    inputs: [
      { name: "enabled", type: "bool" },
      { name: "harvestCooldownSec", type: "uint32" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setCompoundConfig",
    stateMutability: "nonpayable",
    inputs: [
      { name: "enabled", type: "bool" },
      { name: "_cooldownSec", type: "uint32" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setRewardSwapConfig",
    stateMutability: "nonpayable",
    inputs: [
      { name: "enabled", type: "bool" },
      { name: "tokenIn", type: "address" },
      { name: "tokenOut", type: "address" },
      { name: "fee", type: "uint24" },
      { name: "sqrtPriceLimitX96", type: "uint160" },
    ],
    outputs: [],
  },

  // existing owner actions
  {
    type: "function",
    name: "collectToVault",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [
      { name: "amount0", type: "uint256" },
      { name: "amount1", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "openInitialPosition",
    stateMutability: "nonpayable",
    inputs: [
      { name: "lowerTick", type: "int24" },
      { name: "upperTick", type: "int24" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "rebalanceWithCaps",
    stateMutability: "nonpayable",
    inputs: [
      { name: "lower", type: "int24" },
      { name: "upper", type: "int24" },
      { name: "cap0", type: "uint256" },
      { name: "cap1", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "exitPositionToVault",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "exitPositionAndWithdrawAll",
    stateMutability: "nonpayable",
    inputs: [{ name: "to", type: "address" }],
    outputs: [],
  },
  {
    type: "function",
    name: "stake",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "unstake",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "claimRewards",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },

  // ---------------------------------------------------------------------------
  // events
  // ---------------------------------------------------------------------------
  {
    type: "event",
    name: "VaultInitialized",
    anonymous: false,
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "executor", type: "address", indexed: true },
      { name: "adapter", type: "address", indexed: true },
      { name: "dexRouter", type: "address", indexed: false },
      { name: "feeCollector", type: "address", indexed: false },
      { name: "strategyId", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "AutomationToggled",
    anonymous: false,
    inputs: [{ name: "enabled", type: "bool", indexed: false }],
  },
  {
    type: "event",
    name: "AutomationConfigUpdated",
    anonymous: false,
    inputs: [
      { name: "cooldownSec", type: "uint32", indexed: false },
      { name: "maxSlippageBps", type: "uint16", indexed: false },
      { name: "allowSwap", type: "bool", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Collected",
    anonymous: false,
    inputs: [
      { name: "amount0", type: "uint256", indexed: false },
      { name: "amount1", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Swapped",
    anonymous: false,
    inputs: [
      { name: "router", type: "address", indexed: true },
      { name: "tokenIn", type: "address", indexed: true },
      { name: "tokenOut", type: "address", indexed: true },
      { name: "amountIn", type: "uint256", indexed: false },
      { name: "amountOut", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "DailyHarvestConfigUpdated",
    anonymous: false,
    inputs: [
      { name: "oldEnabled", type: "bool", indexed: false },
      { name: "newEnabled", type: "bool", indexed: false },
      { name: "oldCooldownSec", type: "uint32", indexed: false },
      { name: "newCooldownSec", type: "uint32", indexed: false },
    ],
  },
  {
    type: "event",
    name: "CompoundConfigUpdated",
    anonymous: false,
    inputs: [
      { name: "oldEnabled", type: "bool", indexed: false },
      { name: "newEnabled", type: "bool", indexed: false },
      { name: "oldCooldownSec", type: "uint32", indexed: false },
      { name: "newCooldownSec", type: "uint32", indexed: false },
    ],
  },
  {
    type: "event",
    name: "RewardSwapConfigUpdated",
    anonymous: false,
    inputs: [
      { name: "enabled", type: "bool", indexed: false },
      { name: "tokenIn", type: "address", indexed: false },
      { name: "tokenOut", type: "address", indexed: false },
      { name: "fee", type: "uint24", indexed: false },
      { name: "sqrtPriceLimitX96", type: "uint160", indexed: false },
    ],
  },
  {
    type: "event",
    name: "DailyHarvestExecuted",
    anonymous: false,
    inputs: [{ name: "atTs", type: "uint256", indexed: true }],
  },
  {
    type: "event",
    name: "CompoundExecuted",
    anonymous: false,
    inputs: [{ name: "atTs", type: "uint256", indexed: true }],
  },
] as const;
