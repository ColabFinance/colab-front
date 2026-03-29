import {
  apiTradeExecutionListExecutionProfiles,
  type ExecutionProfileApiRecord,
} from "@/core/infra/api/api-trade-execution/tradeExecution";

export type ExecutionProfileListItem = ExecutionProfileApiRecord;

export async function listExecutionProfilesUseCase(params?: {
  accessToken?: string;
  query?: {
    execution_account_id?: string;
  };
}): Promise<{ ok: boolean; data?: ExecutionProfileListItem[]; message?: string }> {
  return apiTradeExecutionListExecutionProfiles(params);
}