import { apiLpListVaultsByOwner } from "@/core/infra/api/api-lp/vault";

export async function listVaultsByOwnerUseCase(params: {
  accessToken: string;
  query: {
    owner: string;
    chain?: "base" | "bnb";
    dex?: string;
    limit?: number;
    offset?: number;
  };
}) {
  return apiLpListVaultsByOwner(params.accessToken, params.query);
}
