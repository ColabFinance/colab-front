"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { Button } from "@/presentation/components/Button";
import { AddressPill } from "@/presentation/components/AddressPill";
import { Surface } from "@/presentation/components/Surface";

import { useMyStrategies } from "./hooks";
import { StrategiesTable } from "./ui/StrategiesTable";
import { CreateStrategyModal } from "./ui/CreateStrategyModal";
import { EditParamsDrawer } from "./ui/EditParamsDrawer";

export default function MyStrategiesFeaturePage() {
  const { authenticated, login } = usePrivy();
  const { ownerAddr } = useOwnerAddress();

  const walletConnected = Boolean(authenticated && ownerAddr);

  const {
    dexOptions,
    poolOptions,
    filteredRows,
    hasRows,
    hasFilteredRows,

    loading,
    error,

    stats,
    filters,
    chainOptions,
    setChainFilter,
    setStatusFilter,
    setVaultLinkFilter,
    setVisibilityFilter,
    setQueryFilter,
    resetFilters,

    createOpen,
    createLoading,
    createSubmitting,
    createError,
    openCreate,
    closeCreate,
    createDraft,
    setCreateDraft,
    confirmCreate,

    editOpen,
    editLoading,
    editSubmitting,
    editError,
    selected,
    openEdit,
    closeEdit,
    editDraft,
    setEditDraft,
    saveParams,

    refresh,
  } = useMyStrategies();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white">My Strategies</h1>
          <p className="text-slate-400 text-sm">Create and manage your live LP strategies</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {walletConnected ? (
            <AddressPill address={ownerAddr!} />
          ) : (
            <button
              type="button"
              onClick={() => login()}
              className="px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-950 text-cyan-300 hover:text-cyan-200 hover:border-cyan-500/30 transition-colors"
            >
              Connect wallet
            </button>
          )}

          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 text-slate-300 hover:text-white rounded-lg transition-all disabled:opacity-60"
          >
            <i className="fa-solid fa-rotate" aria-hidden="true" />
            <span className="hidden sm:inline">{loading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={() => (walletConnected ? openCreate() : login())}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all"
          >
            <i className="fa-solid fa-plus" aria-hidden="true" />
            <span>Create Strategy</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Strategies</div>
          <div className="text-2xl font-bold text-white">{stats.totalStrategies}</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Active</div>
          <div className="text-2xl font-bold text-green-400">{stats.activeStrategies}</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Inactive</div>
          <div className="text-2xl font-bold text-slate-300">{stats.inactiveStrategies}</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Public</div>
          <div className="text-2xl font-bold text-cyan-400">{stats.publicStrategies}</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Linked to Vault</div>
          <div className="text-2xl font-bold text-violet-400">{stats.linkedVaults}</div>
        </div>
      </div>

      <Surface variant="panel" className="p-4 bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Chain</label>
            <select
              value={filters.chain}
              onChange={(e) => setChainFilter(e.target.value as any)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
            >
              {chainOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Vault Link</label>
            <select
              value={filters.vaultLink}
              onChange={(e) => setVaultLinkFilter(e.target.value as any)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
            >
              <option value="all">All</option>
              <option value="linked">Linked</option>
              <option value="not_linked">Not Linked</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Visibility</label>
            <select
              value={filters.visibility}
              onChange={(e) => setVisibilityFilter(e.target.value as any)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
            >
              <option value="all">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Search</label>
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setQueryFilter(e.target.value)}
              placeholder="ID, name, symbol, stream key..."
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4"
          >
            Reset filters
          </button>
        </div>
      </Surface>

      {loading ? (
        <Surface variant="panel" className="p-16 text-center">
          <div className="text-slate-400 text-sm">Loading strategies...</div>
        </Surface>
      ) : !hasRows ? (
        <Surface variant="panel" className="p-16 text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
            <i className="fa-solid fa-robot text-slate-500 text-3xl" aria-hidden="true" />
          </div>

          <h3 className="text-xl font-semibold text-white mb-3">No Strategies Yet</h3>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
            You haven&apos;t created any strategies yet. Start by creating your first LP strategy.
          </p>

          <Button
            variant="primary"
            onClick={() => (walletConnected ? openCreate() : login())}
            leftIcon={<i className="fa-solid fa-plus" aria-hidden="true" />}
          >
            Create Strategy
          </Button>
        </Surface>
      ) : !hasFilteredRows ? (
        <Surface variant="panel" className="p-16 text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
            <i className="fa-solid fa-filter-circle-xmark text-slate-500 text-3xl" aria-hidden="true" />
          </div>

          <h3 className="text-xl font-semibold text-white mb-3">No matching strategies</h3>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
            No strategies match the current filters. Try adjusting the search or reset the filters.
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="px-5 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 rounded-lg transition-colors"
          >
            Reset filters
          </button>
        </Surface>
      ) : (
        <StrategiesTable rows={filteredRows} onEditParams={openEdit} />
      )}

      <CreateStrategyModal
        open={createOpen}
        loading={createLoading}
        submitting={createSubmitting}
        errorMessage={createError}
        onClose={closeCreate}
        onConfirm={confirmCreate}
        dexOptions={dexOptions}
        poolOptions={poolOptions}
        draft={createDraft}
        onDraft={setCreateDraft}
      />

      <EditParamsDrawer
        open={editOpen}
        loading={editLoading}
        saving={editSubmitting}
        errorMessage={editError}
        onClose={closeEdit}
        selected={selected}
        draft={editDraft}
        onDraft={setEditDraft}
        onSave={saveParams}
      />
    </div>
  );
}