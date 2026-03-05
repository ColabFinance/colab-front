"use client";

import React from "react";
import { Button } from "@/presentation/components/Button";
import { Surface } from "@/presentation/components/Surface";
import { cn } from "@/shared/utils/cn";
import { useMyVaults } from "./hooks";
import { MyVaultsTabs } from "./ui/MyVaultsTabs";
import { MyVaultsTable } from "./ui/MyVaultsTable";
import { CreateVaultPanel } from "./ui/CreateVaultPanel";
import { AutomationPanel } from "./ui/AutomationPanel";
import { DepositModal } from "./ui/DepositModal";
import { IconPlus, IconSearch } from "./ui/icons";

export function MyVaultsPage() {
  const vm = useMyVaults();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">My Vaults</h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl">
            Deploy and manage your personal vaults connected to your strategies.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={vm.openCreate}
          leftIcon={<IconPlus className="h-4 w-4" />}
          className="w-full md:w-auto"
        >
          Create Vault
        </Button>
      </div>

      <MyVaultsTabs value={vm.activeTab} onChange={vm.setActiveTab} />

      {vm.activeTab === "list" && (
        <div className="space-y-4">
          <Surface className="p-4" variant="panel">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="relative w-full md:max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <IconSearch className="h-4 w-4" />
                </div>
                <input
                  value={vm.search}
                  onChange={(e) => vm.setSearch(e.target.value)}
                  className={cn(
                    "block w-full pl-10 pr-3 py-2 border border-slate-800 rounded-md leading-5",
                    "bg-slate-950 text-slate-200 placeholder-slate-600",
                    "focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  )}
                  placeholder="Search vaults by name, address..."
                />
              </div>

              <div className="text-xs text-slate-500">
                Tip: <span className="text-slate-300">wire backend later</span>
              </div>
            </div>
          </Surface>

          <MyVaultsTable rows={vm.filteredVaults} onDeposit={vm.onDeposit} />
        </div>
      )}

      {vm.activeTab === "create" && (
        <CreateVaultPanel
          state={vm.createState}
          setState={vm.setCreateState}
          strategies={vm.strategies}
          selectedStrategy={vm.selectedStrategy}
          onCancel={vm.openList}
        />
      )}

      {vm.activeTab === "automation" && <AutomationPanel vaults={vm.vaults} />}

      <DepositModal open={vm.depositOpen} vault={vm.depositVault} onClose={vm.closeDeposit} />
    </div>
  );
}