import React from "react";
import { cn } from "@/shared/utils/cn";

export function TokenPill({
  symbol,
  className,
}: {
  symbol: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-5 w-5 rounded-full bg-slate-800 border border-slate-700 grid place-items-center text-[10px] font-semibold text-slate-200">
        {symbol.slice(0, 2).toUpperCase()}
      </div>
      <span className="text-[10px] uppercase text-slate-500">{symbol}</span>
    </div>
  );
}