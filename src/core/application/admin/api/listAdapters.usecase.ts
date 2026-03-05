import { apiLpAdminListAdapters, type ChainKey } from "@/core/infra/api/api-lp/admin";

export async function listAdaptersUseCase(params: { accessToken: string; chain: ChainKey }) {
  return apiLpAdminListAdapters(params.accessToken, params.chain);
}
