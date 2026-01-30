import { getProtocolFeeCollectorWrite } from "@/infra/evm/contracts/protocolFeeCollector";

export async function setProtocolFeeCollectorFeeBpsUseCase(params: {
  activeWallet: any;
  feeBps: number;
}) {
  const pfc = await getProtocolFeeCollectorWrite(params.activeWallet);

  const tx = await pfc.setProtocolFeeBps(Number(params.feeBps));
  const receipt = await tx.wait();

  return { txHash: receipt?.hash || tx.hash };
}
