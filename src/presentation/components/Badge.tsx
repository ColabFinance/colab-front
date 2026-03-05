import React from "react";
import { cn } from "@/shared/utils/cn";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "cyan" | "blue" | "green" | "amber" | "red" | "slate";
};

export function Badge({ tone = "slate", className, ...props }: Props) {
  const toneCls =
    tone === "cyan"
      ? "bg-cyan-900/40 text-cyan-300 border-cyan-800"
      : tone === "blue"
      ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
      : tone === "green"
      ? "bg-green-500/10 text-green-300 border-green-500/20"
      : tone === "amber"
      ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
      : tone === "red"
      ? "bg-red-500/10 text-red-300 border-red-500/20"
      : "bg-slate-800/60 text-slate-200 border-slate-700";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-medium",
        toneCls,
        className
      )}
      {...props}
    />
  );
}