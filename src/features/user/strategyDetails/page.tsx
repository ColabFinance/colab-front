"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Surface } from "@/presentation/components/Surface";

import { useStrategyDetails } from "./hooks";
import { StrategyIdentityHeader } from "./ui/StrategyIdentityHeader";
import { StrategyOverviewCard } from "./ui/StrategyOverviewCard";
import { StrategyIndicatorCard } from "./ui/StrategyIndicatorCard";
import { StrategyParamsPanel } from "./ui/StrategyParamsPanel";
import { StrategyTiersTable } from "./ui/StrategyTiersTable";
import { LinkedVaultCard } from "./ui/LinkedVaultCard";
import { RegistryDetailsCard } from "./ui/RegistryDetailsCard";
import { VaultsUsingStrategyTable } from "./ui/VaultsUsingStrategyTable";
import { StrategyEditDrawer } from "./ui/StrategyEditDrawer";

export default function StrategyDetailsPage() {
  const params = useParams<{ strategyId: string }>();
  const strategyId = params?.strategyId;

  const {
    loading,
    error,
    strategy,
    vaultFilter,
    setVaultFilter,
    filteredVaults,

    editOpen,
    editLoading,
    editSaving,
    editError,
    editDraft,
    setEditDraft,
    openEditDrawer,
    closeEditDrawer,
    saveEdit,
  } = useStrategyDetails(strategyId);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Surface variant="panel" className="p-12 text-center">
          <div className="text-slate-400 text-sm">Loading strategy details...</div>
        </Surface>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="max-w-7xl mx-auto">
        <Surface variant="panel" className="p-12 text-center">
          <div className="text-red-300 text-sm">{error || "Strategy not found."}</div>
        </Surface>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <StrategyIdentityHeader strategy={strategy} onEdit={openEditDrawer} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <StrategyOverviewCard strategy={strategy} />
          <StrategyIndicatorCard strategy={strategy} />
          <StrategyTiersTable strategy={strategy} />
          <LinkedVaultCard strategy={strategy} vaults={filteredVaults} />
          <VaultsUsingStrategyTable
            vaults={filteredVaults}
            filter={vaultFilter}
            onChangeFilter={setVaultFilter}
          />
        </div>

        <div className="space-y-6">
          <StrategyParamsPanel strategy={strategy} />
          <RegistryDetailsCard strategy={strategy} />
        </div>
      </div>

      <StrategyEditDrawer
        open={editOpen}
        loading={editLoading}
        saving={editSaving}
        errorMessage={editError}
        strategy={strategy}
        draft={editDraft}
        onDraft={setEditDraft}
        onClose={closeEditDrawer}
        onSave={saveEdit}
      />
    </div>
  );
}