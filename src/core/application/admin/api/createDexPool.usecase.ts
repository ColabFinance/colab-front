import { apiLpAdminCreateDexPool, type CreateDexPoolBody } from "@/core/infra/api/api-lp/admin";

export async function createDexPoolUseCase(params: { accessToken: string; body: CreateDexPoolBody }) {
  return apiLpAdminCreateDexPool(params.accessToken, params.body);
}
