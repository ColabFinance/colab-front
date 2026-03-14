import { apiLpGet } from "@/core/infra/api/api-lp/client";

export type VaultExploreApiItem = {
  id: string;
  alias?: string | null;
  name: string;
  address: string;
  owner?: string | null;
  strategy_id?: number | null;

  chain: string;
  dex: string;

  pool?: string | null;
  adapter?: string | null;
  gauge?: string | null;

  token0_address?: string | null;
  token1_address?: string | null;

  token0_symbol?: string | null;
  token1_symbol?: string | null;

  pool_name?: string | null;
  fee_bps?: string | null;

  has_gauge: boolean;
  is_active: boolean;
  is_mine: boolean;

  pair_type: "stable" | "volatile";
  status: "active" | "paused" | "deprecated";

  tvl_usd?: number | null;
  tvl_change_24h_pct?: number | null;
  apr_pct?: number | null;
  apy_pct?: number | null;
  range_status?: "inside" | "below" | "above" | null;
  my_position_usd?: number | null;
};

export type ListVaultsExploreApiResponse = {
  ok: boolean;
  message?: string;
  data?: VaultExploreApiItem[];
};

export async function listVaultsExploreApi(params?: {
  accessToken?: string;
  owner?: string;
  chain?: string;
  dex?: string;
  query?: string;
  limit?: number;
  offset?: number;
  activeOnly?: boolean;
}): Promise<ListVaultsExploreApiResponse> {
  const qs = new URLSearchParams();

  if (params?.owner) qs.set("owner", params.owner);
  if (params?.chain) qs.set("chain", params.chain);
  if (params?.dex) qs.set("dex", params.dex);
  if (params?.query) qs.set("q", params.query);
  if (typeof params?.limit === "number") qs.set("limit", String(params.limit));
  if (typeof params?.offset === "number") qs.set("offset", String(params.offset));
  if (typeof params?.activeOnly === "boolean") qs.set("active_only", String(params.activeOnly));

  const suffix = qs.toString();
  const path = suffix ? `/vaults/explore?${suffix}` : "/vaults/explore";

  return apiLpGet<ListVaultsExploreApiResponse>(path, params?.accessToken);
}