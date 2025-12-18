import { Contract } from "ethers";
import { CONFIG } from "@/shared/config/env";
import { getReadProvider } from "@/infra/evm/provider";
import { StrategyRegistryAbi } from "@/infra/evm/abis/strategyRegistry.abi";

export function getStrategyRegistryRead() {
  return new Contract(CONFIG.contracts.strategyRegistry, StrategyRegistryAbi, getReadProvider());
}
