"use client";

import * as React from "react";
import { ContractTabKey } from "../types";

type Tab = {
  key: ContractTabKey;
  label: string;
  missing?: boolean;
};

type Props = {
  active: ContractTabKey;
  tabs: Tab[];
  onChange: (key: ContractTabKey) => void;
};

export default function Tabs({ active, tabs, onChange }: Props) {
  return (
    <div className="border-b border-slate-700 bg-slate-950">
      <nav className="-mb-px flex gap-2 overflow-x-auto" aria-label="Tabs">
        {tabs.map((t) => {
          const isActive = t.key === active;
          const base =
            "whitespace-nowrap px-4 py-4 text-sm font-medium transition-colors rounded-t-lg";
          const activeCls = "border-b-2 border-cyan-400 text-cyan-400 bg-cyan-400/5";
          const inactiveCls =
            "border-b-2 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800";

          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`${base} ${isActive ? activeCls : inactiveCls} flex items-center gap-2`}
            >
              <span>{t.label}</span>
              {t.missing ? (
                <span className="ml-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-400">
                  Missing
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}