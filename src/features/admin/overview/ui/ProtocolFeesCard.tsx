import React from "react";
import { Card } from "@/presentation/components/Card";
import { TokenPill } from "@/presentation/components/TokenPill";
import { Button } from "@/presentation/components/Button";
import { cn } from "@/shared/utils/cn";
import { Icon } from "@/presentation/icons/Icon";

export function ProtocolFeesCard({ className }: { className?: string }) {
  return (
    <Card className={cn("relative overflow-hidden p-5 hover:border-slate-600", className)}>
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-emerald-500/10 to-transparent" />

      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Protocol Fees Accrued</h3>
        <span className="text-xs text-slate-500">Updated: 12 mins ago</span>
      </div>

      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white md:text-3xl">$142,893.45</span>
        <span className="rounded border border-green-500/20 bg-green-500/10 px-1.5 py-0.5 text-xs font-medium text-green-300">
          +4.2% (24h)
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex items-center gap-2">
          <TokenPill symbol="USDC" />
          <div>
            <div className="text-sm font-medium text-white">45,200</div>
            <div className="text-[10px] uppercase text-slate-500">USDC</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TokenPill symbol="WETH" />
          <div>
            <div className="text-sm font-medium text-white">24.5</div>
            <div className="text-[10px] uppercase text-slate-500">WETH</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TokenPill symbol="USDT" />
          <div>
            <div className="text-sm font-medium text-white">12,100</div>
            <div className="text-[10px] uppercase text-slate-500">USDT</div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Button
            href="/admin/protocol-fees"
            variant="ghost"
            leftIcon={<Icon name="external" className="h-4 w-4 text-cyan-300" />}
            className="px-0"
          >
            View Breakdown
          </Button>
        </div>
      </div>
    </Card>
  );
}