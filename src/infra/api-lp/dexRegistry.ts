import { apiLpGet } from "@/infra/api-lp/client";

export type DexRegistryRecord = {
  chain: "base" | "bnb";
  dex: string;

  dex_router?: string | null;

  gauge?: string | null;

  status?: string | null;
  created_at?: string | null;
};

export type DexPoolRecord = {
  chain: "base" | "bnb";
  dex: string;

  // primary
  pool: string;

  // onchain metadata we need for StrategyRegistry.registerStrategy
  adapter?: string | null;
  token0?: string | null;
  token1?: string | null;

  // optional extras (if your backend returns them)
  nfpm?: string | null;
  fee_bps?: number | null;
  fee_rate?: string | null;
  tick_spacing?: number | null;

  name?: string | null;
  pair?: string | null;
  symbol?: string | null;

  status?: string | null;
  created_at?: string | null;
};

export async function apiLpListDexes(
  accessToken: string,
  query: { chain: "base" | "bnb"; limit?: number }
): Promise<{ ok: boolean; data?: DexRegistryRecord[] | { items: DexRegistryRecord[] }; message?: string }> {
  // IMPORTANT: backend route is /dexes/ (with trailing slash)
  const qs =
    `chain=${encodeURIComponent(query.chain)}` +
    `&limit=${encodeURIComponent(String(query.limit ?? 200))}`;

  return apiLpGet(`/dexes/?${qs}`, accessToken);
}

export async function apiLpListDexPools(
  accessToken: string,
  query: { chain: "base" | "bnb"; dex: string; limit?: number }
): Promise<{ ok: boolean; data?: DexPoolRecord[] | { items: DexPoolRecord[] }; message?: string }> {
  const qs =
    `chain=${encodeURIComponent(query.chain)}` +
    `&dex=${encodeURIComponent(query.dex)}` +
    `&limit=${encodeURIComponent(String(query.limit ?? 500))}`;

  return apiLpGet(`/dexes/pools?${qs}`, accessToken);
}
