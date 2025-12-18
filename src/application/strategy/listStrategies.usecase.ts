import { Strategy } from "@/domain/strategy/types";
import { getStrategyRegistryRead } from "@/infra/evm/contracts/strategyRegistry";

export async function listStrategiesOnchain(): Promise<Strategy[]> {
  const reg = getStrategyRegistryRead();
  const nextIdBn = await reg.nextStrategyId();
  const nextId = Number(nextIdBn);

  const out: Strategy[] = [];

  // ids começam em 1
  for (let id = 1; id < nextId; id++) {
    try {
      const s = await reg.getStrategy(id);
      out.push({
        strategyId: id,
        adapter: s.adapter,
        dexRouter: s.dexRouter,
        token0: s.token0,
        token1: s.token1,
        name: s.name,
        description: s.description,
        active: s.active,
      });
    } catch {
      // ignore gaps
    }
  }

  return out;
}
