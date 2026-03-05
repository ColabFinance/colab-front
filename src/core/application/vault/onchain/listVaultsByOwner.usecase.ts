import { getVaultFactoryRead } from "@/core/infra/evm/contracts/vaultFactory";


export async function listVaultsByOwner(owner: string): Promise<string[]> {
  const factory = await getVaultFactoryRead();
  const vaults: string[] = await factory.getVaultsByOwner(owner);
  return vaults;
}
