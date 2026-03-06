import React from "react";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";

export function InfoBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 md:p-6 flex flex-col sm:flex-row gap-4 items-start",
        className
      )}
    >
      <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-300 grid place-items-center shrink-0">
        <span className="text-lg">i</span>
      </div>

      <div className="min-w-0">
        <h4 className="text-sm font-bold text-blue-100 mb-1">How Strategies Work</h4>
        <p className="text-sm text-slate-400">
          Strategies are automated smart contracts that manage your liquidity position. They define rules for
          rebalancing, compounding, and range management. When you deploy a Vault, you bind it to a specific
          Strategy.
        </p>

        <Link
          href="/learn"
          className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 mt-2 font-medium"
        >
          Read full documentation <span>→</span>
        </Link>
      </div>
    </div>
  );
}