export const StrategyRegistryAbi = [
  "function getStrategyIdsByOwner(address owner) view returns (uint256[] ids)",
  "function getStrategy(address owner, uint256 strategyId) view returns (tuple(address adapter,address dexRouter,address token0,address token1,string name,string description,bool active))",
  "function getMyStrategy(uint256 strategyId) view returns (tuple(address adapter,address dexRouter,address token0,address token1,string name,string description,bool active))",
  "function nextStrategyIdByOwner(address owner) view returns (uint256)",
];