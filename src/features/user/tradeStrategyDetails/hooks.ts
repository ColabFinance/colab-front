"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getTradeStrategyByIdUseCase } from "@/core/usecases/user/trade/strategies/getTradeStrategyById.usecase";
import { getLatestTradeStrategyRuntimeUseCase } from "@/core/usecases/user/trade/strategies/getLatestTradeStrategyRuntime.usecase";
import { listTradeStrategySignalsUseCase } from "@/core/usecases/user/trade/strategies/listTradeStrategySignals.usecase";
import { setTradeStrategyStatusUseCase } from "@/core/usecases/user/trade/strategies/setTradeStrategyStatus.usecase";
import type {
  TradeStrategyDetailsRecord,
  TradeStrategyRuntimeRecord,
  TradeStrategySignalRecord,
} from "./types";

function normalizeStrategy(data: any): TradeStrategyDetailsRecord | null {
  if (!data) return null;

  return {
    id: String(data.id || ""),
    name: String(data.name || ""),
    symbol: String(data.symbol || ""),
    source: String(data.source || ""),
    interval: String(data.interval || ""),
    streamKey: String(data.stream_key || ""),
    strategyType: String(data.strategy_type || ""),
    status: String(data.status || ""),
    executionTarget: String(data.execution_target || ""),
    executionAccountId: data.execution_account_id ? String(data.execution_account_id) : null,
    createdAtIso: data.created_at_iso ? String(data.created_at_iso) : null,
    updatedAtIso: data.updated_at_iso ? String(data.updated_at_iso) : null,
    params: {
      atrWindow: Number(data.params?.atr_window || 0),
      atrLowThreshold: Number(data.params?.atr_low_threshold || 0),
      atrHighThreshold: Number(data.params?.atr_high_threshold || 0),
      atrThresholdMode: String(data.params?.atr_threshold_mode || ""),
      cooloffBars: Number(data.params?.cooloff_bars || 0),
      tradeMode: String(data.params?.trade_mode || ""),
      reverseSignal: Boolean(data.params?.reverse_signal),
      allowedWeekdays: Array.isArray(data.params?.allowed_weekdays)
        ? data.params.allowed_weekdays.map((item: unknown) => String(item))
        : null,
      maxLossPct:
        typeof data.params?.max_loss_pct === "number" ? Number(data.params.max_loss_pct) : null,
    },
  };
}

function normalizeRuntime(data: any): TradeStrategyRuntimeRecord | null {
  if (!data) return null;

  return {
    ts: Number(data.ts || 0),
    openTime: Number(data.open_time || 0),
    closeTime: Number(data.close_time || 0),
    atr: Number(data.atr || 0),
    atrPct: Number(data.atr_pct || 0),
    atrValueForThreshold: Number(data.atr_value_for_threshold || 0),
    lowAtrHit: Number(data.low_atr_hit || 0),
    highAtrHit: Number(data.high_atr_hit || 0),
    setupArmed: Number(data.setup_armed || 0),
    setupReferencePrice:
      data.setup_reference_price === null || data.setup_reference_price === undefined
        ? null
        : Number(data.setup_reference_price),
    desiredSide: data.desired_side ? String(data.desired_side) : null,
    positionSide: data.position_side ? String(data.position_side) : null,
    event: data.event ? String(data.event) : null,
    signalUp: Number(data.signal_up || 0),
    signalDown: Number(data.signal_down || 0),
    signalUpFirst: Number(data.signal_up_first || 0),
    signalDownFirst: Number(data.signal_down_first || 0),
    exitSignal: Number(data.exit_signal || 0),
    runtimeState: data.runtime_state ? String(data.runtime_state) : null,
    barsSinceLastEvent: Number(data.bars_since_last_event || 0),
    updatedAtIso: data.updated_at_iso ? String(data.updated_at_iso) : null,
  };
}

function normalizeSignals(data?: any[]): TradeStrategySignalRecord[] {
  return (data || []).map((item) => ({
    id: String(item.id || ""),
    ts: Number(item.ts || 0),
    signalType: String(item.signal_type || ""),
    status: String(item.status || ""),
    idempotencyKey: String(item.idempotency_key || ""),
    attempts: Number(item.attempts || 0),
    lastError: item.last_error ? String(item.last_error) : null,
    executionResponse:
      item.execution_response && typeof item.execution_response === "object"
        ? item.execution_response
        : null,
    createdAtIso: item.created_at_iso ? String(item.created_at_iso) : null,
  }));
}

export function useTradeStrategyDetailsPage(strategyId: string) {
  const [strategy, setStrategy] = useState<TradeStrategyDetailsRecord | null>(null);
  const [runtime, setRuntime] = useState<TradeStrategyRuntimeRecord | null>(null);
  const [signals, setSignals] = useState<TradeStrategySignalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedSignal, setSelectedSignal] = useState<TradeStrategySignalRecord | null>(null);
  const [selectedExecutionResponse, setSelectedExecutionResponse] = useState<Record<string, unknown> | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [strategyResponse, runtimeResponse, signalsResponse] = await Promise.all([
        getTradeStrategyByIdUseCase({ strategyId }),
        getLatestTradeStrategyRuntimeUseCase({ strategyId }),
        listTradeStrategySignalsUseCase({ strategyId, limit: 20 }),
      ]);

      setStrategy(normalizeStrategy(strategyResponse.data));
      setRuntime(normalizeRuntime(runtimeResponse.data));
      setSignals(normalizeSignals(signalsResponse.data));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load trade strategy details.");
      setStrategy(null);
      setRuntime(null);
      setSignals([]);
    } finally {
      setIsLoading(false);
    }
  }, [strategyId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleStatus = useCallback(async () => {
    if (!strategy?.id) return;

    try {
      setErrorMessage("");

      await setTradeStrategyStatusUseCase({
        body: {
          strategy_id: strategy.id,
          status: strategy.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
        },
      });

      await load();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update trade strategy status.");
    }
  }, [load, strategy]);

  const copyText = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      //
    }
  }, []);

  const openSignalDetails = useCallback((signal: TradeStrategySignalRecord) => {
    setSelectedSignal(signal);
  }, []);

  const closeSignalDetails = useCallback(() => {
    setSelectedSignal(null);
  }, []);

  const openExecutionResponse = useCallback((payload: Record<string, unknown> | null) => {
    setSelectedExecutionResponse(payload);
  }, []);

  const closeExecutionResponse = useCallback(() => {
    setSelectedExecutionResponse(null);
  }, []);

  const executionResponsePretty = useMemo(() => {
    if (!selectedExecutionResponse) return "—";
    return JSON.stringify(selectedExecutionResponse, null, 2);
  }, [selectedExecutionResponse]);

  return {
    strategy,
    runtime,
    signals,
    isLoading,
    errorMessage,
    reload: load,
    toggleStatus,
    copyText,
    selectedSignal,
    openSignalDetails,
    closeSignalDetails,
    selectedExecutionResponse,
    openExecutionResponse,
    closeExecutionResponse,
    executionResponsePretty,
  };
}