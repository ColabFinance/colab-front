import { type ChainKey } from "@/infra/api-lp/admin";
import { apiLpListDexes } from "@/infra/api-lp/dexRegistry";

export async function listDexesUseCase(params: { accessToken: string; chain: ChainKey }) {
  return await apiLpListDexes(params.accessToken, { chain: params.chain});
}
