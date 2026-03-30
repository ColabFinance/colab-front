"use client";

import Link from "next/link";
import { cn } from "@/shared/utils/cn";

type Tone = "cyan" | "blue" | "slate" | "green" | "red" | "orange" | "yellow";

type Props = {
  href?: string;
  onClick?: () => void;
  label: string;
  tone?: Tone;
};

function toneClasses(tone: Tone) {
  if (tone === "cyan") {
    return "bg-cyan-500/10 text-cyan-300 border-cyan-500/20 hover:bg-cyan-500/15 hover:text-cyan-200";
  }
  if (tone === "blue") {
    return "bg-blue-500/10 text-blue-300 border-blue-500/20 hover:bg-blue-500/15 hover:text-blue-200";
  }
  if (tone === "green") {
    return "bg-green-500/10 text-green-300 border-green-500/20 hover:bg-green-500/15 hover:text-green-200";
  }
  if (tone === "red") {
    return "bg-red-500/10 text-red-300 border-red-500/20 hover:bg-red-500/15 hover:text-red-200";
  }
  if (tone === "orange") {
    return "bg-orange-500/10 text-orange-300 border-orange-500/20 hover:bg-orange-500/15 hover:text-orange-200";
  }
  if (tone === "yellow") {
    return "bg-yellow-500/10 text-yellow-300 border-yellow-500/20 hover:bg-yellow-500/15 hover:text-yellow-200";
  }
  return "bg-slate-500/10 text-slate-300 border-slate-500/20 hover:bg-slate-500/15 hover:text-slate-200";
}

const baseClassName =
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap";

export function ActionBadge({ href, onClick, label, tone = "slate" }: Props) {
  const className = cn(baseClassName, toneClasses(tone));

  if (href) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}