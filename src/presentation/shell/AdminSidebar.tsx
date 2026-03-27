"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { Icon } from "@/presentation/icons/Icon";
import type { IconName } from "@/presentation/icons/Icon";

export type NavItem = {
  label: string;
  href: string;
  icon: IconName;
};

export function AdminSidebar({
  adminItems,
  userItems,
  onNavigate,
}: {
  adminItems: NavItem[];
  userItems: NavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const itemCls = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-cyan-900/30 text-cyan-300 border-r-2 border-cyan-400 rounded-l-md"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    );

  return (
    <aside className="hidden h-full w-64 flex-col overflow-y-auto border-r border-slate-700 bg-slate-950 lg:flex">
      <div className="space-y-8 p-4">
        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Admin Panel</h3>
          <nav className="space-y-1">
            {adminItems.map((it) => {
              const active = pathname === it.href;
              return (
                <Link key={it.href} href={it.href} className={itemCls(active)} onClick={onNavigate}>
                  <Icon
                    name={it.icon}
                    className={cn("h-5 w-5", active ? "text-cyan-300" : "text-slate-500")}
                  />
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">User Dashboard</h3>
          <nav className="space-y-1">
            {userItems.map((it) => {
              const active = pathname === it.href;
              return (
                <Link key={it.href} href={it.href} className={itemCls(active)} onClick={onNavigate}>
                  <Icon
                    name={it.icon}
                    className={cn("h-5 w-5", active ? "text-blue-300" : "text-slate-500")}
                  />
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mt-auto border-t border-slate-700 p-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>v2.4.0-beta</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Systems Normal
          </span>
        </div>
      </div>
    </aside>
  );
}

export function MobileSidebar({
  open,
  onClose,
  adminItems,
  userItems,
}: {
  open: boolean;
  onClose: () => void;
  adminItems: NavItem[];
  userItems: NavItem[];
}) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/95 p-4 lg:hidden">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-lg font-bold text-white">Menu</span>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
          ✕
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-semibold uppercase text-slate-500">Admin</h3>
          <div className="mt-2 space-y-2">
            {adminItems.map((it) => {
              const active = pathname === it.href;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={onClose}
                  className={cn(
                    "block rounded-md px-3 py-2",
                    active ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  {it.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase text-slate-500">User</h3>
          <div className="mt-2 space-y-2">
            {userItems.map((it) => {
              const active = pathname === it.href;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={onClose}
                  className={cn(
                    "block rounded-md px-3 py-2",
                    active ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  {it.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}