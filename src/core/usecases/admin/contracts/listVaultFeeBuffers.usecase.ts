import { apiLpAdminListVaultFeeBuffers } from "@/core/infra/api/api-lp/admin";

export async function listVaultFeeBuffersUseCase(params: {
  accessToken: string;
  chain: "base" | "bnb";
  limit?: number;
}) {
  return apiLpAdminListVaultFeeBuffers(
    params.accessToken,
    params.chain,
    params.limit ?? 50
  );
}