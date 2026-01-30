import { getStrategyRegistryRead } from "@/infra/evm/contracts/strategyRegistry";

export async function checkStrategyAllowlistUseCase(params: {
  adapter?: string;
  router?: string;
}) {
  const reg = await getStrategyRegistryRead();

  const out: any = {};
  if (params.adapter) out.adapterAllowed = await reg.allowedAdapters(params.adapter.trim());
  if (params.router) out.routerAllowed = await reg.allowedRouters(params.router.trim());
  return out;
}
