"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useStrategyDetails } from "./hooks";
import { StrategyIdentityHeader } from "./ui/StrategyIdentityHeader";
import { StrategyOverviewCard } from "./ui/StrategyOverviewCard";
import { StrategyOptimizeCard } from "./ui/StrategyOptimizeCard";
import { StrategyRiskCard } from "./ui/StrategyRiskCard";
import { StrategyParamsPanel } from "./ui/StrategyParamsPanel";
import { VaultsUsingStrategyTable } from "./ui/VaultsUsingStrategyTable";

export default function StrategyDetailsPage() {
  const params = useParams<{ strategyId: string }>();
  const strategyId = params?.strategyId;

  const { strategy, vaultFilter, setVaultFilter, filteredVaults } = useStrategyDetails(strategyId);

  if (!strategy) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <StrategyIdentityHeader strategy={strategy} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StrategyOverviewCard strategy={strategy} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StrategyOptimizeCard strategy={strategy} />
            <StrategyRiskCard strategy={strategy} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <StrategyParamsPanel strategy={strategy} />
        </div>
      </div>

      <VaultsUsingStrategyTable
        vaults={filteredVaults}
        filter={vaultFilter}
        onChangeFilter={setVaultFilter}
      />
    </div>
  );
}