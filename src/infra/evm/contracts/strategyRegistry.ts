import { Contract } from "ethers";
import { getReadProvider } from "@/infra/evm/provider";
import { StrategyRegistryAbi } from "@/infra/evm/abis/strategyRegistry.abi";
import { getCachedContractRegistry, loadContractRegistry } from "@/infra/api-lp/contractRegistry";
import { getActiveChainRuntime } from "@/shared/config/chainRuntime";

function assertRegistryHasStrategyFactory(reg: any) {
  if (!reg?.data?.strategy_factory?.address) {
    throw new Error("Assert strategy registry: Contract strategy registry not loaded: strategy_factory.address");
  }
}

export async function getStrategyRegistryRead() {
  const rt = await getActiveChainRuntime();

  // try cache first
  let reg = getCachedContractRegistry(rt.chainKey);

  // if not present, lazy-load (no need for page reload / server restart)
  if (!reg) {
    reg = await loadContractRegistry(rt.chainKey);
  }

  assertRegistryHasStrategyFactory(reg);

  return new Contract(reg.data.strategy_factory.address, StrategyRegistryAbi, await getReadProvider());
}
