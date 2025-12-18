export const ClientVaultAbi = [
  // immutables (as view funcs)
  "function owner() view returns (address)",
  "function executor() view returns (address)",
  "function adapter() view returns (address)",
  "function dexRouter() view returns (address)",
  "function feeCollector() view returns (address)",
  "function strategyId() view returns (uint256)",

  // automation config
  "function automationEnabled() view returns (bool)",
  "function cooldownSec() view returns (uint32)",
  "function maxSlippageBps() view returns (uint16)",
  "function allowSwap() view returns (bool)",
  "function getAutomationConfig() view returns (bool enabled,uint32 cooldown,uint16 slippageBps,bool swapAllowed)",

  // state
  "function positionTokenId() view returns (uint256)",
  "function lastRebalanceTs() view returns (uint256)",
  "function positionTokenIdView() view returns (uint256)",

  // tokens
  "function tokens() view returns (address token0,address token1)",
] as const;
