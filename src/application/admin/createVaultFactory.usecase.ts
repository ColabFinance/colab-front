import { apiLpAdminCreateVaultFactory, type CreateVaultFactoryBody } from "@/infra/api-lp/admin";

export async function createVaultFactoryUseCase(params: { accessToken: string; body: CreateVaultFactoryBody }) {
  return apiLpAdminCreateVaultFactory(params.accessToken, params.body);
}
