import * as React from "react";
import { cn } from "@/shared/utils/cn";

type SurfaceVariant = "card" | "panel" | "table" | "inset";

export type SurfaceProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: SurfaceVariant;
};

const variants: Record<SurfaceVariant, string> = {
  card: "rounded-xl border border-slate-700 bg-slate-900",
  panel: "rounded-xl border border-slate-700 bg-slate-900",
  table: "rounded-xl border border-slate-700 bg-slate-900 overflow-hidden",
  inset: "rounded-lg border border-slate-700 bg-slate-950",
};

export function Surface({ variant = "panel", className, ...props }: SurfaceProps) {
  return <div className={cn(variants[variant], className)} {...props} />;
}

export function SurfaceHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-4 py-3 border-b border-slate-700 bg-slate-950/40",
        className
      )}
      {...props}
    />
  );
}

export function SurfaceBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}

export function SurfaceFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-4 py-3 border-t border-slate-700 bg-slate-950/40",
        className
      )}
      {...props}
    />
  );
}