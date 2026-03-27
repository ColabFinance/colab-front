import { apiLpAdminListProtocolFeeCollectors } from "@/core/infra/api/api-lp/admin";

export async function listProtocolFeeCollectorsUseCase(params: {
  accessToken: string;
  chain: "base" | "bnb";
  limit?: number;
}) {
  return apiLpAdminListProtocolFeeCollectors(
    params.accessToken,
    params.chain,
    params.limit ?? 50
  );
}