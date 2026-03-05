export type AdapterType = "standard" | "flashloan" | "vault";
export type AdapterHealth = "healthy" | "warning" | "offline";
export type AdapterStatusFilter = "all" | "enabled" | "disabled";

export type Adapter = {
  id: string;
  chainId: number;
  dexKey: string;
  adapterAddress: string;
  poolAddress: string;
  adapterType: AdapterType;
  version: string;
  capabilities: string[];
  enabled: boolean;
  health: AdapterHealth;
  updatedLabel: string; // ex: "2 min ago"
  notes?: string;
};

export type AdaptersFilters = {
  chainId: number | "all";
  dexKey: string | "all";
  adapterType: AdapterType | "all";
  status: AdapterStatusFilter;
};

export type AdapterDraft = {
  dexKey: string;
  adapterAddress: string;
  poolAddress: string;
  adapterType: AdapterType;
  version: string;
  capabilities: Record<string, boolean>;
  enabled: boolean;
  notes: string;
};