import { listStrategiesUseCase } from "@/core/usecases/user/strategies/listStrategies.usecase";
import { getIndicatorSetUseCase } from "@/core/application/strategy/api/getIndicatorSet.usecase";
import { listDexesForStrategyUseCase } from "@/core/application/strategy/api/listDexesForStrategy.usecase";
import { listDexPoolsForStrategyUseCase } from "@/core/application/strategy/api/listDexPoolsForStrategy.usecase";
import type { StrategyListItem } from "@/core/usecases/user/strategies/listStrategies.usecase";
import type { IndicatorSetRecord } from "@/core/infra/api/api-market-data/indicatorSet";
import type { DexPoolRecord } from "@/core/infra/api/api-lp/dexRegistry";

export type MyStrategiesHydratedItem = {
  id: number;
  chainKey: "base" | "bnb";
  chainName: string;
  owner: string;

  name: string;
  symbol: string;
  status: "ACTIVE" | "INACTIVE";

  indicatorSetId: string;
  indicatorStreamKey: string;
  indicatorSource: string;
  emaFast: number;
  emaSlow: number;
  atrWindow: number;
  marketSymbol: string;

  dexKey?: string | null;
  dexName: string;
  poolPairLabel: string;
  feeLabel: string;

  token0Symbol: string;
  token1Symbol: string;

  token0Address?: string | null;
  token1Address?: string | null;
  adapterAddress?: string | null;
  dexRouterAddress?: string | null;

  vaultAlias?: string | null;
  updatedAtLabel: string;
};

function formatDexName(dex: string | null | undefined): string {
  const value = String(dex || "").trim().toLowerCase();

  if (value === "uniswap_v3") return "Uniswap V3";
  if (value === "pancake_v3") return "Pancake V3";
  if (value === "quickswap") return "QuickSwap";
  if (value === "aerodrome") return "Aerodrome";
  if (!value) return "Unknown DEX";

  return value
    .split("_")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatChainName(chain: "base" | "bnb"): string {
  return chain === "base" ? "Base" : "BNB";
}

function relativeTimeLabel(updatedAtIso?: string | null, updatedAt?: number | null): string {
  let date: Date | null = null;

  if (updatedAtIso) {
    const parsed = new Date(updatedAtIso);
    if (!Number.isNaN(parsed.getTime())) {
      date = parsed;
    }
  }

  if (!date && typeof updatedAt === "number" && updatedAt > 0) {
    const parsed = new Date(updatedAt * 1000);
    if (!Number.isNaN(parsed.getTime())) {
      date = parsed;
    }
  }

  if (!date) {
    return "-";
  }

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

function normalizeAddress(value?: string | null): string {
  return String(value || "").trim().toLowerCase();
}

function splitPair(pair?: string | null): { token0Symbol: string; token1Symbol: string } {
  const raw = String(pair || "").trim();
  if (!raw.includes("/")) {
    return { token0Symbol: "T0", token1Symbol: "T1" };
  }

  const [left, right] = raw.split("/", 2);
  return {
    token0Symbol: (left || "T0").trim().toUpperCase(),
    token1Symbol: (right || "T1").trim().toUpperCase(),
  };
}

function formatFeeLabel(pool?: DexPoolRecord | null): string {
  if (!pool) return "-";

  if (pool.fee_rate) {
    return String(pool.fee_rate);
  }

  if (typeof pool.fee_bps === "number" && Number.isFinite(pool.fee_bps) && pool.fee_bps > 0) {
    const text = `${pool.fee_bps / 10000}`.replace(/\.0+$/, "");
    return `${text}%`;
  }

  return "-";
}

async function loadPoolsForChain(params: {
  accessToken: string;
  chain: "base" | "bnb";
}): Promise<DexPoolRecord[]> {
  const dexes = await listDexesForStrategyUseCase({
    accessToken: params.accessToken,
    query: { chain: params.chain, limit: 200 },
  });

  const pools = await Promise.all(
    dexes.map(async (dex) => {
      try {
        return await listDexPoolsForStrategyUseCase({
          accessToken: params.accessToken,
          query: { chain: params.chain, dex: dex.dex, limit: 500 },
        });
      } catch {
        return [];
      }
    })
  );

  return pools.flat();
}

function matchPool(params: {
  strategy: StrategyListItem;
  chainKey: "base" | "bnb";
  pools: DexPoolRecord[];
}): DexPoolRecord | null {
  const { strategy, chainKey, pools } = params;

  const adapter = normalizeAddress(strategy.adapter);
  const dexRouter = normalizeAddress(strategy.dex_router);
  const token0 = normalizeAddress(strategy.token0);
  const token1 = normalizeAddress(strategy.token1);

  if (adapter) {
    const byAdapter = pools.find(
      (pool) =>
        String(pool.chain || "").toLowerCase() === chainKey &&
        normalizeAddress(pool.adapter) === adapter
    );
    if (byAdapter) return byAdapter;
  }

  const byAddresses = pools.find((pool) => {
    if (String(pool.chain || "").toLowerCase() !== chainKey) return false;

    const poolToken0 = normalizeAddress(pool.token0);
    const poolToken1 = normalizeAddress(pool.token1);

    const sameRouter = !dexRouter || dexRouter === normalizeAddress((pool as any).dex_router);
    const sameDirection = token0 && token1 && poolToken0 === token0 && poolToken1 === token1;
    const reverseDirection = token0 && token1 && poolToken0 === token1 && poolToken1 === token0;

    return sameRouter && (sameDirection || reverseDirection);
  });

  return byAddresses || null;
}

export async function listMyStrategiesUseCase(params: {
  accessToken: string;
  owner: string;
  chains?: Array<"base" | "bnb">;
}): Promise<MyStrategiesHydratedItem[]> {
  const chains = params.chains || ["base", "bnb"];

  const [strategyGroups, poolGroups] = await Promise.all([
    Promise.all(
      chains.map(async (chain) => {
        const res = await listStrategiesUseCase({
          accessToken: params.accessToken,
          query: {
            chain,
            owner: params.owner,
          },
        });

        return (res.data || []).map((item) => ({
          ...item,
          chain: chain,
        }));
      })
    ),
    Promise.all(
      chains.map(async (chain) => {
        const pools = await loadPoolsForChain({
          accessToken: params.accessToken,
          chain,
        });

        return pools.map((pool) => ({
          ...pool,
          chain,
        }));
      })
    ),
  ]);

  const strategies = strategyGroups.flat();
  const allPools = poolGroups.flat();

  const cfgHashes = Array.from(
    new Set(
      strategies
        .map((item) => String(item.indicator_set_id || "").trim())
        .filter(Boolean)
    )
  );

  const indicatorPairs = await Promise.all(
    cfgHashes.map(async (cfgHash) => {
      try {
        const indicator = await getIndicatorSetUseCase({
          accessToken: params.accessToken,
          cfgHash,
        });
        return [cfgHash, indicator as IndicatorSetRecord] as const;
      } catch {
        return [cfgHash, null] as const;
      }
    })
  );

  const indicatorMap = new Map<string, IndicatorSetRecord | null>(indicatorPairs);

  const items = strategies
    .map((strategy) => {
      const chainKey = String(strategy.chain || "").toLowerCase() as "base" | "bnb";
      if (chainKey !== "base" && chainKey !== "bnb") {
        return null;
      }

      const indicatorSetId = String(strategy.indicator_set_id || "").trim();
      const indicator = indicatorMap.get(indicatorSetId) || null;
      const pool = matchPool({
        strategy,
        chainKey,
        pools: allPools,
      });

      const pairLabel = String(pool?.pair || pool?.name || "").trim() || "-";
      const pairParts = splitPair(pairLabel);

      return {
        id: Number(strategy.strategy_id || 0),
        chainKey,
        chainName: formatChainName(chainKey),
        owner: String(strategy.owner || "").toLowerCase(),

        name: String(strategy.name || ""),
        symbol: String(strategy.symbol || ""),
        status: String(strategy.status || "").toUpperCase() === "ACTIVE" ? "ACTIVE" : "INACTIVE",

        indicatorSetId,
        indicatorStreamKey: String(indicator?.stream_key || strategy.stream_key || ""),
        indicatorSource: String(indicator?.source || "binance"),
        emaFast: Number(indicator?.ema_fast || 0),
        emaSlow: Number(indicator?.ema_slow || 0),
        atrWindow: Number(indicator?.atr_window || 0),
        marketSymbol: String(indicator?.symbol || `${pairParts.token0Symbol}${pairParts.token1Symbol}`),

        dexKey: String(pool?.dex || strategy.dex || "").trim() || null,
        dexName: formatDexName(String(pool?.dex || strategy.dex || "")),
        poolPairLabel: pairLabel,
        feeLabel: formatFeeLabel(pool),

        token0Symbol: pairParts.token0Symbol,
        token1Symbol: pairParts.token1Symbol,

        token0Address: strategy.token0 || pool?.token0 || null,
        token1Address: strategy.token1 || pool?.token1 || null,
        adapterAddress: strategy.adapter || pool?.adapter || null,
        dexRouterAddress: strategy.dex_router || null,

        vaultAlias: strategy.alias || null,
        updatedAtLabel: relativeTimeLabel(strategy.updated_at_iso, strategy.updated_at),
      } satisfies MyStrategiesHydratedItem;
    })
    .filter((item): item is MyStrategiesHydratedItem => {
      return Boolean(item && Number.isFinite(item.id) && item.id > 0);
    })
    .sort((a, b) => b.id - a.id);

  return items;
}