import { apiLpAdminListOnchainVaultFactoryState } from "@/core/infra/api/api-lp/admin";

export async function listOnchainVaultFactoryStateUseCase(params: {
  accessToken: string;
  chain: string;
}) {
  return apiLpAdminListOnchainVaultFactoryState(params.accessToken, params.chain);
}