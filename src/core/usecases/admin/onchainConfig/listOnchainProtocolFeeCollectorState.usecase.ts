import { apiLpAdminListOnchainProtocolFeeCollectorState } from "@/core/infra/api/api-lp/admin";

export async function listOnchainProtocolFeeCollectorStateUseCase(params: {
  accessToken: string;
  chain: string;
}) {
  return apiLpAdminListOnchainProtocolFeeCollectorState(params.accessToken, params.chain);
}