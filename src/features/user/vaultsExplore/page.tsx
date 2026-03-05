"use client";

import React, { useMemo, useState } from "react";
import { Surface } from "@/presentation/components/Surface";
import { useVaultsExplore } from "./hooks";
import { VaultExploreItem } from "./types";
import { VaultsExploreFiltersToolbar } from "./ui/VaultsExploreFiltersToolbar";
import { VaultsExploreTable } from "./ui/VaultsExploreTable";
import { VaultsExplorePagination } from "./ui/VaultsExplorePagination";
import { DepositModal } from "./ui/DepositModal";

export default function VaultsExplorePage() {
  const {
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
  } = useVaultsExplore();

  const [depositOpen, setDepositOpen] = useState(false);
  const [selectedVault, setSelectedVault] = useState<VaultExploreItem | null>(null);

  const title = "Explore Vaults";
  const subtitle = "Discover top-performing vaults and earn yield on your assets.";

  const canRenderGrid = useMemo(() => filters.view === "grid", [filters.view]);

  function onDeposit(v: VaultExploreItem) {
    setSelectedVault(v);
    setDepositOpen(true);
  }

  function onDetails(v: VaultExploreItem) {
    // placeholder (vai virar navegação/route depois)
    console.log("details", v.id);
  }

  function onToggleFavorite(id: string) {
    toggleFavoriteLocal(id);
    // UI mock: sem persistência ainda (vai entrar via API depois)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{title}</h1>
        <p className="text-slate-400 text-sm md:text-base">{subtitle}</p>
      </div>

      <Surface variant="panel" className="bg-slate-900 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="relative w-full">
            <input
              value={filters.query}
              onChange={(e) => setFilters({ query: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-4 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              placeholder="Search vaults..."
            />
          </div>
        </div>
      </Surface>

      <VaultsExploreFiltersToolbar
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        chainOptions={chainOptions}
        dexOptions={dexOptions}
      />

      {canRenderGrid ? (
        <Surface variant="panel" className="p-8 text-center text-slate-400">
          Grid view placeholder (mantive o toggle, mas por enquanto o layout principal é a tabela do prompt).
        </Surface>
      ) : (
        <VaultsExploreTable
          items={pageItems}
          onToggleFavorite={onToggleFavorite}
          onDeposit={onDeposit}
          onDetails={onDetails}
        />
      )}

      <VaultsExplorePagination
        rangeLabel={rangeLabel}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />

      <DepositModal
        open={depositOpen}
        vault={selectedVault}
        onClose={() => {
          setDepositOpen(false);
          setSelectedVault(null);
        }}
      />
    </div>
  );
}