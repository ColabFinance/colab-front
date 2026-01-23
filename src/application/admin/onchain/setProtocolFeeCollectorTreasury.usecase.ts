import { getProtocolFeeCollectorWrite } from "@/infra/evm/contracts/protocolFeeCollector";

export async function setProtocolFeeCollectorTreasuryUseCase(params: {
  activeWallet: any;
  treasury: string;
}) {
  const pfc = await getProtocolFeeCollectorWrite(params.activeWallet);

  const tx = await pfc.setTreasury(params.treasury.trim());
  const receipt = await tx.wait();

  return { txHash: receipt?.hash || tx.hash };
}
