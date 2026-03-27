import { apiLpAdminCreateVaultFactory, type CreateVaultFactoryBody } from "@/core/infra/api/api-lp/admin";

export async function createVaultFactoryUseCase(params: { accessToken: string; body: CreateVaultFactoryBody }) {
  return apiLpAdminCreateVaultFactory(params.accessToken, params.body);
}
