import { apiSignalsCreateTradeStrategy } from "@/core/infra/api/api-signals/tradeStrategy";

export async function createTradeStrategyUseCase(params: {
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
}) {
  return apiSignalsCreateTradeStrategy(params);
}