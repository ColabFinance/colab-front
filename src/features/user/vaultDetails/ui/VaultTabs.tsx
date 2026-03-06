"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { VaultTabKey } from "../types";

const TABS: { key: VaultTabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "performance", label: "Performance" },
  { key: "events", label: "Events" },
  { key: "position", label: "My Position" },
];

export function VaultTabs({
  value,
  onChange,
}: {
  value: VaultTabKey;
  onChange: (v: VaultTabKey) => void;
}) {
  return (
    <div className="border-b border-slate-800 overflow-x-auto">
      <div className="flex min-w-max gap-8">
        {TABS.map((t) => {
          const active = value === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={cn(
                "relative px-1 py-4 text-sm font-medium transition-colors border-b-2",
                active
                  ? "text-cyan-300 border-cyan-400"
                  : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}