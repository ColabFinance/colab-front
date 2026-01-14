import { Strategy } from "@/domain/strategy/types";
import { getStrategyRegistryRead } from "@/infra/evm/contracts/strategyRegistry";

export async function listStrategiesOnchain(owner: string): Promise<Strategy[]> {
  const reg = await getStrategyRegistryRead();

  // get ids of the owner
  const idsBn: bigint[] = await reg.getStrategyIdsByOwner(owner);
  const ids = idsBn.map((x) => Number(x));

  const out: Strategy[] = [];

  for (const id of ids) {
    try {
      const s = await reg.getStrategy(owner, id);
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
      // ignore (shouldn't happen if ids came from contract)
    }
  }

  return out;
}
