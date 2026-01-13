import { apiLpAdminListAdapters } from "@/infra/api-lp/admin";

export async function listAdaptersUseCase(params: { accessToken: string }) {
  return apiLpAdminListAdapters(params.accessToken);
}
