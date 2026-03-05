import React from "react";
import { Badge } from "@/presentation/components/Badge";
import { Surface, SurfaceHeader } from "@/presentation/components/Surface";
import { cn } from "@/shared/utils/cn";
import { ProtocolFeeWithdrawHistoryItem } from "../types";

function toneFor(status: ProtocolFeeWithdrawHistoryItem["status"]) {
  if (status === "success") return "green";
  if (status === "pending") return "amber";
  return "red";
}

function labelFor(status: ProtocolFeeWithdrawHistoryItem["status"]) {
  if (status === "success") return "Success";
  if (status === "pending") return "Pending";
  return "Failed";
}

export function WithdrawHistoryTable({
  items,
  className,
}: {
  items: ProtocolFeeWithdrawHistoryItem[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-lg font-semibold text-white">Withdraw History</h3>

      <Surface variant="table">
        <SurfaceHeader className="bg-slate-950/40">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Recent withdrawals
          </div>
        </SurfaceHeader>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left border-collapse">
            <thead className="bg-slate-950/40 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-3 border-b border-slate-700">Tx Hash</th>
                <th className="px-6 py-3 border-b border-slate-700">Token</th>
                <th className="px-6 py-3 border-b border-slate-700">Amount</th>
                <th className="px-6 py-3 border-b border-slate-700">Destination</th>
                <th className="px-6 py-3 border-b border-slate-700 text-center">Status</th>
                <th className="px-6 py-3 border-b border-slate-700 text-right">Timestamp</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700 bg-slate-900">
              {items.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-3">
                    {row.txExplorerUrl ? (
                      <a
                        href={row.txExplorerUrl}
                        className="font-mono text-xs text-cyan-300 hover:text-cyan-200 hover:underline inline-flex items-center gap-1"
                      >
                        {row.txHashShort} <span className="text-[10px]">↗</span>
                      </a>
                    ) : (
                      <span className="font-mono text-xs text-slate-300">{row.txHashShort}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-200">{row.tokenSymbol}</td>
                  <td className="px-6 py-3 text-sm text-white font-medium">{row.amountLabel}</td>
                  <td className="px-6 py-3 text-xs font-mono text-slate-400">{row.destinationShort}</td>
                  <td className="px-6 py-3 text-center">
                    <Badge tone={toneFor(row.status) as any} className="text-[10px]">
                      {labelFor(row.status)}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-right text-xs text-slate-500">
                    {row.timestampLabel}
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                    No withdrawals yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Surface>
    </div>
  );
}