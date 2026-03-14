export type VaultStatus = "active" | "inactive";
export type VaultRangeState = "inside" | "outside" | "na";
export type StrategyStatus = "active" | "inactive";

export interface MyVaultItem {
  id: string;
  name: string;
  subtitle: string;
  address: string;
  strategyName: string;
  strategyId: string;
  marketPair: string;
  chainName: string;
  dexName: string;
  status: VaultStatus;
  rangeState: VaultRangeState;
  currentValueUsd?: number | null;
  pnlPct?: number | null;
  updatedLabel: string;
  explorerUrl: string;
  detailsHref: string;
}

export interface StrategyOption {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  status: StrategyStatus;

  ownerAddress: string;

  adapter: string;
  dexRouter: string;
  token0: string;
  token1: string;

  chainKey: string;
  chainName: string;

  dexKey: string;
  dexName: string;

  marketPair: string;
  parToken: string;

  poolAddress: string;
  nfpmAddress: string;
  gaugeAddress?: string | null;
  rewardTokenAddress?: string | null;

  rpcUrl: string;
  version: string;

  adapterCompatible: boolean;
}

export interface ConnectedContext {
  ownerAddress: string;
  chainName: string;
  chainKey: string;
}

export interface VaultCreateForm {
  strategyId: string;
  vaultName: string;
  description: string;
  swapPoolsJson: string;
  rewardSwapPreview: string;
  jobConfigPreview: string;
}

export interface MyVaultsKpis {
  totalVaults: number;
  activeVaults: number;
  inactiveVaults: number;
  chains: number;
  dexes: number;
  totalValueUsd: number;
}

export interface CreateVaultResult {
  txHash: string;
  vaultAddress: string;
  alias?: string;
  mongoId?: string;
}

export interface CreateVaultProgress {
  label: string;
  detail?: string;
}