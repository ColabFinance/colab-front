import { Contract } from "ethers";
import { getReadProvider } from "@/infra/evm/provider";
import { StrategyRegistryAbi } from "@/infra/evm/abis/strategyRegistry.abi";
import { getCachedContractRegistry, loadContractRegistry } from "@/infra/api-lp/contractRegistry";
import { getActiveChainRuntime } from "@/shared/config/chainRuntime";
import { getEvmSignerFromPrivyWallet } from "../privySigner";

function assertRegistryHasStrategyRegistry(reg: any) {
  if (!reg?.data?.strategy_factory?.address) {
    throw new Error("Assert strategy registry: Contract strategy registry not loaded: strategy_factory.address");
  }
}


async function resolveStrategyRegistryAddress(): Promise<string> {
  const rt = await getActiveChainRuntime();

  let reg = getCachedContractRegistry(rt.chainKey);
  if (!reg) reg = await loadContractRegistry(rt.chainKey);

  assertRegistryHasStrategyRegistry(reg);
  return reg.data.strategy_factory.address;
}

export async function getStrategyRegistryRead() {
  const addr = await resolveStrategyRegistryAddress();
  const provider = await getReadProvider();
  return new Contract(addr, StrategyRegistryAbi, provider);
}


export async function getStrategyRegistryWrite(activeWallet: any) {
  const addr = await resolveStrategyRegistryAddress();
  if (!activeWallet) throw new Error("Missing active wallet (Privy).");

  const signer = await getEvmSignerFromPrivyWallet(activeWallet);
  return new Contract(addr, StrategyRegistryAbi, signer);
}