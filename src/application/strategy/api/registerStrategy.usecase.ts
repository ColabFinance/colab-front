import { apiSignalsRegisterStrategy, RegisterStrategyBody } from "@/infra/api-signals/strategy";

export async function registerStrategyDbUseCase(params: {
  accessToken: string;
  payload: RegisterStrategyBody;
}) {
  return apiSignalsRegisterStrategy(params.accessToken, params.payload);
}
