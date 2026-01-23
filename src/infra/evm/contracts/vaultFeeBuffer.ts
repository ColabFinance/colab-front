import { Contract } from "ethers";
import { getReadProvider } from "@/infra/evm/provider";
import { VaultFeeBufferAbi } from "@/infra/evm/abis/vaultFeeBuffer.abi";
import { getCachedContractRegistry, loadContractRegistry } from "@/infra/api-lp/contractRegistry";
import { getActiveChainRuntime } from "@/shared/config/chainRuntime";
import { getEvmSignerFromPrivyWallet } from "@/infra/evm/privySigner";

function assertRegistryHasVaultFeeBuffer(reg: any) {
  if (!reg?.data?.vault_fee_buffer?.address) {
    throw new Error(
      "Assert VFB: Contract not loaded: data.vault_fee_buffer.address"
    );
  }
}

async function resolveVaultFeeBufferAddress(): Promise<string> {
  const rt = await getActiveChainRuntime();

  let reg = getCachedContractRegistry(rt.chainKey);
  if (!reg) reg = await loadContractRegistry(rt.chainKey);

  assertRegistryHasVaultFeeBuffer(reg);
  return reg.data.vault_fee_buffer.address;
}

export async function getVaultFeeBufferRead() {
  const addr = await resolveVaultFeeBufferAddress();
  const provider = await getReadProvider();
  return new Contract(addr, VaultFeeBufferAbi, provider);
}

export async function getVaultFeeBufferWrite(activeWallet: any) {
  const addr = await resolveVaultFeeBufferAddress();
  if (!activeWallet) throw new Error("Missing active wallet (Privy).");

  const signer = await getEvmSignerFromPrivyWallet(activeWallet);
  return new Contract(addr, VaultFeeBufferAbi, signer);
}
