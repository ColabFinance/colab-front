export const VaultFactoryAbi = [
  // views
  "function getVaultsByOwner(address) view returns (address[])",
  "function executor() view returns (address)",
  "function feeCollector() view returns (address)",
  "function defaultCooldownSec() view returns (uint32)",
  "function defaultMaxSlippageBps() view returns (uint16)",
  "function defaultAllowSwap() view returns (bool)",

  // writes
  "function createClientVault(uint256 strategyId, address ownerOverride) returns (address vaultAddr)",
  "function setExecutor(address newExecutor)",
  "function setFeeCollector(address newCollector)",
  "function setDefaults(uint32 _cooldownSec, uint16 _maxSlippageBps, bool _allowSwap)",

  // events
  "event ClientVaultDeployed(address indexed vault, address indexed owner, uint256 indexed strategyId, uint256 vaultIndex)",
  "event ExecutorUpdated(address indexed oldExecutor, address indexed newExecutor)",
  "event FeeCollectorUpdated(address indexed oldCollector, address indexed newCollector)",
  "event DefaultsUpdated(uint32 cooldownSec, uint16 maxSlippageBps, bool allowSwap)",
] as const;
