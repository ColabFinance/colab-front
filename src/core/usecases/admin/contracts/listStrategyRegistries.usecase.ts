import { apiLpAdminListStrategyRegistries } from "@/core/infra/api/api-lp/admin";

export async function listStrategyRegistriesUseCase(params: {
  accessToken: string;
  chain: "base" | "bnb";
  limit?: number;
}) {
  return apiLpAdminListStrategyRegistries(
    params.accessToken,
    params.chain,
    params.limit ?? 50
  );
}