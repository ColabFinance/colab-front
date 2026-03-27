export type DexRegistryFilters = {
  chain: string | "all";
  keyQuery: string;
  status: "all" | "enabled" | "disabled";
};

export type ChainOption = {
  key: string;
  chainId: number;
  name: string;
  explorerUrl?: string;
  explorerLabel?: string;
};

export type DexFormValues = {
  chain: string;
  key: string;
  routerAddress: string;
  enabled: boolean;
};

export type DexRegistryItem = {
  id: string;
  chainKey: string;
  chainId: number;
  chainName: string;

  name: string;
  key: string;
  routerAddress: string;

  enabled: boolean;
  status: "ACTIVE" | "INACTIVE";

  poolsCount: number;
  poolsPreview: string[];

  updatedAtLabel: string;
  explorerUrl?: string;
};