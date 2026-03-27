import { apiLpAdminSaveStrategyAdapterState, SaveStrategyAdapterStateBody } from "@/core/infra/api/api-lp/admin";

export async function saveStrategyAdapterStateUseCase(params: {
  accessToken: string;
  body: SaveStrategyAdapterStateBody;
}) {
  return apiLpAdminSaveStrategyAdapterState(params.accessToken, params.body);
}