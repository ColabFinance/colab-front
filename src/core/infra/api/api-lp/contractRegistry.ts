import { CONFIG } from "@/shared/config/env";
import type { ChainKey } from "@/shared/config/env";

type AdapterRegistryItem = {
  address: string;
  dex: string;
  pool_name?: string;
  pool?: string;
  nfpm?: string;
  gauge?: string;
  token0?: string;
  token1?: string;
  fee_bps?: string;
};

export type ContractRegistryResponse = {
  data: {
    chain: ChainKey;
    strategy_factory: { address: string };
    vault_factory: { address: string };
    protocol_fee_collector: { address: string };
    vault_fee_buffer: { address: string };
    adapters: AdapterRegistryItem[];
  }
};

const cacheByChain: Partial<Record<ChainKey, ContractRegistryResponse>> = {};
const inflightByChain: Partial<Record<ChainKey, Promise<ContractRegistryResponse>>> = {};

export async function loadContractRegistry(chain: ChainKey): Promise<ContractRegistryResponse> {
  if (cacheByChain[chain]) return cacheByChain[chain]!;
  if (inflightByChain[chain]) return inflightByChain[chain]!;

  inflightByChain[chain] = fetch(`${CONFIG.apiLpBaseUrl}/contracts/registry?chain=${chain}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(async (r) => {
      if (!r.ok) throw new Error(`Failed to load contract registry: ${r.status}`);
      return (await r.json()) as ContractRegistryResponse;
    })
    .then((data) => {
      cacheByChain[chain] = data;
      return data;
    })
    .finally(() => {
      delete inflightByChain[chain];
    });

  return inflightByChain[chain]!;
}

export function getCachedContractRegistry(chain: ChainKey): ContractRegistryResponse | null {
  return cacheByChain[chain] ?? null;
}

export function clearContractRegistryCache(chain?: ChainKey) {
  if (chain) {
    delete cacheByChain[chain];
    delete inflightByChain[chain];
    return;
  }
  (Object.keys(cacheByChain) as ChainKey[]).forEach((k) => delete cacheByChain[k]);
  (Object.keys(inflightByChain) as ChainKey[]).forEach((k) => delete inflightByChain[k]);
}
