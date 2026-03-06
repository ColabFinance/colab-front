"use client";

import React from "react";
import { useVaultDetails } from "./hooks";
import { VaultTabs } from "./ui/VaultTabs";
import { VaultHeaderCard } from "./ui/VaultHeaderCard";
import { KpiGrid } from "./ui/KpiGrid";
import { VaultCompositionCard } from "./ui/VaultCompositionCard";
import { CurrentRangeCard } from "./ui/CurrentRangeCard";
import { FeeBufferCard } from "./ui/FeeBufferCard";
import { SystemHealthCard } from "./ui/SystemHealthCard";
import { DocsLinkCard } from "./ui/DocsLinkCard";
import { DepositModal } from "./ui/DepositModal";
import { Surface } from "@/presentation/components/Surface";

export function VaultDetailsPage({ address }: { address: string }) {
  const {
    tab,
    setTab,
    data,
    breadcrumbLabel,

    depositOpen,
    openDeposit,
    closeDeposit,
    depositAmount,
    setDepositAmount,
    setMaxDeposit,
  } = useVaultDetails(address);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm font-medium text-slate-400">
        <ol className="flex items-center gap-2">
          <li className="hover:text-cyan-300 transition-colors cursor-pointer">Vaults</li>
          <li className="text-slate-600">/</li>
          <li className="text-white">{breadcrumbLabel}</li>
        </ol>
      </nav>

      {/* Header */}
      <VaultHeaderCard
        data={data}
        onDeposit={openDeposit}
        onWithdraw={() => {}}
        onClaim={() => {}}
      />

      {/* Tabs */}
      <VaultTabs value={tab} onChange={setTab} />

      {/* Content */}
      {tab === "overview" ? (
        <div className="space-y-6">
          <KpiGrid kpis={data.kpis} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <VaultCompositionCard
                composition={data.composition}
                token0={data.token0}
                token1={data.token1}
              />
              <CurrentRangeCard range={data.range} />
            </div>

            <div className="space-y-6">
              <FeeBufferCard items={data.feeBuffer} />
              <SystemHealthCard health={data.health} />
              <DocsLinkCard href="#" />
            </div>
          </div>
        </div>
      ) : (
        <Surface variant="panel" className="p-6">
          <div className="text-white text-lg font-semibold">Coming soon</div>
          <div className="mt-2 text-sm text-slate-400">
            Tab <span className="font-mono text-slate-200">{tab}</span> will be wired when API + charts/events are connected.
          </div>
        </Surface>
      )}

      {/* Deposit Modal */}
      <DepositModal
        open={depositOpen}
        onClose={closeDeposit}
        amount={depositAmount}
        onChangeAmount={setDepositAmount}
        onMax={setMaxDeposit}
        onConfirm={() => closeDeposit()}
        tokenSymbol={data.token0.symbol}
        poolLabel={`${data.token0.symbol}-${data.token1.symbol} Pool`}
        dexLabel={data.dexName}
      />
    </div>
  );
}