"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { MyVaultsTab } from "../hooks";
import { IconList, IconRobot, IconWand } from "./icons";

export function MyVaultsTabs({
  value,
  onChange,
}: {
  value: MyVaultsTab;
  onChange: (v: MyVaultsTab) => void;
}) {
  const tabBtn = (active: boolean) =>
    cn(
      "py-3 px-1 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 border-b-2",
      active
        ? "border-cyan-400 text-cyan-300"
        : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
    );

  return (
    <div className="border-b border-slate-800">
      <div className="flex gap-8 overflow-x-auto">
        <button type="button" onClick={() => onChange("list")} className={tabBtn(value === "list")}>
          <IconList className="h-4 w-4" />
          My Vaults List
        </button>

        <button type="button" onClick={() => onChange("create")} className={tabBtn(value === "create")}>
          <IconWand className="h-4 w-4" />
          Create/Register Vault
        </button>

        <button type="button" onClick={() => onChange("automation")} className={tabBtn(value === "automation")}>
          <IconRobot className="h-4 w-4" />
          Automation (Basic)
        </button>
      </div>
    </div>
  );
}