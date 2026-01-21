import { apiLpAdminListDexes, type ChainKey } from "@/infra/api-lp/admin";

export async function listDexesUseCase(params: { accessToken: string; chain: ChainKey }) {
  return apiLpAdminListDexes(params.accessToken, params.chain);
}
