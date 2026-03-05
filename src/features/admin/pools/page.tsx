"use client";

import { PoolsFiltersPanel } from "./ui/PoolsFiltersPanel";
import { PoolsTable } from "./ui/PoolsTable";
import { PoolDrawer } from "./ui/PoolDrawer";
import { usePoolsPage } from "./hooks";

export default function AdminDexPoolsPage() {
  const vm = usePoolsPage();

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              DEX Pools
            </h1>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
              <span className="text-xs font-medium text-slate-200">{vm.filters.chain}</span>
              <span className="text-slate-500 text-[10px]">▼</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm md:text-base">
            Manage liquidity pools per dexKey and chain configuration.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-lg text-sm font-medium transition-all"
            onClick={() => {
              // futuramente: refetch API
              vm.applyFilters();
            }}
          >
            ↻ Refresh
          </button>

          <button
            onClick={vm.openCreate}
            className="w-full sm:w-auto px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-all"
          >
            + Add Pool
          </button>
        </div>
      </div>

      <PoolsFiltersPanel
        filters={vm.filters}
        onChange={(patch) => vm.setFilters((prev) => ({ ...prev, ...patch }))}
        onReset={vm.resetFilters}
        onApply={vm.applyFilters}
      />

      <PoolsTable
        rows={vm.rows}
        total={vm.total}
        page={vm.page}
        pageSize={vm.pageSize}
        onPageChange={vm.setPage}
        selectedIds={vm.selectedIds}
        onToggleAll={vm.toggleAllOnPage}
        onToggleOne={vm.toggleOne}
        onEdit={vm.openEdit}
        onValidate={() => {
          // futuramente: validação onchain
        }}
        formatRelative={vm.formatRelative}
      />

      <PoolDrawer
        open={vm.drawerOpen}
        mode={vm.drawerMode}
        titleSuffix={vm.editingRow?.poolAddressShort ?? null}
        draft={vm.draft}
        onChange={vm.updateDraft}
        onClose={vm.closeDrawer}
        onValidate={() => {
          // futuramente: validação onchain
        }}
        onSave={() => {
          // futuramente: persistir
          vm.closeDrawer();
        }}
      />

      <div className="pt-4 text-center text-xs text-slate-600">
        <p>&copy; 2024 Protocol Admin Dashboard. All actions are recorded on-chain.</p>
      </div>
    </div>
  );
}