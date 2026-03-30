import { apiTradeExecutionListExecutionProfiles } from "@/core/infra/api/api-trade-execution/tradeExecution";

type Params = {
  accessToken?: string;
  query?: {
    execution_account_id?: string;
  };
};

export async function listTradeExecutionProfilesUseCase(params: Params = {}) {
  const response = await apiTradeExecutionListExecutionProfiles(params);

  if (!response.ok) {
    throw new Error(response.message || "Failed to load execution profiles.");
  }

  return {
    data: response.data || [],
  };
}