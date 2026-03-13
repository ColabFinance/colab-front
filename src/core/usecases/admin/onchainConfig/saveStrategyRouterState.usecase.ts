import { apiLpAdminSaveStrategyRouterState, SaveStrategyRouterStateBody } from "@/core/infra/api/api-lp/admin";

export async function saveStrategyRouterStateUseCase(params: {
  accessToken: string;
  body: SaveStrategyRouterStateBody;
}) {
  return apiLpAdminSaveStrategyRouterState(params.accessToken, params.body);
}