import { Contract } from "ethers";
import { CONFIG } from "@/shared/config/env";
import { getReadProvider } from "@/infra/evm/provider";
import { VaultFactoryAbi } from "@/infra/evm/abis/vaultFactory.abi";


export function getVaultFactoryRead() {
  return new Contract(CONFIG.contracts.vaultFactory, VaultFactoryAbi, getReadProvider());
}
