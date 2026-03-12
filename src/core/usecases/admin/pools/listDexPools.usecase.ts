import { apiLpAdminListDexPools } from "@/core/infra/api/api-lp/admin";

export async function listDexPoolsUseCase(params: {
  accessToken: string;
  chain: string;
  dex: string;
  limit?: number;
}) {
  return apiLpAdminListDexPools(
    params.accessToken,
    params.chain,
    params.dex,
    params.limit ?? 500
  );
}