"use client";

import React, { useMemo } from "react";
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
    chainOptions,
    chainId,
    setChainId,
    collector,
    filteredBalances,
    withdrawHistory,
    refreshBalances,
    loading,
    error,

    withdrawOpen,
    openWithdraw,
    closeWithdraw,

    balances,
    selectedBalanceId,
    setSelectedBalanceId,
    submittingWithdraw,

    trackToken,
    submitWithdraw,
  } = useProtocolFees();

  const chainLabel = useMemo(() => {
    return chainOptions.find((c) => c.chainId === chainId)?.name ?? "Unknown";
  }, [chainId, chainOptions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-white tracking-tight">Protocol Fees</h1>
            <Badge tone="cyan">Live</Badge>

            <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1">
              <span className="text-xs font-medium text-slate-300">{chainLabel}</span>
              <select
                value={chainId}
                onChange={(e) => setChainId(Number(e.target.value))}
                className="bg-transparent text-xs text-slate-400 outline-none"
              >
                {chainOptions.map((c) => (
                  <option key={c.chainId} value={c.chainId}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm text-slate-400">
            Monitor accumulated protocol fees and manage treasury withdrawals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={trackToken}>
            Track Token
          </Button>
          <Button variant="primary" onClick={() => openWithdraw()}>
            Withdraw to Treasury
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">
          Loading protocol fee balances...
        </div>
      )}

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
        onSubmit={submitWithdraw}
        submitting={submittingWithdraw}
      />
    </div>
  );
}