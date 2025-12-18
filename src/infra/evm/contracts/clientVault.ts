import { Contract } from "ethers";
import { getReadProvider } from "@/infra/evm/provider";
import { ClientVaultAbi } from "@/infra/evm/abis/clientVault.abi";

export function clientVaultRead(vaultAddress: string) {
  return new Contract(vaultAddress, ClientVaultAbi, getReadProvider());
}
