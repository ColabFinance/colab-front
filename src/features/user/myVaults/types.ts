export type VaultHealth = "healthy" | "warning" | "critical";

export type VaultRow = {
  id: string;

  alias: string;
  subtitle?: string;

  vaultAddress: string;

  strategyName: string;
  strategyKey: string;

  chainName: string;
  dexName: string;

  pairLabel: string;
  token0Symbol: string;
  token1Symbol: string;

  health: VaultHealth;
  updatedAtLabel: string;

  explorerUrl?: string;
};

export type StrategyOption = {
  id: string;
  name: string;
  key: string;

  chainName: string;
  dexName: string;

  poolAddressShort: string;
  pairLabel: string;

  adapterStatus: "ok" | "missing";
  gaugeStatus: "none" | "available";
};