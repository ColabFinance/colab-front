import type { JsonRpcSigner, TransactionRequest } from "ethers";
import { getReadProvider } from "@/infra/evm/provider";
import type { WalletTxResult } from "@/shared/types/tx";

export async function sendUncheckedAndWait(params: {
  signer: JsonRpcSigner;
  tx: TransactionRequest;
  confirmations?: number;
  timeoutMs?: number;
}): Promise<WalletTxResult> {
  const confirmations = params.confirmations ?? 1;
  const timeoutMs = params.timeoutMs ?? 180_000;

  // - sendUncheckedTransaction evita o ethers tentar "ler a tx de volta" e quebrar no parsing do nonce
  const tx_hash = await params.signer.sendUncheckedTransaction(params.tx);

  // Espera receipt via RPC "normal" (read provider), não via provider do embedded wallet
  const provider = await getReadProvider();
  const receipt = await provider.waitForTransaction(tx_hash, confirmations, timeoutMs);

  if (!receipt) {
    throw new Error(`Timeout waiting for transaction receipt: ${tx_hash}`);
  }

  return { tx_hash, receipt };
}
