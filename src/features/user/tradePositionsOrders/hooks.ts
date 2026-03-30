"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { listTradeStrategiesPublicUseCase } from "@/core/usecases/user/trade/strategies/listTradeStrategiesPublic.usecase";
import { listActiveTradePositionsUseCase } from "@/core/usecases/user/trade/positions/listActiveTradePositions.usecase";
import { listTradeOrdersUseCase } from "@/core/usecases/user/trade/positions/listTradeOrders.usecase";
import type {
  ExecutionAccountOption,
  PaginationState,
  PositionsOrdersFiltersState,
  PositionsOrdersTab,
  StrategyOption,
  TradeOrderRow,
  TradePositionRow,
} from "./types";
import { listTradeExecutionProfilesUseCase } from "@/core/usecases/user/trade/executionProfiles/listTradeExecutionProfiles.usecase";

const DEFAULT_LIMIT = 10;

const EMPTY_PAGINATION: PaginationState = {
  limit: DEFAULT_LIMIT,
  offset: 0,
  page: 1,
  total: 0,
  hasNext: false,
  hasPrev: false,
};

const DEFAULT_FILTERS: PositionsOrdersFiltersState = {
  executionAccountId: "",
  strategyId: "",
  statusScope: "OPEN",
};

function normalizePagination(input: any, fallbackLimit: number, fallbackPage: number): PaginationState {
  return {
    limit: Number(input?.limit || fallbackLimit),
    offset: Number(input?.offset || 0),
    page: Number(input?.page || fallbackPage),
    total: Number(input?.total || 0),
    hasNext: Boolean(input?.has_next),
    hasPrev: Boolean(input?.has_prev),
  };
}

function normalizePositions(data?: any[]): TradePositionRow[] {
  return (data || []).map((item) => ({
    id: String(item.id || ""),
    strategyId: String(item.strategy_id || ""),
    executionAccountId: String(item.execution_account_id || ""),
    symbol: String(item.symbol || ""),
    positionSide: String(item.position_side || ""),
    status: String(item.status || ""),
    quantity: Number(item.quantity || 0),
    entryPrice: Number(item.entry_price || 0),
    openOrderId: item.open_order_id ? String(item.open_order_id) : null,
    closeOrderId: item.close_order_id ? String(item.close_order_id) : null,
    signalOpenId: item.signal_open_id ? String(item.signal_open_id) : null,
    signalCloseId: item.signal_close_id ? String(item.signal_close_id) : null,
    openReason: item.open_reason ? String(item.open_reason) : null,
    closeReason: item.close_reason ? String(item.close_reason) : null,
    openedAt: Number(item.opened_at || 0),
    openedAtIso: item.opened_at_iso ? String(item.opened_at_iso) : null,
    closedAt: item.closed_at === null || item.closed_at === undefined ? null : Number(item.closed_at),
    closedAtIso: item.closed_at_iso ? String(item.closed_at_iso) : null,
    exitPrice: item.exit_price === null || item.exit_price === undefined ? null : Number(item.exit_price),
    createdAtIso: item.created_at_iso ? String(item.created_at_iso) : null,
    updatedAtIso: item.updated_at_iso ? String(item.updated_at_iso) : null,
  }));
}

function normalizeOrders(data?: any[]): TradeOrderRow[] {
  return (data || []).map((item) => ({
    id: String(item.id || ""),
    action: String(item.action || ""),
    idempotencyKey: String(item.idempotency_key || ""),
    strategyId: String(item.strategy_id || ""),
    executionAccountId: String(item.execution_account_id || ""),
    symbol: String(item.symbol || ""),
    positionSide: String(item.position_side || ""),
    side: String(item.side || ""),
    quantity: Number(item.quantity || 0),
    signalId: item.signal_id ? String(item.signal_id) : null,
    signalTs: item.signal_ts === null || item.signal_ts === undefined ? null : Number(item.signal_ts),
    binanceOrderId: item.binance_order_id ? String(item.binance_order_id) : null,
    status: String(item.status || ""),
    rawResponse:
      item.raw_response && typeof item.raw_response === "object"
        ? (item.raw_response as Record<string, unknown>)
        : null,
    createdAtIso: item.created_at_iso ? String(item.created_at_iso) : null,
    updatedAtIso: item.updated_at_iso ? String(item.updated_at_iso) : null,
  }));
}

function normalizeStrategyOptions(data?: any[]): StrategyOption[] {
  return (data || [])
    .filter((item) => item?.id)
    .map((item) => ({
      value: String(item.id),
      name: String(item.name || ""),
      label: `${String(item.id)} - ${String(item.name || "")}`,
    }));
}

function buildExecutionAccountOptions(
  profiles?: any[],
  positions?: TradePositionRow[],
  orders?: TradeOrderRow[]
): ExecutionAccountOption[] {
  const unique = new Set<string>();

  for (const item of profiles || []) {
    if (item?.execution_account_id) unique.add(String(item.execution_account_id));
  }

  for (const item of positions || []) {
    if (item.executionAccountId) unique.add(item.executionAccountId);
  }

  for (const item of orders || []) {
    if (item.executionAccountId) unique.add(item.executionAccountId);
  }

  return Array.from(unique)
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({
      value,
      label: value,
    }));
}

export function useTradePositionsOrdersPage() {
  const [activeTab, setActiveTab] = useState<PositionsOrdersTab>("positions");
  const [draftFilters, setDraftFilters] = useState<PositionsOrdersFiltersState>(DEFAULT_FILTERS);
  const [filters, setFilters] = useState<PositionsOrdersFiltersState>(DEFAULT_FILTERS);

  const [positionsPage, setPositionsPageState] = useState(1);
  const [positionsLimit, setPositionsLimitState] = useState(DEFAULT_LIMIT);

  const [ordersPage, setOrdersPageState] = useState(1);
  const [ordersLimit, setOrdersLimitState] = useState(DEFAULT_LIMIT);

  const [positions, setPositions] = useState<TradePositionRow[]>([]);
  const [orders, setOrders] = useState<TradeOrderRow[]>([]);
  const [positionsPagination, setPositionsPagination] = useState<PaginationState>(EMPTY_PAGINATION);
  const [ordersPagination, setOrdersPagination] = useState<PaginationState>(EMPTY_PAGINATION);

  const [executionAccountOptions, setExecutionAccountOptions] = useState<ExecutionAccountOption[]>([]);
  const [strategyOptions, setStrategyOptions] = useState<StrategyOption[]>([]);

  const [selectedPosition, setSelectedPosition] = useState<TradePositionRow | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<TradeOrderRow | null>(null);
  const [selectedRawResponse, setSelectedRawResponse] = useState<Record<string, unknown> | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [profilesResponse, strategiesResponse, positionsResponse, ordersResponse] = await Promise.all([
        listTradeExecutionProfilesUseCase(),
        listTradeStrategiesPublicUseCase({
          query: {
            limit: 1000,
            page: 1,
          },
        }),
        listActiveTradePositionsUseCase({
          query: {
            execution_account_id: filters.executionAccountId || undefined,
            status_scope: filters.statusScope,
            limit: positionsLimit,
            page: positionsPage,
          },
        }),
        listTradeOrdersUseCase({
          query: {
            strategy_id: filters.strategyId || undefined,
            execution_account_id: filters.executionAccountId || undefined,
            lifecycle_scope: filters.statusScope,
            limit: ordersLimit,
            page: ordersPage,
          },
        }),
      ]);

      const normalizedPositions = normalizePositions(positionsResponse.data);
      const normalizedOrders = normalizeOrders(ordersResponse.data);

      setPositions(normalizedPositions);
      setOrders(normalizedOrders);

      setPositionsPagination(
        normalizePagination(positionsResponse.pagination, positionsLimit, positionsPage)
      );

      setOrdersPagination(
        normalizePagination(ordersResponse.pagination, ordersLimit, ordersPage)
      );

      setStrategyOptions(normalizeStrategyOptions(strategiesResponse.data));
      setExecutionAccountOptions(
        buildExecutionAccountOptions(profilesResponse.data, normalizedPositions, normalizedOrders)
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load positions and orders.");
      setPositions([]);
      setOrders([]);
      setPositionsPagination({
        ...EMPTY_PAGINATION,
        limit: positionsLimit,
        page: positionsPage,
      });
      setOrdersPagination({
        ...EMPTY_PAGINATION,
        limit: ordersLimit,
        page: ordersPage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, positionsLimit, positionsPage, ordersLimit, ordersPage, refreshToken]);

  useEffect(() => {
    load();
  }, [load]);

  const updateDraftFilter = useCallback(
    (name: keyof PositionsOrdersFiltersState, value: string) => {
      setDraftFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const applyFilters = useCallback(() => {
    setPositionsPageState(1);
    setOrdersPageState(1);
    setFilters({ ...draftFilters });
  }, [draftFilters]);

  const refresh = useCallback(() => {
    setRefreshToken((prev) => prev + 1);
  }, []);

  const setPositionsPage = useCallback((page: number) => {
    setPositionsPageState(Math.max(1, page));
  }, []);

  const setOrdersPage = useCallback((page: number) => {
    setOrdersPageState(Math.max(1, page));
  }, []);

  const setPositionsLimit = useCallback((limit: number) => {
    setPositionsLimitState(limit);
    setPositionsPageState(1);
  }, []);

  const setOrdersLimit = useCallback((limit: number) => {
    setOrdersLimitState(limit);
    setOrdersPageState(1);
  }, []);

  const copyText = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      //
    }
  }, []);

  const openPositionDetails = useCallback((position: TradePositionRow) => {
    setSelectedPosition(position);
  }, []);

  const closePositionDetails = useCallback(() => {
    setSelectedPosition(null);
  }, []);

  const openOrderDetails = useCallback((order: TradeOrderRow) => {
    setSelectedOrder(order);
  }, []);

  const closeOrderDetails = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  const openRawResponse = useCallback((payload: Record<string, unknown> | null) => {
    setSelectedRawResponse(payload);
  }, []);

  const closeRawResponse = useCallback(() => {
    setSelectedRawResponse(null);
  }, []);

  const openOrdersForPosition = useCallback((position: TradePositionRow) => {
    const nextFilters: PositionsOrdersFiltersState = {
      executionAccountId: position.executionAccountId,
      strategyId: position.strategyId,
      statusScope: String(position.status || "").toUpperCase() === "OPEN" ? "OPEN" : "CLOSED",
    };

    setDraftFilters(nextFilters);
    setFilters(nextFilters);
    setOrdersPageState(1);
    setActiveTab("orders");
  }, []);

  const positionsTotalPages = useMemo(() => {
    if (!positionsPagination.total || !positionsPagination.limit) return 1;
    return Math.max(1, Math.ceil(positionsPagination.total / positionsPagination.limit));
  }, [positionsPagination.limit, positionsPagination.total]);

  const ordersTotalPages = useMemo(() => {
    if (!ordersPagination.total || !ordersPagination.limit) return 1;
    return Math.max(1, Math.ceil(ordersPagination.total / ordersPagination.limit));
  }, [ordersPagination.limit, ordersPagination.total]);

  const rawResponsePretty = useMemo(() => {
    if (!selectedRawResponse) return "—";
    return JSON.stringify(selectedRawResponse, null, 2);
  }, [selectedRawResponse]);

  return {
    activeTab,
    setActiveTab,
    draftFilters,
    filters,
    updateDraftFilter,
    applyFilters,
    refresh,

    positions,
    orders,
    positionsPagination,
    ordersPagination,
    positionsTotalPages,
    ordersTotalPages,

    setPositionsPage,
    setOrdersPage,
    setPositionsLimit,
    setOrdersLimit,

    executionAccountOptions,
    strategyOptions,

    selectedPosition,
    selectedOrder,
    selectedRawResponse,
    rawResponsePretty,

    openPositionDetails,
    closePositionDetails,
    openOrderDetails,
    closeOrderDetails,
    openRawResponse,
    closeRawResponse,
    openOrdersForPosition,

    copyText,
    isLoading,
    errorMessage,
  };
}