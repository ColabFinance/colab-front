import React from "react";
import { Icon } from "@/presentation/icons/Icon";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";

type Action = {
  label: string;
  href: string;
  tone: "cyan" | "blue" | "purple" | "green" | "amber" | "red";
  icon: React.ReactNode;
};

const actions: Action[] = [
  { label: "Deploy Contracts", href: "/admin/contracts", tone: "cyan", icon: <Icon name="rocket" className="h-5 w-5" /> },
  { label: "Add DEX Router", href: "/admin/dex-registry", tone: "blue", icon: <Icon name="network" className="h-5 w-5" /> },
  { label: "Add Pool", href: "/admin/pools", tone: "purple", icon: <Icon name="water" className="h-5 w-5" /> },
  { label: "Add Adapter", href: "/admin/adapters", tone: "green", icon: <Icon name="plug" className="h-5 w-5" /> },
  { label: "On-chain Config", href: "/admin/onchain-config", tone: "amber", icon: <Icon name="sliders" className="h-5 w-5" /> },
  { label: "Withdraw Fees", href: "/admin/protocol-fees", tone: "red", icon: <Icon name="fees" className="h-5 w-5" /> },
];

function toneClasses(tone: Action["tone"]) {
  if (tone === "cyan") return { ring: "hover:border-cyan-500/50", bubble: "bg-cyan-500/10 group-hover:bg-cyan-500/20 text-cyan-300" };
  if (tone === "blue") return { ring: "hover:border-blue-500/50", bubble: "bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-300" };
  if (tone === "purple") return { ring: "hover:border-purple-500/50", bubble: "bg-purple-500/10 group-hover:bg-purple-500/20 text-purple-300" };
  if (tone === "green") return { ring: "hover:border-green-500/50", bubble: "bg-green-500/10 group-hover:bg-green-500/20 text-green-300" };
  if (tone === "amber") return { ring: "hover:border-amber-500/50", bubble: "bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-300" };
  return { ring: "hover:border-red-500/50", bubble: "bg-red-500/10 group-hover:bg-red-500/20 text-red-300" };
}

export function QuickActionsGrid() {
  return (
    <div>
      <h3 className="mb-3 pl-1 text-sm font-semibold uppercase tracking-wider text-slate-400">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {actions.map((a) => {
          const t = toneClasses(a.tone);
          return (
            <Link
              key={a.label}
              href={a.href}
              className={cn(
                "group flex h-32 flex-col items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900 p-4 transition-all hover:bg-slate-800",
                t.ring
              )}
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-full transition-all group-hover:scale-110", t.bubble)}>
                {a.icon}
              </div>
              <span className="text-center text-xs font-medium text-slate-300 group-hover:text-white">{a.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}