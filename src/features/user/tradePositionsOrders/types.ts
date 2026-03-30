export type PositionsOrdersTab = "positions" | "orders";
export type StatusScope = "ALL" | "OPEN" | "CLOSED";

export type PositionsOrdersFiltersState = {
  executionAccountId: string;
  strategyId: string;
  statusScope: StatusScope;
};

export type PaginationState = {
  limit: number;
  offset: number;
  page: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ExecutionAccountOption = {
  value: string;
  label: string;
};

export type StrategyOption = {
  value: string;
  label: string;
  name: string;
};

export type TradePositionRow = {
  id: string;
  strategyId: string;
  executionAccountId: string;
  symbol: string;
  positionSide: string;
  status: string;
  quantity: number;
  entryPrice: number;
  openOrderId: string | null;
  closeOrderId: string | null;
  signalOpenId: string | null;
  signalCloseId: string | null;
  openReason: string | null;
  closeReason: string | null;
  openedAt: number;
  openedAtIso: string | null;
  closedAt: number | null;
  closedAtIso: string | null;
  exitPrice: number | null;
  createdAtIso: string | null;
  updatedAtIso: string | null;
};

export type TradeOrderRow = {
  id: string;
  action: string;
  idempotencyKey: string;
  strategyId: string;
  executionAccountId: string;
  symbol: string;
  positionSide: string;
  side: string;
  quantity: number;
  signalId: string | null;
  signalTs: number | null;
  binanceOrderId: string | null;
  status: string;
  rawResponse: Record<string, unknown> | null;
  createdAtIso: string | null;
  updatedAtIso: string | null;
};