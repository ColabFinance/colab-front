export type DexPoolType =
  | "STABLE"
  | "VOLATILE"
  | "VOLATILE_V2"
  | "CONCENTRATED"
  | "WEIGHTED"
  | "V3";

export type DexVerification = "verified" | "pending";

export type ChainOption = {
  chainId: number;
  name: string;
};

export type DexRegistryItem = {
  id: string;
  chainId: number;
  name: string;
  key: string;

  routerAddress: string;
  quoterAddress?: string;
  positionManagerAddress?: string;

  poolTypes: DexPoolType[];

  enabled: boolean;
  verification: DexVerification;

  updatedAtLabel: string;
};