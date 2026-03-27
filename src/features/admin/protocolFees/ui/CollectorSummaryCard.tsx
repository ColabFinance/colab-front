import React from "react";
import { Badge } from "@/presentation/components/Badge";
import { AddressPill } from "@/presentation/components/AddressPill";
import { Surface, SurfaceBody } from "@/presentation/components/Surface";
import { cn } from "@/shared/utils/cn";
import { ProtocolFeeCollectorSummary } from "../types";

export function CollectorSummaryCard({
  data,
  className,
}: {
  data: ProtocolFeeCollectorSummary;
  className?: string;
}) {
  return (
    <Surface variant="card" className={cn("relative overflow-hidden", className)}>
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <SurfaceBody className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <div className="flex-1 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg border border-slate-700 bg-slate-950 grid place-items-center">
                <span className="text-cyan-300 text-sm font-semibold">PF</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-white">{data.contractName}</h2>
                  <Badge tone="cyan">Live</Badge>
                </div>
                <p className="text-xs text-slate-400">Main contract for fee accumulation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
                  Contract Address
                </div>
                <div className="flex items-center justify-between gap-2">
                  <AddressPill address={data.contractAddress} />
                  {data.contractExplorerUrl && (
                    <a
                      href={data.contractExplorerUrl}
                      className="text-xs text-slate-500 hover:text-cyan-300 transition-colors"
                      title="Open explorer"
                    >
                      ↗
                    </a>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
                  Treasury Destination
                </div>
                <div className="flex items-center justify-between gap-2">
                  <AddressPill address={data.treasuryAddress} />
                  {data.treasuryExplorerUrl && (
                    <a
                      href={data.treasuryExplorerUrl}
                      className="text-xs text-slate-500 hover:text-cyan-300 transition-colors"
                      title="Open explorer"
                    >
                      ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-700 lg:h-auto lg:w-px" />

          <div className="flex-1 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <div className="text-sm text-slate-400">Current Fee Rate</div>
              <div className="mt-1 text-2xl font-bold text-white">
                {(data.feeBps / 100).toFixed(2)}%
              </div>
              <div className="mt-1 text-xs font-mono text-slate-500">{data.feeBps} BPS</div>
            </div>

            <div>
              <div className="text-sm text-slate-400">Total Value Held</div>
              <div className="mt-1 text-2xl font-bold text-white">{data.totalValueUsdLabel}</div>
              {data.totalValueDeltaLabel && (
                <div className="mt-1 text-xs text-green-400">{data.totalValueDeltaLabel}</div>
              )}
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs text-slate-500">Last Withdrawal</div>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                <span>{data.lastWithdrawalLabel}</span>
                {data.lastWithdrawalExplorerUrl && (
                  <>
                    <span className="text-slate-700">•</span>
                    <a
                      href={data.lastWithdrawalExplorerUrl}
                      className="text-xs text-blue-300 hover:text-blue-200 hover:underline"
                    >
                      View Tx
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </SurfaceBody>
    </Surface>
  );
}