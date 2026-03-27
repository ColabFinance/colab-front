import { type ChainKey } from "@/core/infra/api/api-lp/admin";
import { apiLpListDexes } from "@/core/infra/api/api-lp/dexRegistry";

export async function listDexesUseCase(params: { accessToken: string; chain: ChainKey }) {
  return await apiLpListDexes(params.accessToken, { chain: params.chain});
}
