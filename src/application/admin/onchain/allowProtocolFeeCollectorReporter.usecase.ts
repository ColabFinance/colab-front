import { getProtocolFeeCollectorWrite } from "@/infra/evm/contracts/protocolFeeCollector";

export async function allowProtocolFeeCollectorReporterUseCase(params: {
  activeWallet: any;
  reporter: string;
  allowed: boolean;
}) {
  const pfc = await getProtocolFeeCollectorWrite(params.activeWallet);

  const tx = await pfc.setReporter(params.reporter.trim(), params.allowed);
  const receipt = await tx.wait();

  return { txHash: receipt?.hash || tx.hash };
}
