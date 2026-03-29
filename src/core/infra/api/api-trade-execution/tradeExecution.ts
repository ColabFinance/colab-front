import { apiTradeExecutionGet, apiTradeExecutionPost } from "@/core/infra/api/api-trade-execution/client";

export type ExecutionProfileApiRecord = {
  id?: string;
  execution_account_id: string;
  symbol: string;
  is_enabled: boolean;
  quote_size_usd: number;
  leverage: number;
  created_at?: number | null;
  created_at_iso?: string | null;
  updated_at?: number | null;
  updated_at_iso?: string | null;
};

export type TradePositionApiRecord = {
  id?: string;
  strategy_id: string;
  execution_account_id: string;
  symbol: string;
  position_side: string;
  status: string;
  quantity: number;
  entry_price: number;
  open_order_id?: string | null;
  close_order_id?: string | null;
  signal_open_id?: string | null;
  signal_close_id?: string | null;
  open_reason?: string | null;
  close_reason?: string | null;
  opened_at: number;
  opened_at_iso?: string | null;
  closed_at?: number | null;
  closed_at_iso?: string | null;
  exit_price?: number | null;
};

export type TradeOrderApiRecord = {
  id?: string;
  action: string;
  idempotency_key: string;
  strategy_id: string;
  execution_account_id: string;
  symbol: string;
  position_side: string;
  side: string;
  quantity: number;
  signal_id?: string | null;
  signal_ts?: number | null;
  binance_order_id?: string | null;
  status: string;
  raw_response?: Record<string, unknown> | null;
  created_at?: number | null;
  created_at_iso?: string | null;
  updated_at?: number | null;
  updated_at_iso?: string | null;
};

export type ExecutionProfileUpsertBody = {
  execution_account_id: string;
  symbol: string;
  is_enabled: boolean;
  quote_size_usd: number;
  leverage: number;
};

export async function apiTradeExecutionListExecutionProfiles(params?: {
  accessToken?: string;
  query?: {
    execution_account_id?: string;
  };
}): Promise<{ ok: boolean; data?: ExecutionProfileApiRecord[]; message?: string }> {
  const qs = new URLSearchParams();

  if (params?.query?.execution_account_id) {
    qs.set("execution_account_id", params.query.execution_account_id);
  }

  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiTradeExecutionGet(`/execution-profiles${suffix}`, params?.accessToken || "");
}

export async function apiTradeExecutionUpsertExecutionProfile(params: {
  accessToken?: string;
  body: ExecutionProfileUpsertBody;
}): Promise<{ ok: boolean; data?: ExecutionProfileApiRecord; message?: string }> {
  return apiTradeExecutionPost(`/execution-profiles/upsert`, params.body, params.accessToken);
}

export async function apiTradeExecutionListActivePositions(params?: {
  accessToken?: string;
  query?: {
    execution_account_id?: string;
  };
}): Promise<{ ok: boolean; data?: TradePositionApiRecord[]; message?: string }> {
  const qs = new URLSearchParams();

  if (params?.query?.execution_account_id) {
    qs.set("execution_account_id", params.query.execution_account_id);
  }

  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiTradeExecutionGet(`/trade-execution/positions/active${suffix}`, params?.accessToken || "");
}

export async function apiTradeExecutionListOrdersByStrategy(params: {
  accessToken?: string;
  query: {
    strategy_id: string;
    limit?: number;
  };
}): Promise<{ ok: boolean; data?: TradeOrderApiRecord[]; message?: string }> {
  const qs = new URLSearchParams();
  qs.set("strategy_id", params.query.strategy_id);
  if (typeof params.query.limit === "number") qs.set("limit", String(params.query.limit));

  return apiTradeExecutionGet(
    `/trade-execution/orders?${qs.toString()}`,
    params.accessToken || ""
  );
}