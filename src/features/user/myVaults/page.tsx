"use client";

import { useMemo } from "react";
import { useMyVaults } from "./hooks";
import { CreateVaultPanel } from "./ui/CreateVaultPanel";
import { MyVaultsTable } from "./ui/MyVaultsTable";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatAddress(value: string) {
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

function KpiCard({
  label,
  value,
  accent = "text-white",
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-2 text-2xl font-semibold ${accent}`}>{value}</div>
    </div>
  );
}

export default function MyVaultsPage() {
  const {
    search,
    setSearch,
    filteredVaults,
    kpis,
    connectedContext,
    strategies,
    selectedStrategy,
    form,
    setFormField,
    isCreateDrawerOpen,
    openCreateDrawer,
    closeCreateDrawer,
    isAdvancedOpen,
    setIsAdvancedOpen,
    selectStrategy,
    handleRefresh,
    lastRefreshAt,
    isPageLoading,
    isRefreshing,
    pageError,
    isCreateSubmitting,
    createError,
    createProgress,
    createResult,
    submitCreateVault,
  } = useMyVaults();

  const lastRefreshLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(lastRefreshAt);
  }, [lastRefreshAt]);

  return (
    <>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="space-y-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                My Vaults
              </h1>
              <p className="max-w-2xl text-sm text-slate-400 md:text-base">
                User-owned on-chain vault contracts linked to your strategies. Creation happens in
                two steps: on-chain deployment first, then database registration.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Connected:</span>
                <span className="rounded-md border border-slate-800 bg-slate-900 px-2 py-1 font-mono text-slate-300">
                  {connectedContext.ownerAddress ? formatAddress(connectedContext.ownerAddress) : "—"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Chain:</span>
                <span className="text-slate-300">{connectedContext.chainName}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Strategies:</span>
                <span className="font-semibold text-white">{strategies.length}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Total Vaults:</span>
                <span className="font-semibold text-white">{kpis.totalVaults}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Last Refresh:</span>
                <span className="font-medium text-slate-300">{lastRefreshLabel}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openCreateDrawer}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-950/30 transition hover:from-blue-500 hover:to-cyan-500"
            >
              <PlusIcon />
              <span>Create Vault</span>
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing || isPageLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshIcon />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>
        </section>

        {pageError ? (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {pageError}
          </div>
        ) : null}

        {createResult && !isCreateDrawerOpen ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            Vault created successfully.
            <span className="ml-2 text-emerald-200">
              {createResult.alias
                ? `Alias: ${createResult.alias}`
                : `Vault: ${formatAddress(createResult.vaultAddress)}`}
            </span>
          </div>
        ) : null}

        <section className="grid grid-cols-2 gap-4 xl:grid-cols-6">
          <KpiCard label="Total Vaults" value={String(kpis.totalVaults)} />
          <KpiCard label="Active" value={String(kpis.activeVaults)} accent="text-emerald-400" />
          <KpiCard label="Inactive" value={String(kpis.inactiveVaults)} accent="text-amber-400" />
          <KpiCard label="Chains" value={String(kpis.chains)} />
          <KpiCard label="DEXs" value={String(kpis.dexes)} />
          <KpiCard label="Total Value" value={formatUsd(kpis.totalValueUsd)} accent="text-cyan-400" />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
          <div className="flex flex-col gap-4 border-b border-slate-800 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">My Vaults List</h2>
              <p className="mt-1 text-sm text-slate-400">
                View and manage the vaults connected to your wallet.
              </p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <SearchIcon />
              </div>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search vaults by name, address, strategy..."
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="p-5">
            <MyVaultsTable
              vaults={filteredVaults}
              onCreateVault={openCreateDrawer}
              isLoading={isPageLoading}
            />
          </div>
        </section>
      </div>

      <CreateVaultPanel
        isOpen={isCreateDrawerOpen}
        onClose={closeCreateDrawer}
        strategies={strategies}
        selectedStrategy={selectedStrategy}
        form={form}
        onSelectStrategy={selectStrategy}
        onChange={setFormField}
        isAdvancedOpen={isAdvancedOpen}
        onToggleAdvanced={() => setIsAdvancedOpen((current) => !current)}
        onSubmit={submitCreateVault}
        isSubmitting={isCreateSubmitting}
        errorMessage={createError}
        progress={createProgress}
        result={createResult}
      />
    </>
  );
}