export type ContractTabKey =
  | "strategy-registry"
  | "vault-factory"
  | "protocol-fee-collector"
  | "vault-fee-buffer";

export type ContractStatus = "active" | "maintenance" | "missing";

export type GlobalContract = {
  key: ContractTabKey;
  name: string;
  status: ContractStatus;

  address?: string;
  owner?: string;
  ownerTag?: string;

  version?: string;
  lastSyncedLabel?: string;

  counters?: Array<{ label: string; value: number }>;
  timeline?: Array<{ title: string; subtitle: string; kind: "success" | "info" }>;
};