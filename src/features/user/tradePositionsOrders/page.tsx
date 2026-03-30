"use client";

import { useTradePositionsOrdersPage } from "./hooks";
import { ActivePositionsTable } from "./ui/ActivePositionsTable";
import { OrdersTable } from "./ui/OrdersTable";
import { PositionsOrdersDrawers } from "./ui/PositionsOrdersDrawers";
import { PositionsOrdersFilters } from "./ui/PositionsOrdersFilters";
import { PositionsOrdersHeader } from "./ui/PositionsOrdersHeader";
import { PositionsOrdersTabs } from "./ui/PositionsOrdersTabs";

export default function TradePositionsOrdersPage() {
  const vm = useTradePositionsOrdersPage();

  return (
    <div className="max-w-[1920px] mx-auto space-y-6">
      {vm.isLoading ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 text-sm text-slate-400">
          Loading positions and orders...
        </div>
      ) : null}

      {vm.errorMessage ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
          {vm.errorMessage}
        </div>
      ) : null}

      <PositionsOrdersHeader onRefresh={vm.refresh} />

      <PositionsOrdersFilters
        filters={vm.draftFilters}
        executionAccountOptions={vm.executionAccountOptions}
        strategyOptions={vm.strategyOptions}
        onChangeFilter={vm.updateDraftFilter}
        onApplyFilters={vm.applyFilters}
      />

      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
        <PositionsOrdersTabs activeTab={vm.activeTab} onChangeTab={vm.setActiveTab} />

        {vm.activeTab === "positions" ? (
          <ActivePositionsTable
            rows={vm.positions}
            pagination={vm.positionsPagination}
            totalPages={vm.positionsTotalPages}
            onChangePage={vm.setPositionsPage}
            onChangeLimit={vm.setPositionsLimit}
            onCopy={vm.copyText}
            onOpenDetails={vm.openPositionDetails}
            onOpenOrders={vm.openOrdersForPosition}
          />
        ) : (
          <OrdersTable
            rows={vm.orders}
            pagination={vm.ordersPagination}
            totalPages={vm.ordersTotalPages}
            strategySelected={Boolean(vm.filters.strategyId)}
            onChangePage={vm.setOrdersPage}
            onChangeLimit={vm.setOrdersLimit}
            onCopy={vm.copyText}
            onOpenDetails={vm.openOrderDetails}
            onOpenRawResponse={vm.openRawResponse}
          />
        )}
      </div>

      <PositionsOrdersDrawers
        position={vm.selectedPosition}
        order={vm.selectedOrder}
        rawResponsePretty={vm.rawResponsePretty}
        rawResponseOpen={Boolean(vm.selectedRawResponse)}
        onCopy={vm.copyText}
        onClosePosition={vm.closePositionDetails}
        onCloseOrder={vm.closeOrderDetails}
        onCloseRawResponse={vm.closeRawResponse}
      />
    </div>
  );
}