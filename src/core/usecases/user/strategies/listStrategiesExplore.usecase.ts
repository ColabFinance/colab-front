import { apiSignalsExploreStrategies } from "@/core/infra/api/api-signals/strategy";

export type ExploreStrategyRow = {
  id: string;
  strategyId: number;
  name: string;
  symbol: string;
  indicatorSetId: string;
  chain: "base" | "bnb";
  owner?: string;
  status: "ACTIVE" | "INACTIVE";
  isPublic: boolean;
  alias?: string | null;
  dex?: string | null;
  updatedAt?: number | null;
  updatedAtIso?: string | null;
};

export async function listStrategiesExploreUseCase(params?: {
  accessToken?: string;
  query?: {
    chain?: "base" | "bnb";
    status?: "ACTIVE" | "INACTIVE";
    limit?: number;
    offset?: number;
  };
}): Promise<ExploreStrategyRow[]> {
  const res = await apiSignalsExploreStrategies({
    accessToken: params?.accessToken,
    query: params?.query,
  });

  const rows = res?.data || [];

  return (rows || [])
    .map((r) => {
      const strategyId = Number(r?.strategy_id || 0);
      const chain = String(r?.chain || "").toLowerCase();
      const status = String(r?.status || "").toUpperCase() === "ACTIVE" ? "ACTIVE" : "INACTIVE";

      if (!["base", "bnb"].includes(chain)) {
        return null;
      }

      return {
        id: String(r?.id || `${chain}:${String(r?.owner || "").toLowerCase()}:${strategyId}`),
        strategyId,
        name: String(r?.name || ""),
        symbol: String(r?.symbol || ""),
        indicatorSetId: String(r?.indicator_set_id || ""),
        chain: chain as "base" | "bnb",
        owner: r?.owner ? String(r.owner).toLowerCase() : undefined,
        status,
        isPublic: Boolean(r?.is_public),
        alias: r?.alias ? String(r.alias) : null,
        dex: r?.dex ? String(r.dex) : null,
        updatedAt: typeof r?.updated_at === "number" ? r.updated_at : null,
        updatedAtIso: r?.updated_at_iso ? String(r.updated_at_iso) : null,
      } satisfies ExploreStrategyRow;
    })
    .filter((row): row is NonNullable<typeof row> => {
      return Boolean(row && row.isPublic && Number.isFinite(row.strategyId) && row.strategyId > 0);
    })
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}