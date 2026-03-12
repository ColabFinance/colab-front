import { apiLpAdminListDexes } from "@/core/infra/api/api-lp/admin";

export async function listDexesUseCase(params: {
  accessToken: string;
  chain: string;
  limit?: number;
}) {
  return apiLpAdminListDexes(params.accessToken, params.chain, params.limit ?? 200);
}