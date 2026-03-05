export type OnchainTabId =
  | "strategyRegistry"
  | "vaultFactory"
  | "protocolFeeCollector"
  | "vaultFeeBuffer";

export type ChainOption = {
  chainId: number;
  name: string;
};

export type AllowlistStatus = "active" | "disabled";

export type RouterAllowlistItem = {
  id: string;
  name: string;
  address: string;
  status: AllowlistStatus;
};

export type AdapterAllowlistItem = {
  id: string;
  label: string;
  adapterType: string;
  address: string;
  status: AllowlistStatus;
};

export type VaultFactoryConfig = {
  contractAddress: string;
  timelockAddress: string;

  executorAddress: string;
  feeCollectorAddress: string;

  cooldownSec: number;
  slippageBps: number;
  feeBps: number;
  compoundEnabled: boolean;
};

export type ProtocolFeeCollectorConfig = {
  contractAddress: string;
  treasuryAddress: string;
  feeBps: number;
};

export type ReporterItem = {
  id: string;
  address: string;
  addedAtLabel: string;
};

export type DepositorItem = {
  id: string;
  address: string;
  label: string;
};

export type PendingTx = {
  contractLabel: string;
  contractAddress: string;
  functionLabel: string;
  description: string;
  params: Array<{ k: string; v: string }>;
};