export type TradeStrategyStatus = "active" | "paused" | "failed";
export type TradeSignalStatus = "pending" | "failed" | "completed";
export type TradeSide = "long" | "short" | "none";
export type WarningTone = "red" | "orange" | "yellow" | "blue";
export type TradeHomeStatusFilter = "all" | TradeStrategyStatus;

export type TradeStrategyRow = {
  id: string;
  name: string;
  symbol: string;
  streamKey: string;
  strategyType: string;
  executionAccount: string | null;
  status: TradeStrategyStatus;
  updatedAtLabel: string;
};

export type RuntimeHighlightRow = {
  strategyId: string;
  symbol: string;
  runtimeState: string;
  event: string;
  atr: string;
  atrPct: string;
  setupArmed: boolean;
  desiredSide: TradeSide;
  positionSide: TradeSide;
  barsSinceEvent: number;
  updatedAtLabel: string;
};

export type ActivePositionRow = {
  id: string;
  symbol: string;
  strategyId: string;
  executionAccount: string | null;
  positionSide: Exclude<TradeSide, "none">;
  status: "open";
  quantity: string;
  entryPrice: string;
  openedAt: string;
};

export type TradeSignalRow = {
  id: string;
  strategyId: string;
  symbol: string;
  signalType: string;
  status: TradeSignalStatus;
  timestamp: string;
  attempts: number;
  lastError: string | null;
};

export type OperationalWarning = {
  id: string;
  tone: WarningTone;
  title: string;
  description: string;
  ctaLabel: string;
};

export type TradeHomeKpis = {
  totalTradeStrategies: number;
  activeTradeStrategies: number;
  activePositions: number;
  pendingSignals: number;
  failedSignals: number;
  enabledExecutionProfiles: number;
};