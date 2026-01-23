import { getVaultFactoryWrite } from "@/infra/evm/contracts/vaultFactory";

export async function setVaultFactoryFeeCollectorUseCase(params: {
  activeWallet: any;
  feeCollector: string;
}) {
  const feeCollector = (params.feeCollector || "").trim();
  if (!feeCollector) throw new Error("Missing feeCollector address.");

  const c = await getVaultFactoryWrite(params.activeWallet);
  const tx = await c.setFeeCollector(feeCollector);
  return { txHash: tx.hash };
}
