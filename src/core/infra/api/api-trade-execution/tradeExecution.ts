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
  created_at?: number | null;
  created_at_iso?: string | null;
  updated_at?: number | null;
  updated_at_iso?: string | null;
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
    status_scope?: string;
    limit?: number;
    page?: number;
    offset?: number;
  };
}): Promise<{
  ok: boolean;
  data?: TradePositionApiRecord[];
  pagination?: {
    limit?: number;
    offset?: number;
    page?: number;
    total?: number;
    has_next?: boolean;
    has_prev?: boolean;
  };
  message?: string;
}> {
  const qs = new URLSearchParams();

  if (params?.query?.execution_account_id) {
    qs.set("execution_account_id", params.query.execution_account_id);
  }
  if (params?.query?.status_scope) {
    qs.set("status_scope", params.query.status_scope);
  }
  if (typeof params?.query?.limit === "number") {
    qs.set("limit", String(params.query.limit));
  }
  if (typeof params?.query?.page === "number") {
    qs.set("page", String(params.query.page));
  }
  if (typeof params?.query?.offset === "number") {
    qs.set("offset", String(params.query.offset));
  }

  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiTradeExecutionGet(`/trade-execution/positions/active${suffix}`, params?.accessToken || "");
}

export async function apiTradeExecutionListOrders(params?: {
  accessToken?: string;
  query?: {
    strategy_id?: string;
    execution_account_id?: string;
    lifecycle_scope?: string;
    limit?: number;
    page?: number;
    offset?: number;
  };
}): Promise<{
  ok: boolean;
  data?: TradeOrderApiRecord[];
  pagination?: {
    limit?: number;
    offset?: number;
    page?: number;
    total?: number;
    has_next?: boolean;
    has_prev?: boolean;
  };
  message?: string;
}> {
  const qs = new URLSearchParams();

  if (params?.query?.strategy_id) {
    qs.set("strategy_id", params.query.strategy_id);
  }
  if (params?.query?.execution_account_id) {
    qs.set("execution_account_id", params.query.execution_account_id);
  }
  if (params?.query?.lifecycle_scope) {
    qs.set("lifecycle_scope", params.query.lifecycle_scope);
  }
  if (typeof params?.query?.limit === "number") {
    qs.set("limit", String(params.query.limit));
  }
  if (typeof params?.query?.page === "number") {
    qs.set("page", String(params.query.page));
  }
  if (typeof params?.query?.offset === "number") {
    qs.set("offset", String(params.query.offset));
  }

  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiTradeExecutionGet(`/trade-execution/orders${suffix}`, params?.accessToken || "");
}