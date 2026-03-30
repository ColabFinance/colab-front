"use client";

import type { PositionsOrdersTab } from "../types";

type Props = {
  activeTab: PositionsOrdersTab;
  onChangeTab: (tab: PositionsOrdersTab) => void;
};

export function PositionsOrdersTabs({ activeTab, onChangeTab }: Props) {
  return (
    <div className="border-b border-slate-700">
      <nav className="flex overflow-x-auto">
        <button
          type="button"
          onClick={() => onChangeTab("positions")}
          className={`whitespace-nowrap py-4 px-6 font-medium text-sm flex items-center gap-2 border-b-2 ${
            activeTab === "positions"
              ? "border-cyan-500 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-300"
          }`}
        >
          <i className="fa-solid fa-chart-line" /> Positions
        </button>

        <button
          type="button"
          onClick={() => onChangeTab("orders")}
          className={`whitespace-nowrap py-4 px-6 font-medium text-sm flex items-center gap-2 border-b-2 ${
            activeTab === "orders"
              ? "border-cyan-500 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-300"
          }`}
        >
          <i className="fa-solid fa-list" /> Orders
        </button>
      </nav>
    </div>
  );
}