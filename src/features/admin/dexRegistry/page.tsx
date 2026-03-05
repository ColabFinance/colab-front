"use client";

import { useMemo, useState } from "react";
import { useDexRegistry } from "./hooks";
import { DexRegistryItem } from "./types";
import DexFiltersPanel from "./ui/DexFiltersPanel";
import DexRegistryTable from "./ui/DexRegistryTable";
import DexDrawer from "./ui/DexDrawer";

export default function DexRegistryPage() {
  const { filters, setFilters, resetFilters, chainOptions, filtered, registeredCount } = useDexRegistry();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<DexRegistryItem | null>(null);

  const chainLabel = useMemo(() => {
    const chainId = filters.chainId === "all" ? 1 : filters.chainId;
    return chainOptions.find((c) => c.chainId === chainId)?.name ?? "Ethereum";
  }, [filters.chainId, chainOptions]);

  function openCreate() {
    setEditing(null);
    setDrawerOpen(true);
  }

  function openEdit(dex: DexRegistryItem) {
    setEditing(dex);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">DEX Registry</h1>

            <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1">
              <span className="text-xs font-medium text-slate-300">{chainLabel}</span>
              <span className="text-[10px] text-slate-500">▼</span>
            </div>
          </div>

          <p className="text-slate-400 text-sm md:text-base">Manage decentralized exchange routers for this network.</p>
        </div>

        <button
          onClick={openCreate}
          className="w-full md:w-auto rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 text-sm font-medium transition-all"
        >
          + Add DEX
        </button>
      </div>

      {/* Filters & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <DexFiltersPanel
          chainOptions={chainOptions}
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
        />

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Registered</div>
            <div className="text-2xl font-bold text-white">{registeredCount}</div>
          </div>

          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            ≋
          </div>
        </div>
      </div>

      {/* Table */}
      <DexRegistryTable items={filtered} onEdit={openEdit} />

      {/* Footer */}
      <div className="pt-8 pb-4 text-center text-xs text-slate-600 border-t border-slate-800/50">
        <p>&copy; 2024 Protocol Admin Dashboard. All actions are recorded on-chain.</p>
      </div>

      {/* Drawer */}
      <DexDrawer
        open={drawerOpen}
        mode={editing ? "edit" : "create"}
        chainLabel={`${chainLabel} Mainnet`}
        dex={editing}
        onClose={closeDrawer}
        onSave={() => {
          // mock-only: later this will call create/update usecase
          closeDrawer();
        }}
      />
    </div>
  );
}