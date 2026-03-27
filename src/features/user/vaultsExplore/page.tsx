"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVaultsExplore } from "./hooks";
import { VaultExploreItem } from "./types";
import { OverviewMetrics } from "./ui/OverviewMetrics";
import { MyVaultsSnapshot } from "./ui/MyVaultsSnapshot";
import { VaultsExploreFiltersToolbar } from "./ui/VaultsExploreFiltersToolbar";
import { VaultsExploreGrid } from "./ui/VaultsExploreGrid";
import { VaultsExplorePagination } from "./ui/VaultsExplorePagination";
import { VaultsExploreTable } from "./ui/VaultsExploreTable";
import { CompassIcon, PiggyBankIcon, SearchIcon } from "./ui/icons";

function buildExplorerUrl(chainId: string, address: string) {
  const clean = address.startsWith("0x") ? address : `0x${address.replace(/^0x/, "")}`;

  const baseByChain: Record<string, string> = {
    base: "https://basescan.org/address",
    ethereum: "https://etherscan.io/address",
    polygon: "https://polygonscan.com/address",
    arbitrum: "https://arbiscan.io/address",
    optimism: "https://optimistic.etherscan.io/address",
    bnb: "https://bscscan.com/address",
  };

  return `${baseByChain[chainId] ?? baseByChain.ethereum}/${clean}`;
}

export default function VaultsExplorePage() {
  const router = useRouter();

  const {
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    chainOptions,
    dexOptions,
    page,
    setPage,
    totalPages,
    pageItems,
    rangeLabel,
    toggleFavoriteLocal,
    overview,
    myVaultsSnapshot,
  } = useVaultsExplore();

  function onDetails(vault: VaultExploreItem) {
    router.push(`/vaults/${vault.address}`);
  }

  function onOpenExplorer(vault: VaultExploreItem) {
    window.open(buildExplorerUrl(vault.chainId, vault.address), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Explore Vaults
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Browse all vaults, inspect performance, and discover opportunities
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/my/vaults"
            className="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-800 hover:border-cyan-500/50 transition-colors flex items-center gap-2"
          >
            <PiggyBankIcon className="h-4 w-4 text-cyan-400" />
            My Vaults
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-slate-500" />
          </div>

          <input
            value={filters.query}
            onChange={(e) => setFilters({ query: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            placeholder="Search by name, pair, chain, dex, or address..."
          />
        </div>
      </div>

      <OverviewMetrics overview={overview} />

      <MyVaultsSnapshot
        items={myVaultsSnapshot}
        onOpenMyVaults={() => router.push("/my/vaults")}
        onOpenVault={onDetails}
      />

      <div className="bg-slate-900 border border-slate-700 rounded-xl flex flex-col min-h-[500px] overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-950/30">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CompassIcon className="h-4 w-4 text-blue-400" />
            All Vaults Discovery
          </h2>
        </div>

        <VaultsExploreFiltersToolbar
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          chainOptions={chainOptions}
          dexOptions={dexOptions}
        />

        {loading ? (
          <div className="flex-1 grid place-items-center p-10 text-sm text-slate-400">
            Loading vaults...
          </div>
        ) : filters.view === "grid" ? (
          <VaultsExploreGrid
            items={pageItems}
            onToggleFavorite={toggleFavoriteLocal}
            onDetails={onDetails}
            onOpenExplorer={onOpenExplorer}
          />
        ) : (
          <VaultsExploreTable
            items={pageItems}
            onToggleFavorite={toggleFavoriteLocal}
            onDetails={onDetails}
            onOpenExplorer={onOpenExplorer}
          />
        )}

        {!loading && (
          <VaultsExplorePagination
            rangeLabel={rangeLabel}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        )}
      </div>
    </div>
  );
}