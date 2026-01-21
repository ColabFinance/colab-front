import { apiLpListDexes, DexRegistryRecord } from "@/infra/api-lp/dexRegistry";

function unwrapItems<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (Array.isArray(data?.items)) return data.items as T[];
  return [];
}

export async function listDexesForStrategyUseCase(params: {
  accessToken: string;
  query: { chain: "base" | "bnb"; limit?: number };
}): Promise<DexRegistryRecord[]> {
  const res = await apiLpListDexes(params.accessToken, params.query);
  if (!res?.ok) {
    throw new Error(res?.message || "Failed to list dex registries");
  }
  return unwrapItems<DexRegistryRecord>(res.data);
}
