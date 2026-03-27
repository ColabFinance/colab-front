"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { VaultTabKey } from "../types";

type Props = {
  value: VaultTabKey;
  onChange: (next: VaultTabKey) => void;
};

const tabs: Array<{ key: VaultTabKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "performance", label: "Performance" },
  { key: "events", label: "Events" },
];

export function VaultTabs({ value, onChange }: Props) {
  return (
    <div className="border-b border-slate-800">
      <nav className="flex min-w-max items-center gap-8 overflow-x-auto">
        {tabs.map((tab) => {
          const active = tab.key === value;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={cn(
                "border-b-2 px-1 py-4 text-sm font-medium transition-colors",
                active
                  ? "border-cyan-400 text-cyan-300"
                  : "border-transparent text-slate-400 hover:text-slate-200",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}