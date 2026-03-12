import { apiLpAdminCreateVaultFeeBuffer, type CreateVaultFeeBufferBody } from "@/core/infra/api/api-lp/admin";

export async function createVaultFeeBufferUseCase(params: {
  accessToken: string;
  body: CreateVaultFeeBufferBody;
}) {
  return apiLpAdminCreateVaultFeeBuffer(params.accessToken, params.body);
}
