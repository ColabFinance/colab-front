import React from "react";
import { Card } from "@/presentation/components/Card";
import { Badge } from "@/presentation/components/Badge";
import { Button } from "@/presentation/components/Button";
import { AddressPill } from "@/presentation/components/AddressPill";
import { cn } from "@/shared/utils/cn";
import { VaultDetails } from "../types";

function statusTone(status: VaultDetails["status"]) {
  if (status === "ACTIVE") return "green" as const;
  if (status === "PAUSED") return "amber" as const;
  return "red" as const;
}

function statusLabel(status: VaultDetails["status"]) {
  if (status === "ACTIVE") return "Active";
  if (status === "PAUSED") return "Paused";
  return "Error";
}

function TokenAvatar({ symbol, className }: { symbol: string; className?: string }) {
  return (
    <div
      className={cn(
        "h-10 w-10 md:h-12 md:w-12 rounded-full border border-slate-700 bg-slate-950 grid place-items-center text-xs font-bold text-slate-200 shadow-sm",
        className
      )}
      aria-label={`${symbol} token`}
      title={symbol}
    >
      {symbol.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function VaultHeaderCard({
  data,
  onDeposit,
  onWithdraw,
  onClaim,
}: {
  data: VaultDetails;
  onDeposit: () => void;
  onWithdraw: () => void;
  onClaim: () => void;
}) {
  return (
    <Card className="relative overflow-hidden p-4 md:p-6">
      <div className="pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px]" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex -space-x-3 mt-1">
            <TokenAvatar symbol={data.token0.symbol} className="z-10" />
            <TokenAvatar symbol={data.token1.symbol} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
                {data.token0.symbol}-{data.token1.symbol} {data.feeTierLabel}
              </h1>

              <Badge tone={statusTone(data.status)} className="uppercase tracking-wide">
                {statusLabel(data.status)}
              </Badge>

              <span className="text-xs text-slate-500">{data.updatedAtLabel}</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs">
                <span className="h-2 w-2 rounded-full bg-cyan-400/80" />
                {data.chainName}
              </span>

              <span className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs">
                <span className="text-slate-500">Fee Tier:</span>
                <span className="font-mono text-slate-200">{data.feeTierLabel}</span>
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Vault:</span>
                <AddressPill address={data.address} />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Pool:</span>
                <AddressPill address={data.poolAddress} />
              </div>

              <span className="text-xs text-slate-500">{data.dexName}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <Button className="w-full sm:w-auto" variant="primary" onClick={onDeposit}>
            Deposit
          </Button>
          <Button className="w-full sm:w-auto" variant="secondary" onClick={onWithdraw}>
            Withdraw
          </Button>
          <Button className="w-full sm:w-auto" variant="secondary" onClick={onClaim}>
            Claim
          </Button>
        </div>
      </div>
    </Card>
  );
}