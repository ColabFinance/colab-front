import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import { Badge } from "@/presentation/components/Badge";
import { SystemHealth } from "../types";

function healthTone(h: SystemHealth) {
  if (h.adapterStatus !== "OPERATIONAL") return "amber" as const;
  if (h.poolConnection !== "SYNCED") return "amber" as const;
  if (h.allowlistCheck !== "PASSED") return "red" as const;
  return "green" as const;
}

function smallStatusBadge(label: string, ok: boolean) {
  return (
    <Badge tone={ok ? "green" : "amber"} className="text-[10px]">
      {label}
    </Badge>
  );
}

export function SystemHealthCard({ health }: { health: SystemHealth }) {
  const tone = healthTone(health);

  return (
    <Surface variant="panel" className="overflow-hidden shadow-sm">
      <SurfaceHeader className="bg-slate-950/40">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">System Health</h3>
      </SurfaceHeader>

      <SurfaceBody className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Adapter Status</span>
          {smallStatusBadge(health.adapterStatus === "OPERATIONAL" ? "Operational" : "Degraded", health.adapterStatus === "OPERATIONAL")}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Pool Connection</span>
          {smallStatusBadge(health.poolConnection === "SYNCED" ? "Synced" : "Lagging", health.poolConnection === "SYNCED")}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Read Latency</span>
          <span className="text-xs font-mono text-cyan-300">{health.readLatencyMs}ms</span>
        </div>

        <div className="h-px bg-slate-800" />

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Allowlist Check</span>
            <span className="text-slate-200">{health.allowlistCheck === "PASSED" ? "Passed" : "Failed"}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Fee Buffer Health</span>
            <span className="text-slate-200">{health.feeBufferHealth === "OPTIMAL" ? "Optimal" : health.feeBufferHealth}</span>
          </div>
        </div>

        <Badge tone={tone} className="w-fit">
          {tone === "green" ? "All Good" : "Attention Needed"}
        </Badge>
      </SurfaceBody>
    </Surface>
  );
}