"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createTradeStrategyUseCase } from "@/core/usecases/user/trade/strategies/createTradeStrategy.usecase";
import { listTradeStrategiesPublicUseCase } from "@/core/usecases/user/trade/strategies/listTradeStrategiesPublic.usecase";
import { setTradeStrategyStatusUseCase } from "@/core/usecases/user/trade/strategies/setTradeStrategyStatus.usecase";
import type {
  CreateTradeStrategyFormState,
  TradeStrategiesFilterOptions,
  TradeStrategiesFiltersState,
  TradeStrategiesKpis,
  TradeStrategiesPaginationState,
  TradeStrategyRow,
} from "./types";

const DEFAULT_FILTERS: TradeStrategiesFiltersState = {
  status: "",
  streamKey: "",
  symbol: "",
  executionAccountId: "",
  search: "",
  limit: 20,
  page: 1,
};

const DEFAULT_FORM: CreateTradeStrategyFormState = {
  name: "",
  symbol: "",
  source: "binance",
  interval: "1m",
  streamKey: "",
  strategyType: "atr_two_stage",
  status: "ACTIVE",
  executionTarget: "api_trade_execution",
  executionAccountId: "",
  atrWindow: "14",
  atrLowThreshold: "",
  atrHighThreshold: "",
  atrThresholdMode: "atr_pct",
  cooloffBars: "1",
  tradeMode: "flip",
  reverseSignal: false,
  allowedWeekdays: "",
  maxLossPct: "",
};

const EMPTY_KPIS: TradeStrategiesKpis = {
  total: 0,
  active: 0,
  inactive: 0,
  uniqueStreamKeys: 0,
  uniqueExecutionAccounts: 0,
};

const EMPTY_FILTER_OPTIONS: TradeStrategiesFilterOptions = {
  statuses: [],
  streamKeys: [],
  symbols: [],
  executionAccountIds: [],
};

const EMPTY_PAGINATION: TradeStrategiesPaginationState = {
  limit: 20,
  offset: 0,
  page: 1,
  total: 0,
  hasNext: false,
  hasPrev: false,
};

function normalizeRows(data?: any[]): TradeStrategyRow[] {
  return (data || []).map((item) => ({
    id: String(item.id || ""),
    name: String(item.name || ""),
    symbol: String(item.symbol || ""),
    source: String(item.source || ""),
    interval: String(item.interval || ""),
    streamKey: String(item.stream_key || ""),
    strategyType: String(item.strategy_type || ""),
    executionTarget: String(item.execution_target || ""),
    executionAccountId: item.execution_account_id ? String(item.execution_account_id) : null,
    status: String(item.status || ""),
    updatedAtIso: String(item.updated_at_iso || item.created_at_iso || "-"),
  }));
}

function splitAllowedWeekdays(value: string): string[] | null {
  const items = String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length ? items : null;
}

export function useTradeStrategiesPage() {
  const [filters, setFilters] = useState<TradeStrategiesFiltersState>(DEFAULT_FILTERS);
  const [rows, setRows] = useState<TradeStrategyRow[]>([]);
  const [kpis, setKpis] = useState<TradeStrategiesKpis>(EMPTY_KPIS);
  const [filterOptions, setFilterOptions] = useState<TradeStrategiesFilterOptions>(EMPTY_FILTER_OPTIONS);
  const [pagination, setPagination] = useState<TradeStrategiesPaginationState>(EMPTY_PAGINATION);
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState("just now");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [form, setForm] = useState<CreateTradeStrategyFormState>(DEFAULT_FORM);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await listTradeStrategiesPublicUseCase({
        query: {
          status: filters.status || undefined,
          stream_key: filters.streamKey || undefined,
          symbol: filters.symbol || undefined,
          execution_account_id: filters.executionAccountId || undefined,
          search: filters.search || undefined,
          limit: filters.limit,
          page: filters.page,
        },
      });

      setRows(normalizeRows(response.data));
      setKpis({
        total: Number(response.summary?.total || 0),
        active: Number(response.summary?.active || 0),
        inactive: Number(response.summary?.inactive || 0),
        uniqueStreamKeys: Number(response.summary?.unique_stream_keys || 0),
        uniqueExecutionAccounts: Number(response.summary?.unique_execution_accounts || 0),
      });
      setFilterOptions({
        statuses: response.filter_options?.statuses || [],
        streamKeys: response.filter_options?.stream_keys || [],
        symbols: response.filter_options?.symbols || [],
        executionAccountIds: response.filter_options?.execution_account_ids || [],
      });
      setPagination({
        limit: Number(response.pagination?.limit || filters.limit),
        offset: Number(response.pagination?.offset || 0),
        page: Number(response.pagination?.page || filters.page),
        total: Number(response.pagination?.total || 0),
        hasNext: Boolean(response.pagination?.has_next),
        hasPrev: Boolean(response.pagination?.has_prev),
      });
      setLastUpdatedLabel("just now");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load trade strategies.");
      setRows([]);
      setKpis(EMPTY_KPIS);
      setFilterOptions(EMPTY_FILTER_OPTIONS);
      setPagination(EMPTY_PAGINATION);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const updateFilter = useCallback(
    (name: keyof TradeStrategiesFiltersState, value: string | number) => {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
        page: name === "page" ? Number(value) : 1,
      }));
    },
    []
  );

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  const openCreateDrawer = useCallback(() => {
    setIsCreateDrawerOpen(true);
  }, []);

  const closeCreateDrawer = useCallback(() => {
    setIsCreateDrawerOpen(false);
  }, []);

  const updateForm = useCallback(
    (name: keyof CreateTradeStrategyFormState, value: string | boolean) => {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setForm(DEFAULT_FORM);
  }, []);

  const submitCreate = useCallback(async () => {
    try {
      setIsSubmittingCreate(true);
      setErrorMessage("");

      await createTradeStrategyUseCase({
        body: {
          name: form.name.trim(),
          symbol: form.symbol.trim().toUpperCase(),
          source: form.source.trim().toLowerCase(),
          interval: form.interval.trim().toLowerCase(),
          stream_key: form.streamKey.trim().toLowerCase(),
          strategy_type: form.strategyType,
          status: form.status,
          execution_target: form.executionTarget,
          execution_account_id: form.executionAccountId.trim() || null,
          params: {
            atr_window: Number(form.atrWindow),
            atr_low_threshold: Number(form.atrLowThreshold),
            atr_high_threshold: Number(form.atrHighThreshold),
            atr_threshold_mode: form.atrThresholdMode,
            cooloff_bars: Number(form.cooloffBars),
            trade_mode: form.tradeMode,
            reverse_signal: Boolean(form.reverseSignal),
            allowed_weekdays: splitAllowedWeekdays(form.allowedWeekdays),
            max_loss_pct: form.maxLossPct.trim() ? Number(form.maxLossPct) : null,
          },
        },
      });

      resetForm();
      closeCreateDrawer();
      await load();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create trade strategy.");
    } finally {
      setIsSubmittingCreate(false);
    }
  }, [closeCreateDrawer, form, load, resetForm]);

  const toggleStatus = useCallback(
    async (row: TradeStrategyRow) => {
      try {
        setErrorMessage("");

        await setTradeStrategyStatusUseCase({
          body: {
            strategy_id: row.id,
            status: row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
          },
        });

        await load();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to update trade strategy status.");
      }
    },
    [load]
  );

  const totalPages = useMemo(() => {
    if (!pagination.total || !pagination.limit) return 1;
    return Math.max(1, Math.ceil(pagination.total / pagination.limit));
  }, [pagination.limit, pagination.total]);

  return {
    rows,
    kpis,
    filterOptions,
    filters,
    pagination,
    totalPages,
    lastUpdatedLabel,
    isLoading,
    errorMessage,
    refresh,
    updateFilter,
    isCreateDrawerOpen,
    openCreateDrawer,
    closeCreateDrawer,
    form,
    updateForm,
    submitCreate,
    isSubmittingCreate,
    toggleStatus,
  };
}