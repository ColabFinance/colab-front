import { apiLpAdminListOwners } from "@/core/infra/api/api-lp/admin";

export async function listOwnersUseCase(params: { accessToken: string }) {
  return apiLpAdminListOwners(params.accessToken);
}
