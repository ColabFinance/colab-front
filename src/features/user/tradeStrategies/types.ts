export type TradeStrategiesKpis = {
  total: number;
  active: number;
  inactive: number;
  uniqueStreamKeys: number;
  uniqueExecutionAccounts: number;
};

export type TradeStrategiesFiltersState = {
  status: string;
  streamKey: string;
  symbol: string;
  executionAccountId: string;
  search: string;
  limit: number;
  page: number;
};

export type TradeStrategyRow = {
  id: string;
  name: string;
  symbol: string;
  source: string;
  interval: string;
  streamKey: string;
  strategyType: string;
  executionTarget: string;
  executionAccountId: string | null;
  status: string;
  updatedAtIso: string;
};

export type TradeStrategiesFilterOptions = {
  statuses: string[];
  streamKeys: string[];
  symbols: string[];
  executionAccountIds: string[];
};

export type TradeStrategiesPaginationState = {
  limit: number;
  offset: number;
  page: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type CreateTradeStrategyFormState = {
  name: string;
  symbol: string;
  source: string;
  interval: string;
  streamKey: string;
  strategyType: string;
  status: string;
  executionTarget: string;
  executionAccountId: string;
  atrWindow: string;
  atrLowThreshold: string;
  atrHighThreshold: string;
  atrThresholdMode: string;
  cooloffBars: string;
  tradeMode: string;
  reverseSignal: boolean;
  allowedWeekdays: string;
  maxLossPct: string;
};