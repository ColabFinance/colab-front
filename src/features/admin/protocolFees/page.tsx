"use client";

import React from "react";
import { Button } from "@/presentation/components/Button";
import { Badge } from "@/presentation/components/Badge";
import { useProtocolFees } from "./hooks";
import { CollectorSummaryCard } from "./ui/CollectorSummaryCard";
import { BalancesTable } from "./ui/BalancesTable";
import { WithdrawHistoryTable } from "./ui/WithdrawHistoryTable";
import { WithdrawDrawer } from "./ui/WithdrawDrawer";

export default function ProtocolFeesPage() {
  const {
    filters,
    setFilters,
    collector,
    filteredBalances,
    withdrawHistory,
    refreshBalances,

    withdrawOpen,
    openWithdraw,
    closeWithdraw,

    balances,
    selectedBalanceId,
    setSelectedBalanceId,
  } = useProtocolFees();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Protocol Fees</h1>
            <Badge tone="cyan">Live</Badge>
          </div>
          <p className="text-sm text-slate-400">
            Monitor accumulated protocol fees and manage treasury withdrawals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={() => openWithdraw()}>
            Withdraw to Treasury
          </Button>
        </div>
      </div>

      <CollectorSummaryCard data={collector} />

      <BalancesTable
        items={filteredBalances}
        tokenQuery={filters.tokenQuery}
        onTokenQueryChange={(v) => setFilters((p) => ({ ...p, tokenQuery: v }))}
        onRefresh={refreshBalances}
        onWithdraw={(balanceId) => openWithdraw(balanceId)}
      />

      <WithdrawHistoryTable items={withdrawHistory} />

      <div className="pt-6 pb-2 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Protocol Admin Dashboard. All actions are recorded on-chain.
      </div>

      <WithdrawDrawer
        open={withdrawOpen}
        onClose={closeWithdraw}
        collector={collector}
        balances={balances}
        selectedBalanceId={selectedBalanceId}
        onSelectBalanceId={setSelectedBalanceId}
      />
    </div>
  );
}