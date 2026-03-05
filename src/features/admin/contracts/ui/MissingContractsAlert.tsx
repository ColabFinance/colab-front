"use client";

import * as React from "react";
import { AlertTriangleIcon } from "./icons";
import { CHAIN_LABEL } from "../mock";

type Props = {
  missingNames: string[];
  onResolve: () => void;
};

export default function MissingContractsAlert({ missingNames, onResolve }: Props) {
  if (!missingNames.length) return null;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-amber-500/30 bg-slate-900 p-4 shadow-lg md:flex-row md:items-center md:p-6">
      <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-3 text-amber-400">
        <AlertTriangleIcon size={20} />
      </div>

      <div className="flex-1">
        <h3 className="text-base font-semibold text-white">Missing Protocol Contracts</h3>
        <p className="mt-1 text-sm text-slate-400">
          The following core contracts have not been deployed or registered on{" "}
          <span className="font-medium text-slate-200">{CHAIN_LABEL}</span>:
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {missingNames.map((n) => (
            <span
              key={n}
              className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-200"
            >
              <span className="text-slate-500">▢</span>
              {n}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={onResolve}
        className="whitespace-nowrap rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 hover:bg-amber-500/20"
      >
        Resolve Now
      </button>
    </div>
  );
}