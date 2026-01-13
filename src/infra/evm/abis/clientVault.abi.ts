export const ClientVaultAbi = [
  // immutables/views
  { type: "function", name: "owner", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "executor", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "adapter", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "dexRouter", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "feeCollector", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "strategyId", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },

  { type: "function", name: "automationEnabled", stateMutability: "view", inputs: [], outputs: [{ type: "bool" }] },
  { type: "function", name: "cooldownSec", stateMutability: "view", inputs: [], outputs: [{ type: "uint32" }] },
  { type: "function", name: "maxSlippageBps", stateMutability: "view", inputs: [], outputs: [{ type: "uint16" }] },
  { type: "function", name: "allowSwap", stateMutability: "view", inputs: [], outputs: [{ type: "bool" }] },

  { type: "function", name: "positionTokenId", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "lastRebalanceTs", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },

  { type: "function", name: "tokens", stateMutability: "view", inputs: [], outputs: [{ type: "address" }, { type: "address" }] },
  {
    type: "function",
    name: "getAutomationConfig",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { type: "bool", name: "enabled" },
      { type: "uint32", name: "cooldown" },
      { type: "uint16", name: "slippageBps" },
      { type: "bool", name: "swapAllowed" },
    ],
  },

  // owner txs
  { type: "function", name: "setAutomationEnabled", stateMutability: "nonpayable", inputs: [{ type: "bool", name: "enabled" }], outputs: [] },
  {
    type: "function",
    name: "setAutomationConfig",
    stateMutability: "nonpayable",
    inputs: [
      { type: "uint32", name: "_cooldownSec" },
      { type: "uint16", name: "_maxSlippageBps" },
      { type: "bool", name: "_allowSwap" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "collectToVault",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [{ type: "uint256", name: "amount0" }, { type: "uint256", name: "amount1" }],
  },
  {
    type: "function",
    name: "openInitialPosition",
    stateMutability: "nonpayable",
    inputs: [
      { type: "int24", name: "lowerTick" },
      { type: "int24", name: "upperTick" },
    ],
    outputs: [],
  },
  { type: "function", name: "exitPositionToVault", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "exitPositionAndWithdrawAll", stateMutability: "nonpayable", inputs: [{ type: "address", name: "to" }], outputs: [] },
  { type: "function", name: "stake", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "unstake", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "claimRewards", stateMutability: "nonpayable", inputs: [], outputs: [] },

  // events (opcional pra parse depois)
  { type: "event", name: "AutomationToggled", inputs: [{ indexed: false, name: "enabled", type: "bool" }], anonymous: false },
  {
    type: "event",
    name: "AutomationConfigUpdated",
    inputs: [
      { indexed: false, name: "cooldownSec", type: "uint32" },
      { indexed: false, name: "maxSlippageBps", type: "uint16" },
      { indexed: false, name: "allowSwap", type: "bool" },
    ],
    anonymous: false,
  },
  { type: "event", name: "Collected", inputs: [{ indexed: false, name: "amount0", type: "uint256" }, { indexed: false, name: "amount1", type: "uint256" }], anonymous: false },
] as const;
