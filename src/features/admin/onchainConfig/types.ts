export type OnchainTabId =
  | "strategyRegistry"
  | "vaultFactory"
  | "protocolFeeCollector"
  | "vaultFeeBuffer";

export type ChainOption = {
  chainId: number;
  name: string;
  key: string;
};

export type AllowlistStatus = "active" | "disabled";

export type RouterAllowlistItem = {
  id: string;
  name: string;
  address: string;
  status: AllowlistStatus;
  desiredAllowed: boolean;
  onchainAllowed: boolean;
  updatedAtLabel?: string;
  txHash?: string | null;
};

export type AdapterAllowlistItem = {
  id: string;
  label: string;
  adapterType: string;
  address: string;
  status: AllowlistStatus;
  desiredAllowed: boolean;
  onchainAllowed: boolean;
  updatedAtLabel?: string;
  txHash?: string | null;
};

export type VaultFactoryConfig = {
  contractAddress: string;
  ownerAddress: string;
  executorAddress: string;
  feeCollectorAddress: string;
  cooldownSec: number;
  maxSlippageBps: number;
  allowSwap: boolean;
};

export type ProtocolFeeCollectorConfig = {
  contractAddress: string;
  ownerAddress: string;
  treasuryAddress: string;
  feeBps: number;
};

export type ReporterItem = {
  id: string;
  address: string;
  desiredAllowed: boolean;
  onchainAllowed: boolean;
  addedAtLabel: string;
};

export type DepositorItem = {
  id: string;
  address: string;
  label: string;
  desiredAllowed: boolean;
  onchainAllowed: boolean;
  addedAtLabel: string;
};

export type PendingTx = {
  contractLabel: string;
  contractAddress: string;
  functionLabel: string;
  description: string;
  params: Array<{ k: string; v: string }>;
};