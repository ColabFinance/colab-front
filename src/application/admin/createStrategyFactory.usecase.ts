import { apiLpAdminCreateStrategyFactory } from "@/infra/api-lp/admin";

export async function createStrategyFactoryUseCase(params: { accessToken: string }) {
  return apiLpAdminCreateStrategyFactory(params.accessToken);
}
