import { apiLpAdminListOwners } from "@/infra/api-lp/admin";

export async function listOwnersUseCase(params: { accessToken: string }) {
  return apiLpAdminListOwners(params.accessToken);
}
