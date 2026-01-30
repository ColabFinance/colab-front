import { apiLpAdminCreateStrategyRegistry, type CreateStrategyRegistryBody } from "@/infra/api-lp/admin";

export async function createStrategyRegistryUseCase(params: { accessToken: string; body: CreateStrategyRegistryBody }) {
  return apiLpAdminCreateStrategyRegistry(params.accessToken, params.body);
}
