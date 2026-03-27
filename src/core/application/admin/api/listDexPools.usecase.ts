import { type ChainKey } from "@/core/infra/api/api-lp/admin";
import { apiLpListDexPools } from "@/core/infra/api/api-lp/dexRegistry";

export async function listDexPoolsUseCase(params: { accessToken: string; chain: ChainKey; dex: string; limit?: number }) {
  return await apiLpListDexPools(params.accessToken, { chain: params.chain, dex: params.dex, limit: params.limit });
}
