import { apiLpAdminListDexPools, type ChainKey } from "@/infra/api-lp/admin";

export async function listDexPoolsUseCase(params: { accessToken: string; chain: ChainKey; dex: string; limit?: number }) {
  return apiLpAdminListDexPools(params.accessToken, { chain: params.chain, dex: params.dex, limit: params.limit });
}
