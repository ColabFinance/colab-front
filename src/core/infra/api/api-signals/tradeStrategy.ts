import { apiSignalsGet, apiSignalsPost } from "@/core/infra/api/api-signals/client";

export type TradeStrategyParamsRecord = {
  atr_window: number;
  atr_low_threshold: number;
  atr_high_threshold: number;
  atr_threshold_mode: string;
  cooloff_bars: number;
  trade_mode: string;
  reverse_signal: boolean;
  allowed_weekdays?: string[] | null;
  max_loss_pct?: number | null;
};

export type TradeStrategyApiRecord = {
  id?: string;
  name: string;
  symbol: string;
  source: string;
  interval: string;
  stream_key: string;
  strategy_type: string;
  status: string;
  execution_target: string;
  execution_account_id?: string | null;
  params: TradeStrategyParamsRecord;
  created_at?: number | null;
  created_at_iso?: string | null;
  updated_at?: number | null;
  updated_at_iso?: string | null;
};

export type TradeSignalApiRecord = {
  id?: string | null;
  strategy_id: string;
  stream_key: string;
  symbol: string;
  interval: string;
  ts: number;
  signal_type: string;
  status: string;
  idempotency_key: string;
  payload: Record<string, unknown>;
  attempts?: number;
  last_error?: string | null;
  execution_response?: Record<string, unknown> | null;
  created_at?: number | null;
  created_at_iso?: string | null;
};

export type TradeStrategyRuntimeSnapshotApiRecord = {
  id?: string | null;
  strategy_id: string;
  stream_key: string;
  symbol: string;
  interval: string;
  strategy_type: string;
  ts: number;
  open_time: number;
  close_time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trades: number;
  is_closed: boolean;
  atr: number;
  atr_pct: number;
  atr_value_for_threshold: number;
  low_atr_hit: number;
  high_atr_hit: number;
  setup_armed: number;
  setup_reference_price?: number | null;
  desired_side?: string | null;
  position_side?: string | null;
  entry_reference_price?: number | null;
  open_trade_loss_pct?: number;
  event?: string | null;
  signal_up: number;
  signal_down: number;
  signal_up_first: number;
  signal_down_first: number;
  exit_signal: number;
  runtime_state?: string | null;
  bars_since_last_event?: number;
  created_at?: number | null;
  created_at_iso?: string | null;
  updated_at?: number | null;
  updated_at_iso?: string | null;
};

export async function apiSignalsGetTradeStrategyById(params: {
  accessToken?: string;
  strategyId: string;
}): Promise<{
  ok: boolean;
  data?: TradeStrategyApiRecord;
  message?: string;
}> {
  return apiSignalsGet(`/trade-strategies/${encodeURIComponent(params.strategyId)}`, params.accessToken || "");
}

export async function apiSignalsListTradeStrategies(params?: {
  accessToken?: string;
  query?: {
    stream_key?: string;
    status?: string;
    limit?: number;
  };
}): Promise<{ ok: boolean; data?: TradeStrategyApiRecord[]; message?: string }> {
  const qs = new URLSearchParams();

  if (params?.query?.stream_key) qs.set("stream_key", params.query.stream_key);
  if (params?.query?.status) qs.set("status", params.query.status);
  if (typeof params?.query?.limit === "number") qs.set("limit", String(params.query.limit));

  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiSignalsGet(`/trade-strategies${suffix}`, params?.accessToken || "");
}

export async function apiSignalsSetTradeStrategyStatus(params: {
  accessToken?: string;
  body: {
    strategy_id: string;
    status: string;
  };
}): Promise<{ ok: boolean; data?: TradeStrategyApiRecord; message?: string }> {
  return apiSignalsPost(`/trade-strategies/status/set`, params.body, params.accessToken);
}

export async function apiSignalsGetLatestTradeStrategyRuntimeSnapshot(params: {
  accessToken?: string;
  strategyId: string;
}): Promise<{
  ok: boolean;
  data?: TradeStrategyRuntimeSnapshotApiRecord | null;
  message?: string;
}> {
  const qs = new URLSearchParams();
  qs.set("strategy_id", params.strategyId);
  return apiSignalsGet(`/trade-strategies/runtime/latest?${qs.toString()}`, params.accessToken || "");
}

export type TradeStrategyPublicPagination = {
  limit: number;
  offset: number;
  page: number;
  total: number;
  has_next: boolean;
  has_prev: boolean;
};

export type TradeStrategyPublicSummary = {
  total: number;
  active: number;
  inactive: number;
  unique_stream_keys: number;
  unique_execution_accounts: number;
};

export type TradeStrategyPublicFilterOptions = {
  statuses: string[];
  stream_keys: string[];
  symbols: string[];
  execution_account_ids: string[];
};

export async function apiSignalsCreateTradeStrategy(params: {
  accessToken?: string;
  body: {
    name: string;
    symbol: string;
    source: string;
    interval: string;
    stream_key: string;
    strategy_type: string;
    status: string;
    execution_target: string;
    execution_account_id?: string | null;
    params: {
      atr_window: number;
      atr_low_threshold: number;
      atr_high_threshold: number;
      atr_threshold_mode: string;
      cooloff_bars: number;
      trade_mode: string;
      reverse_signal: boolean;
      allowed_weekdays?: string[] | null;
      max_loss_pct?: number | null;
    };
  };
}): Promise<{ ok: boolean; data?: TradeStrategyApiRecord; message?: string }> {
  return apiSignalsPost(`/trade-strategies`, params.body, params.accessToken);
}

export async function apiSignalsListTradeStrategiesPublic(params?: {
  accessToken?: string;
  query?: {
    status?: string;
    stream_key?: string;
    symbol?: string;
    execution_account_id?: string;
    search?: string;
    limit?: number;
    page?: number;
    offset?: number;
  };
}): Promise<{
  ok: boolean;
  data?: TradeStrategyApiRecord[];
  pagination?: TradeStrategyPublicPagination;
  summary?: TradeStrategyPublicSummary;
  filter_options?: TradeStrategyPublicFilterOptions;
  message?: string;
}> {
  const qs = new URLSearchParams();

  if (params?.query?.status) qs.set("status", params.query.status);
  if (params?.query?.stream_key) qs.set("stream_key", params.query.stream_key);
  if (params?.query?.symbol) qs.set("symbol", params.query.symbol);
  if (params?.query?.execution_account_id) {
    qs.set("execution_account_id", params.query.execution_account_id);
  }
  if (params?.query?.search) qs.set("search", params.query.search);
  if (typeof params?.query?.limit === "number") qs.set("limit", String(params.query.limit));
  if (typeof params?.query?.page === "number") qs.set("page", String(params.query.page));
  if (typeof params?.query?.offset === "number") qs.set("offset", String(params.query.offset));

  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiSignalsGet(`/trade-strategies/public${suffix}`, params?.accessToken || "");
}

export type TradeSignalsPaginationApi = {
  limit: number;
  offset: number;
  page: number;
  total: number;
  has_next: boolean;
  has_prev: boolean;
};

export async function apiSignalsListTradeSignals(params?: {
  accessToken?: string;
  query?: {
    strategy_id?: string;
    limit?: number;
    page?: number;
    offset?: number;
  };
}): Promise<{
  ok: boolean;
  data?: TradeSignalApiRecord[];
  pagination?: TradeSignalsPaginationApi;
  message?: string;
}> {
  const qs = new URLSearchParams();

  if (params?.query?.strategy_id) qs.set("strategy_id", params.query.strategy_id);
  if (typeof params?.query?.limit === "number") qs.set("limit", String(params.query.limit));
  if (typeof params?.query?.page === "number") qs.set("page", String(params.query.page));
  if (typeof params?.query?.offset === "number") qs.set("offset", String(params.query.offset));

  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiSignalsGet(`/trade-strategies/signals${suffix}`, params?.accessToken || "");
}