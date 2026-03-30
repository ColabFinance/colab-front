export type TradeHomeStatusFilter = "all" | string;

export type TradeHomeKpis = {
  totalTradeStrategies: number;
  activeTradeStrategies: number;
  activePositions: number;
  pendingSignals: number;
  failedSignals: number;
  enabledExecutionProfiles: number;
};

export type TradeStrategyRow = {
  id: string;
  name: string;
  symbol: string;
  streamKey: string;
  strategyType: string;
  executionAccount: string | null;
  status: string;
  updatedAtLabel: string;
  detailsHref: string;
  monitorHref: string;
};

export type RuntimeHighlightRow = {
  strategyId: string;
  symbol: string;
  runtimeState: string;
  event: string;
  atr: string;
  atrPct: string;
  setupArmed: boolean;
  desiredSide: string;
  positionSide: string;
  barsSinceEvent: string;
  updatedAtLabel: string;
  detailsHref: string;
  monitorHref: string;
};

export type ActivePositionRow = {
  id: string;
  symbol: string;
  strategyId: string;
  executionAccount: string | null;
  positionSide: string;
  status: string;
  quantity: string;
  entryPrice: string;
  openedAt: string;
  detailsHref: string;
  monitorHref: string;
};

export type TradeSignalRow = {
  id: string;
  strategyId: string;
  symbol: string;
  signalType: string;
  status: string;
  timestamp: string;
  attempts: string;
  lastError: string;
  detailsHref: string;
  monitorHref: string;
};

export type OperationalWarning = {
  id: string;
  tone: "red" | "orange" | "yellow" | "blue";
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
};