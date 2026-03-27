export type ChainStatus = "enabled" | "maintenance" | "disabled";

export type ChainRow = {
  key: string;
  name: string;
  chainId: number;
  status: ChainStatus;

  rpcUrl: string;

  explorerUrl: string;
  explorerLabel: string;

  nativeSymbol: string;
  stables: string[];

  updatedAt: string;

  logoUrl?: string;
};

export type ChainDrawerPayload = {
  name: string;
  chainId: number;
  nativeSymbol: string;

  rpcUrl: string;

  explorerUrl: string;
  explorerLabel?: string;

  stables: string[];
  enabled: boolean;

  logoUrl?: string;
};

export type RpcTestState =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; latestBlock: string };