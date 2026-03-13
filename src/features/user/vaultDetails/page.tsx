"use client";

import React from "react";
import { Surface } from "@/presentation/components/Surface";
import { useVaultDetails } from "./hooks";
import { ActionDrawers } from "./ui/ActionDrawers";
import { EventsTab } from "./ui/EventsTab";
import { OverviewTab } from "./ui/OverviewTab";
import { PerformanceTab } from "./ui/PerformanceTab";
import { VaultConfigDrawer } from "./ui/VaultConfigDrawer";
import { VaultHeaderCard } from "./ui/VaultHeaderCard";
import { VaultTabs } from "./ui/VaultTabs";

export function VaultDetailsPage({ address }: { address: string }) {
  const {
    tab,
    setTab,

    loading,
    refreshing,
    error,

    data,
    status,
    details,
    feeBuffer,
    registry,
    header,
    canManage,

    drawer,
    openDrawer,
    closeDrawer,

    configOpen,
    openConfig,
    closeConfig,

    depositAssets,
    selectedDepositAsset,
    depositAssetAddress,
    setDepositAssetAddress,
    depositAmount,
    setDepositAmount,

    actionFeedback,
    submitDeposit,
    submitWithdrawAll,

    configForm,
    updateConfigField,
    configFeedback,
    saveAutomationToggle,
    saveAutomationConfig,
    saveDailyHarvestConfig,
    saveCompoundConfig,
    saveRewardSwapConfig,

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

    refresh,
  } = useVaultDetails(address);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <nav className="text-sm font-medium text-slate-400">
        <ol className="flex items-center gap-2">
          <li className="cursor-pointer transition-colors hover:text-cyan-300">Vaults</li>
          <li className="text-slate-600">/</li>
          <li className="text-white">{header.title}</li>
        </ol>
      </nav>

      <VaultHeaderCard
        header={header}
        canManage={canManage}
        refreshing={refreshing}
        onRefresh={refresh}
        onOpenConfig={openConfig}
        onDeposit={() => openDrawer("deposit")}
        onWithdraw={() => openDrawer("withdraw")}
        onCompoundBuffer={() => openDrawer("compoundBuffer")}
      />

      <VaultTabs value={tab} onChange={setTab} />

      {loading ? (
        <Surface variant="panel" className="p-6">
          <div className="text-lg font-semibold text-white">Loading vault...</div>
          <div className="mt-2 text-sm text-slate-400">
            Fetching live onchain status, pool details, fee buffer and event history.
          </div>
        </Surface>
      ) : null}

      {!loading && error ? (
        <Surface variant="panel" className="border border-red-500/20 bg-red-500/5 p-6">
          <div className="text-lg font-semibold text-red-300">Failed to load vault</div>
          <div className="mt-2 text-sm text-red-200">{error}</div>
        </Surface>
      ) : null}

      {!loading && !error && tab === "overview" ? (
        <OverviewTab
          status={status}
          details={details}
          performance={data.performance}
          feeBuffer={feeBuffer}
          registry={registry}
          canManage={canManage}
          onOpenConfig={openConfig}
        />
      ) : null}

      {!loading && !error && tab === "performance" ? (
        <PerformanceTab performance={data.performance} />
      ) : null}

      {!loading && !error && tab === "events" ? (
        <EventsTab
          events={filteredEvents}
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
      ) : null}

      <ActionDrawers
        openDrawer={drawer}
        onClose={closeDrawer}
        canManage={canManage}
        header={header}
        status={status}
        feeBuffer={feeBuffer}
        depositAssets={depositAssets}
        selectedDepositAsset={selectedDepositAsset}
        depositAssetAddress={depositAssetAddress}
        onChangeDepositAssetAddress={setDepositAssetAddress}
        depositAmount={depositAmount}
        onChangeDepositAmount={setDepositAmount}
        onSubmitDeposit={submitDeposit}
        onSubmitWithdrawAll={submitWithdrawAll}
        feedback={actionFeedback}
      />

      <VaultConfigDrawer
        open={configOpen}
        onClose={closeConfig}
        canManage={canManage}
        header={header}
        status={status}
        details={details}
        form={configForm}
        onChangeField={updateConfigField}
        feedback={configFeedback}
        onSaveAutomationToggle={saveAutomationToggle}
        onSaveAutomationConfig={saveAutomationConfig}
        onSaveDailyHarvestConfig={saveDailyHarvestConfig}
        onSaveCompoundConfig={saveCompoundConfig}
        onSaveRewardSwapConfig={saveRewardSwapConfig}
      />
    </div>
  );
}