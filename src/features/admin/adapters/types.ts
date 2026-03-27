export type AdapterRecordStatus = "ACTIVE" | "ARCHIVED_CAN_CREATE_NEW";
export type AdapterStatusFilter = "all" | AdapterRecordStatus;

export type Adapter = {
  chain: string;
  address: string;
  txHash?: string | null;

  dex: string;

  pool: string;
  nfpm: string;
  gauge: string;
  feeBuffer: string;

  token0: string;
  token1: string;

  poolName: string;
  feeBps: string;
  status: AdapterRecordStatus;

  createdAt?: string | null;
  createdBy?: string | null;
  createdAtLabel: string;
};

export type AdaptersFilters = {
  chain: string;
  dex: string | "all";
  status: AdapterStatusFilter;
};

export type AdapterDraft = {
  dex: string;
  pool: string;
  feeBuffer: string;
  status: AdapterRecordStatus;
};