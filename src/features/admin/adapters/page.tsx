"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/presentation/components/Button";
import { cn } from "@/shared/utils/cn";
import { ADAPTERS_MOCK } from "./mock";
import { Adapter, AdaptersFilters, AdapterDraft } from "./types";
import { AdaptersFiltersPanel } from "./ui/AdaptersFiltersPanel";
import { AdaptersTable } from "./ui/AdaptersTable";
import { AdapterDrawer } from "./ui/AdapterDrawer";

export default function AdaptersPage() {
  const [rows, setRows] = useState<Adapter[]>(ADAPTERS_MOCK);

  const [filters, setFilters] = useState<AdaptersFilters>({
    chainId: "all",
    dexKey: "all",
    adapterType: "all",
    status: "all",
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Adapter | undefined>(undefined);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filters.chainId !== "all" && r.chainId !== filters.chainId) return false;
      if (filters.dexKey !== "all" && r.dexKey !== filters.dexKey) return false;
      if (filters.adapterType !== "all" && r.adapterType !== filters.adapterType) return false;

      if (filters.status === "enabled" && !r.enabled) return false;
      if (filters.status === "disabled" && r.enabled) return false;

      return true;
    });
  }, [rows, filters]);

  function openCreate() {
    setDrawerMode("create");
    setEditing(undefined);
    setDrawerOpen(true);
  }

  function openEdit(row: Adapter) {
    setDrawerMode("edit");
    setEditing(row);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  function onSave(draft: AdapterDraft) {
    // sem banco agora: só simula persistência local
    if (drawerMode === "create") {
      const caps = Object.entries(draft.capabilities)
        .filter(([, v]) => v)
        .map(([k]) => k);

      const next: Adapter = {
        id: `a_${Math.random().toString(16).slice(2)}`,
        chainId: filters.chainId === "all" ? 1 : Number(filters.chainId),
        dexKey: draft.dexKey,
        adapterAddress: draft.adapterAddress,
        poolAddress: draft.poolAddress,
        adapterType: draft.adapterType,
        version: draft.version,
        capabilities: caps,
        enabled: draft.enabled,
        health: "offline",
        updatedLabel: "just now",
        notes: draft.notes,
      };

      setRows([next, ...rows]);
      setDrawerOpen(false);
      return;
    }

    if (drawerMode === "edit" && editing) {
      const caps = Object.entries(draft.capabilities)
        .filter(([, v]) => v)
        .map(([k]) => k);

      setRows(
        rows.map((r) =>
          r.id !== editing.id
            ? r
            : {
                ...r,
                dexKey: draft.dexKey,
                adapterAddress: draft.adapterAddress,
                poolAddress: draft.poolAddress,
                adapterType: draft.adapterType,
                version: draft.version,
                capabilities: caps,
                enabled: draft.enabled,
                notes: draft.notes,
                updatedLabel: "just now",
              }
        )
      );
      setDrawerOpen(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-100 tracking-tight">
              Adapters
            </h1>

            <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1">
              <div className="h-4 w-4 rounded-full bg-slate-800 border border-slate-700" />
              <span className="text-xs font-medium text-slate-300">Ethereum</span>
              <ChevronDownIcon className="h-3 w-3 text-slate-500" />
            </div>
          </div>

          <p className="text-slate-400 text-sm md:text-base">
            Manage integration adapters connecting protocol logic to DEX pools.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="secondary"
            className="w-full sm:w-auto justify-center"
            leftIcon={<RefreshIcon className="h-4 w-4" />}
            onClick={() => {}}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            className="w-full sm:w-auto justify-center"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={openCreate}
          >
            Add Adapter
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AdaptersFiltersPanel
        value={filters}
        onChange={setFilters}
        onReset={() =>
          setFilters({
            chainId: "all",
            dexKey: "all",
            adapterType: "all",
            status: "all",
          })
        }
        onApply={() => {}}
      />

      {/* Table */}
      <div className={cn("space-y-3")}>
        <AdaptersTable
          rows={filtered}
          onEdit={openEdit}
          onRunHealthCheck={() => {}}
          onToggleEnabled={(row, enabled) => {
            setRows(rows.map((r) => (r.id === row.id ? { ...r, enabled, updatedLabel: "just now" } : r)));
          }}
        />
      </div>

      {/* Drawer */}
      <AdapterDrawer
        open={drawerOpen}
        mode={drawerMode}
        initial={editing}
        onClose={closeDrawer}
        onSave={onSave}
      />

      {/* Footer */}
      <div className="pt-4 text-center text-xs text-slate-600">
        <p>&copy; 2024 Protocol Admin Dashboard. All actions are recorded on-chain.</p>
      </div>
    </div>
  );
}

/* ---------- Icons (inline) ---------- */

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M21 12a9 9 0 1 1-2.64-6.36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 3v7h-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}