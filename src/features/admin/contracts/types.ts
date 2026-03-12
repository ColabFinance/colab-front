import type {
  AdminContractRecord,
  ChainKey,
  ChainRegistryStatus,
} from "@/core/infra/api/api-lp/admin";

export type ContractTabKey =
  | "strategy-registry"
  | "vault-factory"
  | "protocol-fee-collector"
  | "vault-fee-buffer";

export type ContractMode = "deploy" | "register";

export type FormFieldType = "text" | "number" | "select" | "boolean";

export type FormOption = {
  value: string;
  label: string;
};

export type FormField = {
  id: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  defaultValue?: string | number | boolean;
  options?: FormOption[];
};

export type ChainOption = {
  value: ChainKey;
  label: string;
  status: ChainRegistryStatus;
};

export type RuntimeContractStatus = "active" | "deprecated" | "inactive";

export type RuntimeContractRecord = {
  chain: string;
  address: string;
  owner?: string;
  ownerTag?: string;
  txHash?: string;
  status: RuntimeContractStatus;
  createdAtLabel: string;
  createdAtFullLabel?: string;
  updatedAtLabel: string;
  explorerUrl?: string;
  txExplorerUrl?: string;
  extra?: Record<string, unknown>;
};

export type ContractDefinition = {
  key: ContractTabKey;
  name: string;
  description: string;
  deployFields: FormField[];
  registerTitle: string;
  registerDescription: string;
};

export type ContractFormValues = Record<string, string>;

export type ContractApiState = {
  active?: RuntimeContractRecord;
  history: RuntimeContractRecord[];
};

export type RawAdminContractRecord = AdminContractRecord;