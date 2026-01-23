import { getVaultFactoryWrite } from "@/infra/evm/contracts/vaultFactory";

export async function setVaultFactoryExecutorUseCase(params: {
  activeWallet: any;
  executor: string;
}) {
  const executor = (params.executor || "").trim();
  if (!executor) throw new Error("Missing executor address.");

  const c = await getVaultFactoryWrite(params.activeWallet);
  const tx = await c.setExecutor(executor);
  return { txHash: tx.hash };
}
