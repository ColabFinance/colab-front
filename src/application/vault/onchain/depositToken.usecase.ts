import type { ConnectedWallet } from "@privy-io/react-auth";
import { parseUnits } from "ethers";
import { getEvmSignerFromPrivyWallet } from "@/infra/evm/privySigner";
import { getErc20Contract } from "@/infra/evm/contracts/erc20";
import type { WalletTxResult } from "@/application/vault/onchain/setAutomationEnabled.usecase";

export async function depositToken(params: {
  wallet: ConnectedWallet;
  tokenAddress: string;
  vaultAddress: string;
  amount: string; // human, ex "12.34"
  decimals: number; // token decimals
}): Promise<WalletTxResult> {
  const signer = await getEvmSignerFromPrivyWallet(params.wallet);
  const token = getErc20Contract({ tokenAddress: params.tokenAddress, signer });

  const value = parseUnits(String(params.amount || "0"), Number(params.decimals || 0));
  const tx = await token.transfer(params.vaultAddress, value);
  const receipt = await tx.wait();

  return { tx_hash: tx.hash as string, receipt };
}
