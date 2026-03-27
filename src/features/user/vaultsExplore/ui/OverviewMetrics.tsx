"use client";

import React from "react";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  NetworkIcon,
  SwapIcon,
  TargetIcon,
  UserIcon,
  VaultIcon,
} from "./icons";

type Overview = {
  totalVaults: number;
  activeVaults: number;
  myVaults: number;
  chains: number;
  dexes: number;
  inRange: number;
  outOfRange: number;
};

export function OverviewMetrics({ overview }: { overview: Overview }) {
  const cards = [
    {
      label: "Total Vaults",
      value: overview.totalVaults,
      valueClassName: "text-white",
      icon: <VaultIcon className="h-3.5 w-3.5 text-slate-600" />,
      borderClassName: "hover:border-cyan-500/30",
    },
    {
      label: "Active",
      value: overview.activeVaults,
      valueClassName: "text-green-400",
      icon: <CheckCircleIcon className="h-3.5 w-3.5 text-green-500/70" />,
      borderClassName: "hover:border-green-500/30",
    },
    {
      label: "My Vaults",
      value: overview.myVaults,
      valueClassName: "text-cyan-400",
      icon: <UserIcon className="h-3.5 w-3.5 text-cyan-500/70" />,
      borderClassName: "hover:border-cyan-500/30",
    },
    {
      label: "Chains",
      value: overview.chains,
      valueClassName: "text-blue-400",
      icon: <NetworkIcon className="h-3.5 w-3.5 text-blue-500/70" />,
      borderClassName: "hover:border-blue-500/30",
    },
    {
      label: "DEXs",
      value: overview.dexes,
      valueClassName: "text-blue-400",
      icon: <SwapIcon className="h-3.5 w-3.5 text-blue-500/70" />,
      borderClassName: "hover:border-blue-500/30",
    },
    {
      label: "In Range",
      value: overview.inRange,
      valueClassName: "text-green-400",
      icon: <TargetIcon className="h-3.5 w-3.5 text-green-500/70" />,
      borderClassName: "hover:border-green-500/30",
    },
    {
      label: "Out Range",
      value: overview.outOfRange,
      valueClassName: "text-red-400",
      icon: <AlertTriangleIcon className="h-3.5 w-3.5 text-red-500/70" />,
      borderClassName: "hover:border-red-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 md:gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-slate-900 border border-slate-700 rounded-xl p-4 transition-colors ${card.borderClassName}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              {card.label}
            </span>
            {card.icon}
          </div>

          <div className={`text-2xl font-bold ${card.valueClassName}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}