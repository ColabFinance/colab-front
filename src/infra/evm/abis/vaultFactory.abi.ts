export const VaultFactoryAbi = [
  "function getVaultsByOwner(address) view returns (address[])",
  "function createClientVault(uint256 strategyId, address ownerOverride) returns (address vaultAddr)",
  "event ClientVaultDeployed(address indexed vault, address indexed owner, uint256 indexed strategyId, uint256 vaultIndex)",
] as const;
