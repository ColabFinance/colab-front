import { Contract } from "ethers";
import { getReadProvider } from "@/infra/evm/provider";
import { VaultFactoryAbi } from "@/infra/evm/abis/vaultFactory.abi";
import { getCachedContractRegistry, loadContractRegistry } from "@/infra/api-lp/contractRegistry";
import { getActiveChainRuntime } from "@/shared/config/chainRuntime";

function assertRegistryHasVaultFactory(reg: any) {
  if (!reg?.data?.vault_factory?.address) {
    throw new Error("Assert vault factory: Contract not loaded: vault_factory.address");
  }
}

export async function getVaultFactoryRead() {
  const rt = await getActiveChainRuntime();

  let reg = getCachedContractRegistry(rt.chainKey);
  if (!reg) {
    reg = await loadContractRegistry(rt.chainKey);
  }

  assertRegistryHasVaultFactory(reg);

  return new Contract(reg.data.vault_factory.address, VaultFactoryAbi, await getReadProvider());
}
