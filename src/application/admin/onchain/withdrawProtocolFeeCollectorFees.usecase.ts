import { getProtocolFeeCollectorWrite } from "@/infra/evm/contracts/protocolFeeCollector";

export async function withdrawProtocolFeeCollectorFeesUseCase(params: {
  activeWallet: any;
  token: string;
  amount: bigint;
  to: string;
}) {
  const token = (params.token || "").trim();
  const to = (params.to || "").trim();
  if (!token) throw new Error("Missing token address.");
  if (!to) throw new Error("Missing recipient address.");
  if (!params.amount || params.amount <= 0n) throw new Error("Amount must be > 0.");

  const pfc = await getProtocolFeeCollectorWrite(params.activeWallet);

  const tx = await pfc.withdrawFees(token, params.amount, to);
  const receipt = await tx.wait();

  return { txHash: receipt?.hash || tx.hash };
}
