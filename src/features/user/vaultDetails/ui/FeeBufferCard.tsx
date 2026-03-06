import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import { cn } from "@/shared/utils/cn";
import { FeeBufferItem } from "../types";

function toneCls(tone?: FeeBufferItem["tone"]) {
  if (tone === "purple") return "border-purple-500/20 bg-purple-900/10";
  if (tone === "cyan") return "border-cyan-500/20 bg-cyan-900/10";
  if (tone === "blue") return "border-blue-500/20 bg-blue-900/10";
  if (tone === "green") return "border-green-500/20 bg-green-900/10";
  if (tone === "amber") return "border-amber-500/20 bg-amber-900/10";
  if (tone === "red") return "border-red-500/20 bg-red-900/10";
  return "border-slate-800 bg-slate-950";
}

function num(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(n);
}

export function FeeBufferCard({ items }: { items: FeeBufferItem[] }) {
  return (
    <Surface variant="panel" className="overflow-hidden shadow-sm">
      <SurfaceHeader className="bg-slate-950/40">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Fee Buffer</h3>
      </SurfaceHeader>

      <SurfaceBody className="space-y-3 p-4">
        {items.map((it) => (
          <div
            key={`${it.symbol}-${it.note}`}
            className={cn("flex items-center justify-between rounded-lg border p-3", toneCls(it.tone))}
          >
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full border border-slate-700 bg-slate-900 grid place-items-center text-[10px] font-bold text-slate-200">
                {it.symbol.slice(0, 2).toUpperCase()}
              </div>
              <span className={cn("text-sm font-medium", it.tone === "purple" ? "text-purple-200" : "text-slate-200")}>
                {it.label}
              </span>
            </div>

            <div className="text-right">
              <div className="text-sm font-mono text-white">{num(it.amount)}</div>
              <div className="text-[10px] text-slate-500">{it.note}</div>
            </div>
          </div>
        ))}
      </SurfaceBody>
    </Surface>
  );
}