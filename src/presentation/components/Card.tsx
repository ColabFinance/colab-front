import React from "react";
import { cn } from "@/shared/utils/cn";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "muted";
};

export function Card({ className, variant = "default", ...props }: Props) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-700 bg-slate-900 shadow-sm",
        variant === "muted" && "bg-slate-900",
        className
      )}
      {...props}
    />
  );
}