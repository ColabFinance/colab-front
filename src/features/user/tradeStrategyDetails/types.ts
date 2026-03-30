export type TradeStrategyDetailsRecord = {
  id: string;
  name: string;
  symbol: string;
  source: string;
  interval: string;
  streamKey: string;
  strategyType: string;
  status: string;
  executionTarget: string;
  executionAccountId: string | null;
  createdAtIso: string | null;
  updatedAtIso: string | null;
  params: {
    atrWindow: number;
    atrLowThreshold: number;
    atrHighThreshold: number;
    atrThresholdMode: string;
    cooloffBars: number;
    tradeMode: string;
    reverseSignal: boolean;
    allowedWeekdays: string[] | null;
    maxLossPct: number | null;
  };
};

export type TradeStrategyRuntimeRecord = {
  ts: number;
  openTime: number;
  closeTime: number;
  atr: number;
  atrPct: number;
  atrValueForThreshold: number;
  lowAtrHit: number;
  highAtrHit: number;
  setupArmed: number;
  setupReferencePrice: number | null;
  desiredSide: string | null;
  positionSide: string | null;
  event: string | null;
  signalUp: number;
  signalDown: number;
  signalUpFirst: number;
  signalDownFirst: number;
  exitSignal: number;
  runtimeState: string | null;
  barsSinceLastEvent: number;
  updatedAtIso: string | null;
};

export type TradeStrategySignalRecord = {
  id: string;
  ts: number;
  signalType: string;
  status: string;
  idempotencyKey: string;
  attempts: number;
  lastError: string | null;
  executionResponse: Record<string, unknown> | null;
  createdAtIso: string | null;
};

export type TradeStrategySignalsPagination = {
  limit: number;
  offset: number;
  page: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
};