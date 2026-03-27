import { apiLpAdminListChains } from "@/core/infra/api/api-lp/admin";

export async function listChainsUseCase(params: {
  accessToken: string;
  limit?: number;
}) {
  return apiLpAdminListChains(params.accessToken, params.limit ?? 500);
}