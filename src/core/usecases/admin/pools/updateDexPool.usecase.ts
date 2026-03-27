import { apiLpAdminUpdateDexPool, type UpdateDexPoolBody } from "@/core/infra/api/api-lp/admin";

export async function updateDexPoolUseCase(params: {
  accessToken: string;
  body: UpdateDexPoolBody;
}) {
  return apiLpAdminUpdateDexPool(params.accessToken, params.body);
}