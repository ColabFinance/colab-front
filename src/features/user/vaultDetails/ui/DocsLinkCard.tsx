import React from "react";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";

export function DocsLinkCard({ href = "#" }: { href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-center transition-all",
        "hover:border-cyan-500/70 hover:bg-slate-900"
      )}
    >
      <div className="text-sm font-medium text-slate-200">View Strategy Docs</div>
      <div className="mt-1 text-xs text-slate-500">Learn how this vault generates yield</div>
    </Link>
  );
}