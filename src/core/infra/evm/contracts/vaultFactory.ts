import { Contract } from "ethers";
import { getReadProvider } from "@/core/infra/evm/provider";
import { VaultFactoryAbi } from "@/core/infra/evm/abis/vaultFactory.abi";
import { getCachedContractRegistry, loadContractRegistry } from "@/core/infra/api/api-lp/contractRegistry";
import { getActiveChainRuntime } from "@/shared/config/chainRuntime";
import { getEvmSignerFromPrivyWallet } from "@/core/infra/evm/privySigner";

function assertRegistryHasVaultFactory(reg: any) {
  if (!reg?.data?.vault_factory?.address) {
    throw new Error("Assert VF: Contract not loaded: data.vault_factory.address");
  }
}

async function resolveVaultFactoryAddress(): Promise<string> {
  const rt = await getActiveChainRuntime();

  let reg = getCachedContractRegistry(rt.chainKey);
  if (!reg) reg = await loadContractRegistry(rt.chainKey);

  assertRegistryHasVaultFactory(reg);
  return reg.data.vault_factory.address;
}

export async function getVaultFactoryRead() {
  const addr = await resolveVaultFactoryAddress();
  const provider = await getReadProvider();
  return new Contract(addr, VaultFactoryAbi, provider);
}

export async function getVaultFactoryWrite(activeWallet: any) {
  const addr = await resolveVaultFactoryAddress();
  if (!activeWallet) throw new Error("Missing active wallet (Privy).");

  const signer = await getEvmSignerFromPrivyWallet(activeWallet);
  return new Contract(addr, VaultFactoryAbi, signer);
}
