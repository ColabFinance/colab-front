import React from "react";
import { Card } from "@/presentation/components/Card";
import { Badge } from "@/presentation/components/Badge";
import { Icon } from "@/presentation/icons/Icon";
import { Button } from "@/presentation/components/Button";

export function HealthAlertsCard() {
  return (
    <Card className="overflow-hidden bg-slate-900 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-950/30 px-5 py-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
          <Icon name="heart" className="h-5 w-5 text-red-300" />
          Health & Alerts
        </h3>
        <Badge tone="amber" className="text-[10px] font-bold">
          2 WARNINGS
        </Badge>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
          <div className="mt-0.5 text-red-300">
            <Icon name="warning" className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-red-300">Allowlists Inconsistent</h4>
            <p className="mt-1 text-xs text-slate-400">3 vaults have adapters not in the global allowlist.</p>
            <Button href="/admin/onchain-config" variant="ghost" className="mt-2 px-0 text-[10px] underline">
              Fix Inconsistencies
            </Button>
          </div>
        </div>

        <div className="flex gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <div className="mt-0.5 text-amber-300">
            <Icon name="warning" className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-300">RPC Latency Degraded</h4>
            <p className="mt-1 text-xs text-slate-400">
              Mainnet RPC response &gt; 400ms. Consider switching provider.
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-400">
              <Icon name="check" className="h-4 w-4 text-green-400" /> Indexing Status
            </span>
            <span className="font-mono text-slate-300">Synced (Block 18234912)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-400">
              <Icon name="check" className="h-4 w-4 text-green-400" /> Fee BPS Range
            </span>
            <span className="text-slate-300">Normal (0-1000)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-400">
              <Icon name="check" className="h-4 w-4 text-green-400" /> Treasury Account
            </span>
            <span className="text-slate-300">Connected</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-950/50 px-5 py-3 text-center">
        <button className="w-full text-xs text-slate-400 hover:text-white">Run Full Diagnostics</button>
      </div>
    </Card>
  );
}