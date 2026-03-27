import React from "react";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: Variant;
  leftIcon?: React.ReactNode;
};

function base(variant: Variant) {
  const common =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  switch (variant) {
    case "primary":
      return cn(
        common,
        "text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_20px_-8px_rgba(59,130,246,0.45)]"
      );
    case "secondary":
      return cn(
        common,
        "bg-slate-800 text-slate-200 border border-slate-600 hover:bg-slate-700"
      );
    case "danger":
      return cn(
        common,
        "bg-red-500/10 text-red-200 border border-red-500/30 hover:bg-red-500/20"
      );
    case "ghost":
    default:
      return cn(common, "bg-transparent text-slate-300 hover:text-white hover:bg-slate-800");
  }
}

export function Button({ href, variant = "secondary", leftIcon, className, children, ...props }: Props) {
  const cls = cn(base(variant), className);

  if (href) {
    return (
      <Link href={href} className={cls}>
        {leftIcon}
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...props}>
      {leftIcon}
      {children}
    </button>
  );
}