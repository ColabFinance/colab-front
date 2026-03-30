import { apiTradeExecutionListActivePositions } from "@/core/infra/api/api-trade-execution/tradeExecution";

type Params = {
  accessToken?: string;
  query?: {
    execution_account_id?: string;
    status_scope?: string;
    limit?: number;
    page?: number;
    offset?: number;
  };
};

export async function listActiveTradePositionsUseCase(params: Params = {}) {
  const response = await apiTradeExecutionListActivePositions(params);

  if (!response.ok) {
    throw new Error(response.message || "Failed to load positions.");
  }

  return {
    data: response.data || [],
    pagination: response.pagination || {
      limit: Number(params.query?.limit || 10),
      offset: Number(params.query?.offset || 0),
      page: Number(params.query?.page || 1),
      total: 0,
      has_next: false,
      has_prev: false,
    },
  };
}