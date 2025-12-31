import type { ConnectedWallet } from "@privy-io/react-auth";
import { getEvmSignerFromPrivyWallet } from "@/infra/evm/privySigner";
import { getClientVaultContract } from "@/infra/evm/contracts/clientVault";
import type { WalletTxResult } from "@/application/vault/onchain/setAutomationEnabled.usecase";

export async function setAutomationConfig(params: {
  wallet: ConnectedWallet;
  vaultAddress: string;
  cooldown_sec: number;
  max_slippage_bps: number;
  allow_swap: boolean;
}): Promise<WalletTxResult> {
  const signer = await getEvmSignerFromPrivyWallet(params.wallet);
  const vault = getClientVaultContract({ vaultAddress: params.vaultAddress, signer });

  const tx = await vault.setAutomationConfig(
    Number(params.cooldown_sec || 0),
    Number(params.max_slippage_bps || 0),
    Boolean(params.allow_swap),
  );
  const receipt = await tx.wait();

  return { tx_hash: tx.hash as string, receipt };
}
