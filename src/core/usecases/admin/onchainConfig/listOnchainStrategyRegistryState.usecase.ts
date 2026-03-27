import { apiLpAdminListOnchainStrategyRegistryState } from "@/core/infra/api/api-lp/admin";

export async function listOnchainStrategyRegistryStateUseCase(params: {
  accessToken: string;
  chain: string;
}) {
  return apiLpAdminListOnchainStrategyRegistryState(params.accessToken, params.chain);
}