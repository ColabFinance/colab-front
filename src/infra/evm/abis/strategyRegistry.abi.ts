export const StrategyRegistryAbi = [
  "function nextStrategyId() view returns (uint256)",
  "function getStrategy(uint256) view returns (tuple(address adapter,address dexRouter,address token0,address token1,string name,string description,bool active))",
];
