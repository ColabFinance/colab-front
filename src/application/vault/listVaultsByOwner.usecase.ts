import { getVaultFactoryRead } from "@/infra/evm/contracts/vaultFactory";


export async function listVaultsByOwner(owner: string): Promise<string[]> {
  const factory = getVaultFactoryRead();
  const vaults: string[] = await factory.getVaultsByOwner(owner);
  return vaults;
}
