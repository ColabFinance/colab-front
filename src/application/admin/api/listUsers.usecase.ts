import { apiLpAdminListUsers } from "@/infra/api-lp/admin";

export async function listUsersUseCase(params: { accessToken: string }) {
  return apiLpAdminListUsers(params.accessToken);
}
