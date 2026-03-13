"use client";

import React from "react";
import { useVaultDetails } from "./hooks";
import { ActionDrawers } from "./ui/ActionDrawers";
import { EventsTab } from "./ui/EventsTab";
import { OverviewTab } from "./ui/OverviewTab";
import { PerformanceTab } from "./ui/PerformanceTab";
import { VaultHeaderCard } from "./ui/VaultHeaderCard";
import { VaultTabs } from "./ui/VaultTabs";

export function VaultDetailsPage({ address }: { address: string }) {
  const {
    tab,
    setTab,
    data,
    breadcrumbLabel,
    canManage,

    actionDrawer,
    openDrawer,
    closeDrawer,

    depositAmount,
    setDepositAmount,
    depositAssetSymbol,
    setDepositAssetSymbol,
    selectedDepositAsset,
    setMaxDeposit,

    withdrawAmount,
    setWithdrawAmount,
    withdrawAssetSymbol,
    setWithdrawAssetSymbol,
    selectedWithdrawAsset,
    setMaxWithdraw,

    selectedEpisode,
    openEpisode,
    closeEpisode,

    selectedEvent,
    openEvent,
    closeEvent,

    eventTypeFilter,
    setEventTypeFilter,
    eventSearch,
    setEventSearch,
    eventTokenFilter,
    setEventTokenFilter,
    eventFromDate,
    setEventFromDate,
    eventToDate,
    setEventToDate,
    availableEventTokens,
    filteredEvents,
  } = useVaultDetails(address);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <nav className="text-sm font-medium text-slate-400">
        <ol className="flex items-center gap-2">
          <li className="cursor-pointer transition-colors hover:text-cyan-300">Vaults</li>
          <li className="text-slate-600">/</li>
          <li className="text-white">{breadcrumbLabel}</li>
        </ol>
      </nav>

      <VaultHeaderCard
        data={data}
        canManage={canManage}
        onDeposit={() => openDrawer("deposit")}
        onWithdraw={() => openDrawer("withdraw")}
        onClaim={() => openDrawer("claim")}
      />

      <VaultTabs value={tab} onChange={setTab} />

      {tab === "overview" && <OverviewTab data={data} />}

      {tab === "performance" && (
        <PerformanceTab
          summary={data.performanceSummary}
          episodes={data.episodes}
          selectedEpisode={selectedEpisode}
          onOpenEpisode={openEpisode}
          onCloseEpisode={closeEpisode}
        />
      )}

      {tab === "events" && (
        <EventsTab
          events={filteredEvents}
          selectedEvent={selectedEvent}
          onOpenEvent={openEvent}
          onCloseEvent={closeEvent}
          eventTypeFilter={eventTypeFilter}
          setEventTypeFilter={setEventTypeFilter}
          eventSearch={eventSearch}
          setEventSearch={setEventSearch}
          eventTokenFilter={eventTokenFilter}
          setEventTokenFilter={setEventTokenFilter}
          eventFromDate={eventFromDate}
          setEventFromDate={setEventFromDate}
          eventToDate={eventToDate}
          setEventToDate={setEventToDate}
          availableEventTokens={availableEventTokens}
        />
      )}

      <ActionDrawers
        openDrawer={actionDrawer}
        onClose={closeDrawer}
        vaultName={data.header.pairLabel}
        vaultAddress={data.header.address}
        viewerWallet={data.viewer.walletAddress}
        depositAssets={data.depositAssets}
        selectedDepositAssetSymbol={depositAssetSymbol}
        onChangeDepositAssetSymbol={setDepositAssetSymbol}
        selectedDepositAsset={selectedDepositAsset}
        depositAmount={depositAmount}
        onChangeDepositAmount={setDepositAmount}
        onMaxDeposit={setMaxDeposit}
        withdrawAssets={data.withdrawAssets}
        selectedWithdrawAssetSymbol={withdrawAssetSymbol}
        onChangeWithdrawAssetSymbol={setWithdrawAssetSymbol}
        selectedWithdrawAsset={selectedWithdrawAsset}
        withdrawAmount={withdrawAmount}
        onChangeWithdrawAmount={setWithdrawAmount}
        onMaxWithdraw={setMaxWithdraw}
        claim={data.claim}
      />
    </div>
  );
}