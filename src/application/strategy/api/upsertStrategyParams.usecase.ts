import { apiSignalsUpsertStrategyParams, UpsertStrategyParamsBody } from "@/infra/api-signals/strategy";

export async function upsertStrategyParamsUseCase(params: {
  accessToken: string;
  payload: UpsertStrategyParamsBody;
}) {
  return apiSignalsUpsertStrategyParams(params.accessToken, params.payload);
}
