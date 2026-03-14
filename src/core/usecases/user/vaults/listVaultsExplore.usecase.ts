import {
  listVaultsExploreApi,
  type ListVaultsExploreApiResponse,
} from "@/core/infra/api/api-lp/vaultExplore";

export async function listVaultsExploreUseCase(params?: {
  accessToken?: string;
  owner?: string;
  chain?: string;
  dex?: string;
  query?: string;
  limit?: number;
  offset?: number;
  activeOnly?: boolean;
}): Promise<ListVaultsExploreApiResponse> {
  return listVaultsExploreApi(params);
}