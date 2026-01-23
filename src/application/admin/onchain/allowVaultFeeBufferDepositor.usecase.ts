import { getVaultFeeBufferWrite } from "@/infra/evm/contracts/vaultFeeBuffer";

export async function allowVaultFeeBufferDepositorUseCase(params: {
  activeWallet: any;
  depositor: string;
  allowed: boolean;
}) {
  const vfb = await getVaultFeeBufferWrite(params.activeWallet);

  const tx = await vfb.setDepositor(params.depositor.trim(), params.allowed);
  const receipt = await tx.wait();

  return { txHash: receipt?.hash || tx.hash };
}
