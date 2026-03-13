import { getProtocolFeeCollectorRead } from "@/core/infra/evm/contracts/protocolFeeCollector";

export async function checkProtocolFeeCollectorReporterUseCase(params: {
  reporter: string;
}) {
  const c = await getProtocolFeeCollectorRead();
  const allowed = await c.authorizedReporter((params.reporter || "").trim());
  return { allowed: Boolean(allowed) };
}