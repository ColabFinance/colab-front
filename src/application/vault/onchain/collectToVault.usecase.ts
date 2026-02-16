import type { ConnectedWallet } from "@privy-io/react-auth";
import { getEvmSignerFromPrivyWallet } from "@/infra/evm/privySigner";
import { getClientVaultContract } from "@/infra/evm/contracts/clientVault";
import { WalletTxResult } from "@/shared/types/tx";

export async function collectToVault(params: {
  wallet: ConnectedWallet;
  vaultAddress: string;
}): Promise<WalletTxResult> {
  const signer = await getEvmSignerFromPrivyWallet(params.wallet);
  const vault = await getClientVaultContract({ vaultAddress: params.vaultAddress, signer });

  const tx = await vault.collectToVault();
  const receipt = await tx.wait();

  return { tx_hash: tx.hash as string, receipt };
}
