"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Icon } from "@/presentation/icons/Icon";
import { cn } from "@/shared/utils/cn";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";

function shortAddr(addr: string) {
  if (!addr) return "";
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function AdminTopbar({
  pageTitle,
  onOpenMobileMenu,
}: {
  pageTitle: string;
  onOpenMobileMenu: () => void;
}) {
  const { ready, authenticated, login } = usePrivy();
  const { ownerAddr, activeWallet } = useOwnerAddress();

  return (
    <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-700 bg-slate-950/90 px-4 backdrop-blur-md lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_0_20px_-8px_rgba(34,211,238,0.45)]">
            <span className="text-sm font-black">◼︎</span>
          </div>
          <span>
            Protocol<span className="text-cyan-400">Admin</span>
          </span>
        </div>
        <div className="hidden h-6 w-px bg-slate-700 md:block" />
        <h1 className="hidden text-sm font-medium text-slate-400 md:block">{pageTitle}</h1>
      </div>

      {/* Center */}
      <div className="hidden flex-1 items-center md:flex">
        <div className="mx-4 w-full max-w-md">
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon name="search" className="h-4 w-4 text-slate-400 group-focus-within:text-cyan-400" />
            </div>
            <input
              className={cn(
                "block w-full rounded-md border border-slate-700 bg-slate-900 px-10 py-1.5 text-sm text-slate-200 placeholder:text-slate-500",
                "outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              )}
              placeholder="Search addresses, tx hashes, or contracts..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <kbd className="inline-flex items-center rounded border border-slate-700 px-2 text-xs font-medium text-slate-500">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="hidden items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-300 hover:border-cyan-500/50 hover:text-white sm:flex"
        >
          <span className="h-4 w-4 rounded-full bg-slate-700" />
          Ethereum Mainnet
          <Icon name="chevronDown" className="h-4 w-4 text-slate-500" />
        </button>

        {ready && authenticated && ownerAddr ? (
          <button
            type="button"
            aria-label="Wallet address"
            className="group relative flex items-center gap-2 rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-300 hover:bg-blue-500/20"
          >
            <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
            <span className="font-mono text-blue-300">{shortAddr(ownerAddr)}</span>

            <div className="absolute right-0 top-full z-50 mt-2 hidden whitespace-nowrap rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300 shadow-xl group-hover:block">
              Connected via {activeWallet?.walletClientType ?? "wallet"}
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (ready) void login();
            }}
            className="rounded-md bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-1.5 text-sm font-medium text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] transition-all hover:from-blue-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!ready}
          >
            Connect Wallet
          </button>
        )}

        <button type="button" className="relative p-2 text-slate-400 hover:text-white">
          <Icon name="bell" className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-950" />
        </button>

        <button type="button" className="p-2 text-slate-400 hover:text-white">
          <Icon name="gear" className="h-5 w-5" />
        </button>

        <button type="button" className="p-2 text-slate-400 hover:text-white md:hidden" onClick={onOpenMobileMenu}>
          <span className="text-lg">☰</span>
        </button>
      </div>
    </header>
  );
}