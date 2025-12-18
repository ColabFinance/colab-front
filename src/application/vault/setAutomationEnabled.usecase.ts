import type { ConnectedWallet } from "@privy-io/react-auth";
import { getEvmSignerFromPrivyWallet } from "@/infra/evm/privySigner";
import { getClientVaultContract } from "@/infra/evm/contracts/clientVault";

export type WalletTxResult = {
  tx_hash: string;
  receipt: any;
};

export async function setAutomationEnabled(params: {
  wallet: ConnectedWallet;
  vaultAddress: string;
  enabled: boolean;
}): Promise<WalletTxResult> {
  const signer = await getEvmSignerFromPrivyWallet(params.wallet);
  const vault = getClientVaultContract({ vaultAddress: params.vaultAddress, signer });

  const tx = await vault.setAutomationEnabled(Boolean(params.enabled));
  const receipt = await tx.wait();

  return { tx_hash: tx.hash as string, receipt };
}
