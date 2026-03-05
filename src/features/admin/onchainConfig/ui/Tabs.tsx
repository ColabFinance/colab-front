"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { OnchainTabId } from "../types";

export function Tabs({
  active,
  onChange,
}: {
  active: OnchainTabId;
  onChange: (id: OnchainTabId) => void;
}) {
  const items: Array<{ id: OnchainTabId; label: string }> = [
    { id: "strategyRegistry", label: "StrategyRegistry" },
    { id: "vaultFactory", label: "VaultFactory" },
    { id: "protocolFeeCollector", label: "ProtocolFeeCollector" },
    { id: "vaultFeeBuffer", label: "VaultFeeBuffer" },
  ];

  return (
    <div className="border-b border-slate-700 bg-slate-950">
      <nav className="-mb-px flex gap-6 overflow-x-auto">
        {items.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={cn(
                "whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-cyan-400 text-cyan-300 bg-cyan-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600"
              )}
            >
              {t.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}