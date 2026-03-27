export const StrategyRegistryAbi = [
  "function getStrategyIdsByOwner(address owner) view returns (uint256[] ids)",
  "function getStrategy(address owner, uint256 strategyId) view returns (tuple(address adapter,address dexRouter,address token0,address token1,string name,string description,bool active))",
  "function getMyStrategy(uint256 strategyId) view returns (tuple(address adapter,address dexRouter,address token0,address token1,string name,string description,bool active))",
  "function nextStrategyIdByOwner(address owner) view returns (uint256)",
  "function registerStrategy(address adapter,address dexRouter,address token0,address token1,string name,string description) returns (uint256 strategyId)",

  // --- owner only allowlists ---
  "function setAdapterAllowed(address adapter,bool allowed)",
  "function setRouterAllowed(address router,bool allowed)",

  // --- allowlist reads (opcional mas útil pro admin checar) ---
  "function allowedAdapters(address adapter) view returns (bool)",
  "function allowedRouters(address router) view returns (bool)",

];