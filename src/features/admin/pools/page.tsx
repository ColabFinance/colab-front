"use client";

import { PoolsFiltersPanel } from "./ui/PoolsFiltersPanel";
import { PoolsTable } from "./ui/PoolsTable";
import { PoolDrawer } from "./ui/PoolDrawer";
import { usePoolsPage } from "./hooks";

export default function DexPoolsPage() {
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
              <span className="text-xs font-medium text-slate-200">{vm.chainLabel}</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm md:text-base">
            Manage liquidity pools per dexKey and chain configuration.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-lg text-sm font-medium transition-all disabled:opacity-60"
            onClick={() => void vm.reload()}
            disabled={vm.loading}
          >
            ↻ Refresh
          </button>

          <button
            onClick={vm.openCreate}
            className="w-full sm:w-auto px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-60"
            disabled={vm.loading || vm.submitting || vm.dexOptions.length === 0}
          >
            + Add Pool
          </button>
        </div>
      </div>

      {vm.pageError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {vm.pageError}
        </div>
      ) : null}

      <PoolsFiltersPanel
        filters={vm.filters}
        chainOptions={vm.chainOptions}
        dexOptions={vm.dexOptions}
        onChange={(patch) => vm.setFilters((prev) => ({ ...prev, ...patch }))}
        onReset={vm.resetFilters}
        onApply={vm.applyFilters}
        disabled={vm.loading}
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
        onValidate={() => {}}
        formatRelative={vm.formatRelative}
        loading={vm.loading}
      />

      <PoolDrawer
        open={vm.drawerOpen}
        mode={vm.drawerMode}
        titleSuffix={vm.editingRow?.poolAddressShort ?? null}
        chainOptions={vm.chainOptions}
        dexOptions={vm.dexOptions}
        draft={vm.draft}
        submitting={vm.submitting}
        error={vm.drawerError}
        onChange={vm.updateDraft}
        onClose={vm.closeDrawer}
        onValidate={() => {}}
        onSave={() => void vm.saveDraft()}
      />

      <div className="pt-4 text-center text-xs text-slate-600">
        <p>&copy; 2026 Protocol Admin Dashboard. All actions are recorded on-chain.</p>
      </div>
    </div>
  );
}