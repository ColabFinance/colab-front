import { apiLpAdminListUsers } from "@/core/infra/api/api-lp/admin";

export async function listUsersUseCase(params: { accessToken: string }) {
  return apiLpAdminListUsers(params.accessToken);
}
