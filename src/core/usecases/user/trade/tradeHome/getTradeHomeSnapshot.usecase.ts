import { listExecutionProfilesUseCase } from "@/core/usecases/user/trade/executionProfiles/listExecutionProfiles.usecase";
import { listActiveTradePositionsUseCase } from "@/core/usecases/user/trade/positions/listActiveTradePositions.usecase";
import { getLatestTradeStrategyRuntimeUseCase } from "@/core/usecases/user/trade/runtime/getLatestTradeStrategyRuntime.usecase";
import { listTradeSignalsUseCase } from "@/core/usecases/user/trade/signals/listTradeSignals.usecase";
import { listTradeStrategiesUseCase } from "@/core/usecases/user/trade/strategies/listTradeStrategies.usecase";

export type TradeHomeKpis = {
  totalTradeStrategies: number;
  activeTradeStrategies: number;
  activePositions: number;
  pendingSignals: number;
  failedSignals: number;
  enabledExecutionProfiles: number;
};

export type TradeHomeStrategyItem = {
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

export type TradeHomeRuntimeItem = {
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

export type TradeHomePositionItem = {
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

export type TradeHomeSignalItem = {
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

export type TradeHomeWarningItem = {
  id: string;
  tone: "red" | "orange" | "yellow" | "blue";
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
};

export type TradeHomeSnapshot = {
  accounts: string[];
  statusOptions: string[];
  kpis: TradeHomeKpis;
  strategies: TradeHomeStrategyItem[];
  runtimeHighlights: TradeHomeRuntimeItem[];
  activePositions: TradeHomePositionItem[];
  signals: TradeHomeSignalItem[];
  warnings: TradeHomeWarningItem[];
};

function normalizeUpper(value?: string | null) {
  return String(value || "").trim().toUpperCase();
}

function normalizeLower(value?: string | null) {
  return String(value || "").trim().toLowerCase();
}

function parseDate(params: {
  iso?: string | null;
  timestamp?: number | null;
}): Date | null {
  if (params.iso) {
    const parsed = new Date(params.iso);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  if (typeof params.timestamp === "number" && Number.isFinite(params.timestamp) && params.timestamp > 0) {
    const normalizedMs = params.timestamp > 1_000_000_000_000 ? params.timestamp : params.timestamp * 1000;
    const parsed = new Date(normalizedMs);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  return null;
}

function relativeTimeLabel(params: {
  iso?: string | null;
  timestamp?: number | null;
}): string {
  const date = parseDate(params);
  if (!date) return "-";

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks}w ago`;
}

function formatMoney(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatQuantity(value?: number | null, symbol?: string | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  const base = String(symbol || "").split("/")[0] || String(symbol || "");
  return `${value} ${base}`.trim();
}

function formatPercentFromRatio(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  return `${value.toFixed(2)}%`;
}

function keyAccountSymbol(executionAccountId?: string | null, symbol?: string | null) {
  return `${normalizeLower(executionAccountId)}::${normalizeUpper(symbol)}`;
}

function deriveRuntimeState(params: {
  positionSide?: string | null;
  setupArmed?: number | null;
}): string {
  const positionSide = normalizeUpper(params.positionSide);
  const setupArmed = Number(params.setupArmed || 0);

  if (positionSide === "LONG" || positionSide === "SHORT") return "in_position";
  if (setupArmed === 1) return "waiting_setup";
  return "flat";
}

function isActiveStrategyStatus(status: string) {
  return normalizeUpper(status) === "ACTIVE";
}

function isFailedSignalStatus(status: string) {
  return normalizeUpper(status) === "FAILED";
}

function isPendingSignalStatus(status: string) {
  return normalizeUpper(status) === "PENDING";
}

function buildTradeMonitorHref(strategyId: string, symbol?: string | null) {
  const qs = new URLSearchParams();
  qs.set("strategyId", strategyId);
  if (symbol) qs.set("symbol", symbol);
  return `/trade/monitor?${qs.toString()}`;
}

function buildTradeStrategyDetailsHref(strategyId: string) {
  return `/trade/strategies?strategyId=${encodeURIComponent(strategyId)}`;
}

function buildTradePositionsHref(params: {
  strategyId?: string;
  positionId?: string;
  signalId?: string;
  filter?: string;
}) {
  const qs = new URLSearchParams();

  if (params.strategyId) qs.set("strategyId", params.strategyId);
  if (params.positionId) qs.set("positionId", params.positionId);
  if (params.signalId) qs.set("signalId", params.signalId);
  if (params.filter) qs.set("filter", params.filter);

  return `/trade/positions-orders?${qs.toString()}`;
}

export async function getTradeHomeSnapshotUseCase(params?: {
  accessToken?: string;
}): Promise<TradeHomeSnapshot> {
  const [strategiesRes, signalsRes, positionsRes, profilesRes] = await Promise.all([
    listTradeStrategiesUseCase({
      accessToken: params?.accessToken,
      query: { limit: 500 },
    }),
    listTradeSignalsUseCase({
      accessToken: params?.accessToken,
      query: { limit: 500 },
    }),
    listActiveTradePositionsUseCase({
      accessToken: params?.accessToken,
    }),
    listExecutionProfilesUseCase({
      accessToken: params?.accessToken,
    }),
  ]);

  const strategiesRaw = strategiesRes.data || [];
  const signalsRaw = signalsRes.data || [];
  const positionsRaw = positionsRes.data || [];
  const profilesRaw = profilesRes.data || [];

  const runtimePairs = await Promise.all(
    strategiesRaw.map(async (strategy) => {
      try {
        const runtimeRes = await getLatestTradeStrategyRuntimeUseCase({
          accessToken: params?.accessToken,
          strategyId: String(strategy.id || ""),
        });

        return [String(strategy.id || ""), runtimeRes.data || null] as const;
      } catch {
        return [String(strategy.id || ""), null] as const;
      }
    })
  );

  const runtimeMap = new Map(runtimePairs);

  const profilesMap = new Map(
    profilesRaw.map((profile) => [
      keyAccountSymbol(profile.execution_account_id, profile.symbol),
      profile,
    ])
  );

  const accounts = Array.from(
    new Set(
      strategiesRaw
        .map((item) => String(item.execution_account_id || "").trim())
        .filter(Boolean)
    )
  ).sort();

  const statusOptions = Array.from(
    new Set(
      strategiesRaw
        .map((item) => normalizeUpper(item.status))
        .filter(Boolean)
    )
  ).sort();

  const strategies = strategiesRaw
    .map((item) => {
      const strategyId = String(item.id || "").trim();
      if (!strategyId) return null;

      return {
        id: strategyId,
        name: String(item.name || ""),
        symbol: String(item.symbol || ""),
        streamKey: String(item.stream_key || ""),
        strategyType: String(item.strategy_type || ""),
        executionAccount: item.execution_account_id ? String(item.execution_account_id) : null,
        status: normalizeUpper(item.status),
        updatedAtLabel: relativeTimeLabel({
          iso: item.updated_at_iso,
          timestamp: item.updated_at,
        }),
        detailsHref: buildTradeStrategyDetailsHref(strategyId),
        monitorHref: buildTradeMonitorHref(strategyId, item.symbol),
      } satisfies TradeHomeStrategyItem;
    })
    .filter((item): item is TradeHomeStrategyItem => Boolean(item))
    .sort((a, b) => a.name.localeCompare(b.name));

  const runtimeHighlights = strategiesRaw
    .map((strategy) => {
      const strategyId = String(strategy.id || "").trim();
      if (!strategyId) return null;

      const runtime = runtimeMap.get(strategyId);
      if (!runtime) return null;

      return {
        strategyId,
        symbol: String(runtime.symbol || strategy.symbol || ""),
        runtimeState: deriveRuntimeState({
          positionSide: runtime.position_side,
          setupArmed: runtime.setup_armed,
        }),
        event: String(runtime.event || "none"),
        atr: String(runtime.atr ?? "-"),
        atrPct: formatPercentFromRatio(runtime.atr_pct),
        setupArmed: Number(runtime.setup_armed || 0) === 1,
        desiredSide: String(runtime.desired_side || "none").toLowerCase(),
        positionSide: String(runtime.position_side || "none").toLowerCase(),
        barsSinceEvent: "-",
        updatedAtLabel: relativeTimeLabel({
          iso: runtime.updated_at_iso || runtime.created_at_iso,
          timestamp: runtime.updated_at || runtime.close_time,
        }),
        detailsHref: buildTradeStrategyDetailsHref(strategyId),
        monitorHref: buildTradeMonitorHref(strategyId, runtime.symbol || strategy.symbol),
      } satisfies TradeHomeRuntimeItem;
    })
    .filter((item): item is TradeHomeRuntimeItem => Boolean(item))
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  const activePositions = positionsRaw
    .map((item) => {
      const positionId = String(item.id || "").trim();
      const strategyId = String(item.strategy_id || "").trim();
      if (!positionId || !strategyId) return null;

      return {
        id: positionId,
        symbol: String(item.symbol || ""),
        strategyId,
        executionAccount: item.execution_account_id ? String(item.execution_account_id) : null,
        positionSide: String(item.position_side || "").toLowerCase(),
        status: normalizeUpper(item.status),
        quantity: formatQuantity(item.quantity, item.symbol),
        entryPrice: formatMoney(item.entry_price),
        openedAt: String(item.opened_at_iso || "-"),
        detailsHref: buildTradePositionsHref({
          positionId,
          strategyId,
        }),
        monitorHref: buildTradeMonitorHref(strategyId, item.symbol),
      } satisfies TradeHomePositionItem;
    })
    .filter((item): item is TradeHomePositionItem => Boolean(item))
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  const signals = signalsRaw
    .map((item) => {
      const signalId = String(item.id || "").trim();
      const strategyId = String(item.strategy_id || "").trim();
      if (!signalId || !strategyId) return null;

      return {
        id: signalId,
        strategyId,
        symbol: String(item.symbol || ""),
        signalType: String(item.signal_type || ""),
        status: normalizeUpper(item.status),
        timestamp: String(item.created_at_iso || relativeTimeLabel({ timestamp: item.ts })),
        attempts: "-",
        lastError: normalizeUpper(item.status) === "FAILED" ? "Not exposed by API" : "-",
        detailsHref: buildTradePositionsHref({
          signalId,
          strategyId,
        }),
        monitorHref: buildTradeMonitorHref(strategyId, item.symbol),
      } satisfies TradeHomeSignalItem;
    })
    .filter((item): item is TradeHomeSignalItem => Boolean(item))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const activeStrategiesWithoutExecutionAccount = strategiesRaw.filter(
    (item) => isActiveStrategyStatus(item.status) && !String(item.execution_account_id || "").trim()
  ).length;

  const activeStrategiesWithDisabledProfile = strategiesRaw.filter((item) => {
    if (!isActiveStrategyStatus(item.status)) return false;
    if (!String(item.execution_account_id || "").trim()) return false;

    const profile = profilesMap.get(
      keyAccountSymbol(item.execution_account_id, item.symbol)
    );

    return Boolean(profile && profile.is_enabled === false);
  }).length;

  const failedSignalsCount = signalsRaw.filter((item) => isFailedSignalStatus(item.status)).length;

  const staleRuntimeCount = strategiesRaw.filter((item) => {
    if (!isActiveStrategyStatus(item.status)) return false;

    const runtime = runtimeMap.get(String(item.id || ""));
    if (!runtime) return true;

    const date = parseDate({
      iso: runtime.updated_at_iso || runtime.created_at_iso,
      timestamp: runtime.updated_at || runtime.close_time,
    });

    if (!date) return true;

    return Date.now() - date.getTime() > 10 * 60 * 1000;
  }).length;

  const warnings: TradeHomeWarningItem[] = [];

  if (failedSignalsCount > 0) {
    warnings.push({
      id: "failed-signals",
      tone: "red",
      title: `${failedSignalsCount} Failed Signals Detected`,
      description:
        "Recent signals have failed execution. Review execution profiles and account balances.",
      href: buildTradePositionsHref({ filter: "failed-signals" }),
      ctaLabel: "View Failed Signals",
    });
  }

  if (activeStrategiesWithoutExecutionAccount > 0) {
    warnings.push({
      id: "missing-execution-account",
      tone: "orange",
      title: `${activeStrategiesWithoutExecutionAccount} Strategies Without Execution Account`,
      description:
        "Some active strategies are not linked to an execution account and cannot place orders.",
      href: `/trade/strategies?filter=missing-execution-account`,
      ctaLabel: "Review Strategies",
    });
  }

  if (activeStrategiesWithDisabledProfile > 0) {
    warnings.push({
      id: "disabled-execution-profile",
      tone: "yellow",
      title: `${activeStrategiesWithDisabledProfile} Execution Profiles Disabled`,
      description:
        "An execution profile used by active strategies is currently disabled.",
      href: `/trade/execution-profiles?filter=disabled`,
      ctaLabel: "View Execution Profiles",
    });
  }

  if (staleRuntimeCount > 0) {
    warnings.push({
      id: "stale-runtime",
      tone: "blue",
      title: `${staleRuntimeCount} Strategies With No Recent Runtime Updates`,
      description:
        "Active strategies have not reported runtime state in over 10 minutes. Check market stream connectivity.",
      href: `/trade/monitor?filter=stale-runtime`,
      ctaLabel: "Check Strategies",
    });
  }

  return {
    accounts,
    statusOptions,
    kpis: {
      totalTradeStrategies: strategiesRaw.length,
      activeTradeStrategies: strategiesRaw.filter((item) => isActiveStrategyStatus(item.status)).length,
      activePositions: positionsRaw.length,
      pendingSignals: signalsRaw.filter((item) => isPendingSignalStatus(item.status)).length,
      failedSignals: failedSignalsCount,
      enabledExecutionProfiles: profilesRaw.filter((item) => item.is_enabled).length,
    },
    strategies,
    runtimeHighlights,
    activePositions,
    signals,
    warnings,
  };
}