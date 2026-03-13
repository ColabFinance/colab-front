import { apiLpAdminListOnchainVaultFeeBufferState } from "@/core/infra/api/api-lp/admin";

export async function listOnchainVaultFeeBufferStateUseCase(params: {
  accessToken: string;
  chain: string;
}) {
  return apiLpAdminListOnchainVaultFeeBufferState(params.accessToken, params.chain);
}