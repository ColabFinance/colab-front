import { apiLpAdminCreateVaultFactory } from "@/infra/api-lp/admin";

export async function createVaultFactoryUseCase(params: { accessToken: string }) {
  return apiLpAdminCreateVaultFactory(params.accessToken);
}
