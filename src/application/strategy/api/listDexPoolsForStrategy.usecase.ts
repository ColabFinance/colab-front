import { apiLpListDexPools, DexPoolRecord } from "@/infra/api-lp/dexRegistry";

function unwrapItems<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (Array.isArray(data?.items)) return data.items as T[];
  return [];
}

export async function listDexPoolsForStrategyUseCase(params: {
  accessToken: string;
  query: { chain: "base" | "bnb"; dex: string; limit?: number };
}): Promise<DexPoolRecord[]> {
  const res = await apiLpListDexPools(params.accessToken, params.query);
  if (!res?.ok) {
    throw new Error(res?.message || "Failed to list dex pools");
  }
  return unwrapItems<DexPoolRecord>(res.data);
}
