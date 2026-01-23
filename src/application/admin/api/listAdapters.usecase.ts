import { apiLpAdminListAdapters, type ChainKey } from "@/infra/api-lp/admin";

export async function listAdaptersUseCase(params: { accessToken: string; chain: ChainKey }) {
  return apiLpAdminListAdapters(params.accessToken, params.chain);
}
