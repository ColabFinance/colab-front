import { apiTradeExecutionListOrders } from "@/core/infra/api/api-trade-execution/tradeExecution";

type Params = {
  accessToken?: string;
  query?: {
    strategy_id?: string;
    execution_account_id?: string;
    lifecycle_scope?: string;
    limit?: number;
    page?: number;
    offset?: number;
  };
};

export async function listTradeOrdersUseCase(params: Params = {}) {
  const response = await apiTradeExecutionListOrders(params);

  if (!response.ok) {
    throw new Error(response.message || "Failed to load trade orders.");
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