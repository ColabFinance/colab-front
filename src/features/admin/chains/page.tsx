"use client";

import React from "react";
import { useToast } from "@/shared/ui/toast/useToast";
import { useChainsEnvState } from "./hooks";
import ChainsFilters from "./ui/ChainsFilters";
import ChainsTable from "./ui/ChainsTable";
import ChainDrawer from "./ui/ChainDrawer";

export default function ChainsEnvPage() {
  const { push } = useToast();

  const st = useChainsEnvState({
    onToast: (t) => push(t),
  });

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl lg:text-3xl">
                Chains &amp; Environments
              </h1>
              <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-slate-200">
                {st.activeCount} Active
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Manage supported blockchain networks and RPC configurations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={st.openCreate}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-sky-400 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-blue-500 hover:to-sky-300 sm:w-auto"
            >
              <span className="text-base leading-none">＋</span>
              Add Chain
            </button>
          </div>
        </div>

        {/* Filters */}
        <ChainsFilters
          query={st.query}
          onQueryChange={st.setQuery}
          status={st.status}
          onStatusChange={st.setStatus}
          onRefresh={() =>
            push({ title: "Refresh", description: "Mock only (no backend yet)." })
          }
        />

        {/* Table */}
        <ChainsTable
          rows={st.pageRows}
          onTestRpc={(row) => st.testRpc(row)}
          onEdit={(row) => st.openEdit(row)}
          onToggle={(row) => st.toggleRow(row)}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-6 py-4">
          <div className="text-xs text-slate-400">
            Showing <span className="font-medium text-slate-200">{st.range.from}</span> to{" "}
            <span className="font-medium text-slate-200">{st.range.to}</span> of{" "}
            <span className="font-medium text-slate-200">{st.filteredCount}</span> chains
          </div>

          <div className="flex gap-2">
            <button
              onClick={st.prevPage}
              disabled={!st.canPrev}
              className="rounded-md border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={st.nextPage}
              disabled={!st.canNext}
              className="rounded-md border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-white/10 pt-8 pb-4 text-center text-xs text-slate-500">
          <p>&copy; 2024 Protocol Admin Dashboard. All actions are recorded on-chain.</p>
        </div>
      </div>

      {/* Drawer */}
      <ChainDrawer
        open={st.drawerOpen}
        mode={st.drawerMode}
        initial={st.editing}
        onClose={st.closeDrawer}
        onSubmit={(payload) => st.submitDrawer(payload)}
        onTestRpc={(rpcUrl) => st.testRpcInline(rpcUrl)}
        rpcTest={st.rpcTest}
      />
    </>
  );
}