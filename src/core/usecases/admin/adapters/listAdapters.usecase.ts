import { apiLpAdminListAdapters } from "@/core/infra/api/api-lp/admin";

export async function listAdaptersUseCase(params: {
  accessToken: string;
  chain: string;
}) {
  return apiLpAdminListAdapters(params.accessToken, params.chain);
}