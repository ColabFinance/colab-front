import { apiLpAdminListVaultFactories } from "@/core/infra/api/api-lp/admin";

export async function listVaultFactoriesUseCase(params: {
  accessToken: string;
  chain: "base" | "bnb";
  limit?: number;
}) {
  return apiLpAdminListVaultFactories(
    params.accessToken,
    params.chain,
    params.limit ?? 50
  );
}