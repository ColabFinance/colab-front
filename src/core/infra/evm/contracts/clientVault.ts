import { Contract, type Signer, isAddress } from "ethers";
import { ClientVaultAbi } from "@/core/infra/evm/abis/clientVault.abi";
import { getReadProvider } from "@/core/infra/evm/provider";

export async function getClientVaultContract(params: { vaultAddress: string; signer?: Signer }) {
  const addr = (params.vaultAddress || "").trim();
  if (!isAddress(addr)) {
    throw new Error(`Invalid vaultAddress: "${params.vaultAddress}"`);
  }

  const runner = params.signer ?? await getReadProvider();
  return new Contract(addr, ClientVaultAbi, runner);
}
