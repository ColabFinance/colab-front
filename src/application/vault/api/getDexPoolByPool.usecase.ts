import { apiLpGet } from "@/infra/api-lp/client";

export type DexPoolByPoolOut = {
  ok: boolean;
  message?: string;
  data?: {
    pool: string;
    token0: string;
    token1: string;
    reward_token: string;
    chain?: string;
    dex?: string;
    adapter?: string | null;
    status?: string;
    created_at?: string;
  } | null;
};

export async function getPoolByPoolUseCase(pool: string): Promise<DexPoolByPoolOut> {
  return apiLpGet<DexPoolByPoolOut>(`/dexes/pools/by-pool?pool=${encodeURIComponent(pool)}`);
}
