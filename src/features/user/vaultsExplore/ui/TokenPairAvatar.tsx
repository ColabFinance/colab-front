"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";

const palette: Record<string, string> = {
  USDC: "bg-blue-500 text-white",
  ETH: "bg-slate-200 text-slate-900",
  WETH: "bg-slate-300 text-slate-900",
  WBTC: "bg-orange-500 text-white",
  cbBTC: "bg-amber-500 text-white",
  UNI: "bg-pink-500 text-white",
  OP: "bg-red-500 text-white",
  USDT: "bg-green-500 text-white",
  DAI: "bg-yellow-400 text-slate-900",
  ARB: "bg-sky-500 text-white",
  AERO: "bg-cyan-500 text-slate-900",
  GMX: "bg-violet-500 text-white",
  MATIC: "bg-purple-500 text-white",
};

function tone(symbol: string) {
  return palette[symbol] ?? "bg-slate-700 text-white";
}

function label(symbol: string) {
  return symbol.slice(0, 2).toUpperCase();
}

export function TokenPairAvatar({
  token0Symbol,
  token1Symbol,
  size = "md",
}: {
  token0Symbol: string;
  token1Symbol: string;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-[11px]";
  const overlap = size === "sm" ? "-ml-3" : "-ml-3.5";

  return (
    <div className="flex items-center">
      <div
        className={cn(
          "rounded-full border-2 border-slate-900 grid place-items-center font-semibold shrink-0",
          box,
          tone(token0Symbol)
        )}
      >
        {label(token0Symbol)}
      </div>

      <div
        className={cn(
          "rounded-full border-2 border-slate-900 grid place-items-center font-semibold shrink-0",
          box,
          overlap,
          tone(token1Symbol)
        )}
      >
        {label(token1Symbol)}
      </div>
    </div>
  );
}