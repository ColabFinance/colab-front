"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

import { cn } from "@/shared/utils/cn";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import {
  getUserPageTitle,
  userShellNavSections,
  type UserNavTone,
  type UserShellNavItem,
} from "@/shared/config/nav.user";

function shortAddr(addr: string) {
  if (!addr) return "";
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function hoverIconClass(tone: UserNavTone) {
  if (tone === "blue") return "group-hover:text-blue-400";
  if (tone === "cyan") return "group-hover:text-cyan-400";
  return "group-hover:text-slate-200";
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  tone,
  onNavigate,
}: {
  item: UserShellNavItem;
  tone: UserNavTone;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActivePath(pathname, item.href);

  if (item.disabled) {
    return (
      <button
        type="button"
        disabled
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-500 opacity-80 cursor-not-allowed"
      >
        <i className={cn("fa-solid", item.faIcon, "w-5 text-center")} aria-hidden="true" />
        <span>{item.label}</span>

        {item.badge && (
          <span className="ml-auto rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-400">
            {item.badge}
          </span>
        )}
      </button>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
        active
          ? tone === "cyan"
            ? "bg-cyan-900/10 text-cyan-400 border-r-2 border-cyan-400 rounded-l-md"
            : "bg-blue-600/10 text-blue-400 border-r-2 border-blue-500 rounded-l-md"
          : "text-slate-400 hover:bg-slate-800 hover:text-white rounded-md"
      )}
    >
      <i
        className={cn(
          "fa-solid",
          item.faIcon,
          "w-5 text-center",
          active ? "" : cn("transition-colors", hoverIconClass(tone))
        )}
        aria-hidden="true"
      />
      <span>{item.label}</span>

      {item.badge && (
        <span className="ml-auto rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-400">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function UserShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { ready, authenticated, login } = usePrivy();
  const { ownerAddr, activeWallet } = useOwnerAddress();

  const pageTitle = useMemo(() => getUserPageTitle(pathname), [pathname]);

  const searchPlaceholder = useMemo(() => {
    if (pathname === "/tradeHome" || pathname.startsWith("/trade/")) {
      return "Search trade strategies...";
    }
    return "Search vaults, strategies...";
  }, [pathname]);

  return (
    <div
      className={[
        "h-screen overflow-hidden antialiased text-slate-300 flex flex-col",
        "bg-slate-950",
        "bg-[linear-gradient(to_right,rgba(30,41,59,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,41,59,0.5)_1px,transparent_1px)]",
        "bg-[size:40px_40px]",
      ].join(" ")}
    >
      <header className="h-16 border-b border-slate-700 bg-slate-950/90 backdrop-blur-md fixed top-0 w-full z-50 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-[0_0_20px_-5px_rgba(34,211,238,0.3)]">
              <i className="fa-solid fa-cube text-white text-sm" aria-hidden="true" />
            </div>
            <span>
              Protocol<span className="text-cyan-400">User</span>
            </span>
          </div>

          <div className="hidden xl:block w-px h-6 bg-slate-700 mx-2" />
          <div className="hidden xl:flex items-center gap-2 text-slate-400 text-sm font-medium">
            <span className="text-white">{pageTitle}</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa-solid fa-search text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
            </div>

            <input
              type="text"
              aria-label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "block w-full pl-10 pr-3 py-1.5 border border-slate-700 rounded-md leading-5",
                "bg-slate-900 text-slate-200 placeholder:text-slate-400",
                "focus:outline-none focus:bg-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500",
                "sm:text-sm transition-all"
              )}
              placeholder={searchPlaceholder}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-3">
          <button
            aria-label="Select network"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md hover:border-cyan-500/50 transition-colors group"
            type="button"
          >
            <img
              className="w-4 h-4 rounded-full opacity-80 group-hover:opacity-100"
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a1c030346d-67a7ff4b25a037b9ff63.png"
              alt="ethereum blockchain logo"
            />
            <span className="text-xs font-medium text-slate-300 group-hover:text-white whitespace-nowrap">
              Ethereum
            </span>
            <i className="fa-solid fa-chevron-down text-[10px] text-slate-500 ml-1" aria-hidden="true" />
          </button>

          {ready && authenticated && ownerAddr ? (
            <button
              aria-label="Wallet address"
              type="button"
              className="flex items-center gap-2 px-2 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-md hover:bg-blue-500/20 transition-colors group relative"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
              <span className="text-xs md:text-sm font-mono text-blue-400 group-hover:text-blue-300">
                {shortAddr(ownerAddr)}
              </span>

              <div className="absolute top-full mt-2 right-0 hidden group-hover:block bg-slate-900 border border-slate-700 text-slate-300 text-xs px-2 py-1 rounded shadow-xl whitespace-nowrap z-50">
                Connected via {activeWallet?.walletClientType ?? "wallet"}
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => login()}
              className="px-3 py-1.5 rounded-md font-medium text-sm text-white transition-all bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]"
            >
              Connect Wallet
            </button>
          )}

          <button
            aria-label="View notifications"
            type="button"
            className="relative p-2 text-slate-400 hover:text-white transition-colors"
          >
            <i className="fa-regular fa-bell" aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-950" />
          </button>

          <button
            aria-label="Toggle menu"
            type="button"
            className="lg:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
            onClick={() => setMobileOpen(true)}
          >
            <i className="fa-solid fa-bars text-xl" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="flex pt-16 h-full overflow-hidden">
        <aside className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-700 h-full fixed left-0 top-16 overflow-y-auto z-40">
          <div className="p-4 space-y-8">
            {userShellNavSections.map((section) => (
              <div key={section.title}>
                <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>

                <nav className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink key={item.label} item={item} tone={section.tone} />
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-[60] bg-slate-950/95 lg:hidden flex flex-col p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
              <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-cube text-white text-sm" aria-hidden="true" />
                </div>
                <span>
                  Protocol<span className="text-cyan-400">User</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="text-slate-400 p-2 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <i className="fa-solid fa-xmark text-2xl" aria-hidden="true" />
              </button>
            </div>

            <nav className="space-y-6">
              {userShellNavSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 px-3">
                    {section.title}
                  </h3>

                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.label}
                        item={item}
                        tone={section.tone}
                        onNavigate={() => setMobileOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}

        <main className="flex-1 lg:ml-64 overflow-y-auto h-full p-4 md:p-6 lg:p-8 pb-20 relative">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}