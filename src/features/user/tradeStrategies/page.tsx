"use client";

import { useTradeStrategiesPage } from "./hooks";
import { CreateTradeStrategyDrawer } from "./ui/CreateTradeStrategyDrawer";
import { TradeStrategiesFilters } from "./ui/TradeStrategiesFilters";
import { TradeStrategiesHeader } from "./ui/TradeStrategiesHeader";
import { TradeStrategiesKpiRow } from "./ui/TradeStrategiesKpiRow";
import { TradeStrategiesTable } from "./ui/TradeStrategiesTable";

export default function TradeStrategiesPage() {
  const vm = useTradeStrategiesPage();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <TradeStrategiesHeader
        onOpenCreateDrawer={vm.openCreateDrawer}
        onRefresh={vm.refresh}
      />

      {vm.errorMessage ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {vm.errorMessage}
        </div>
      ) : null}

      <TradeStrategiesKpiRow kpis={vm.kpis} />

      <TradeStrategiesFilters
        filters={vm.filters}
        filterOptions={vm.filterOptions}
        onChange={vm.updateFilter}
      />

      <TradeStrategiesTable
        rows={vm.rows}
        lastUpdatedLabel={vm.lastUpdatedLabel}
        page={vm.pagination.page}
        totalPages={vm.totalPages}
        limit={vm.pagination.limit}
        total={vm.pagination.total}
        onChangePage={(page) => vm.updateFilter("page", page)}
        onChangeLimit={(limit) => vm.updateFilter("limit", limit)}
        onToggleStatus={vm.toggleStatus}
      />

      <CreateTradeStrategyDrawer
        open={vm.isCreateDrawerOpen}
        form={vm.form}
        executionAccountOptions={vm.filterOptions.executionAccountIds}
        onClose={vm.closeCreateDrawer}
        onChange={vm.updateForm}
        onSubmit={vm.submitCreate}
        isSubmitting={vm.isSubmittingCreate}
      />
    </div>
  );
}