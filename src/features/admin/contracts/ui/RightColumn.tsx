"use client";

import * as React from "react";
import { ChevronRightIcon, PlusIcon } from "./icons";
import { GlobalContract } from "../types";

type Props = {
  contract: GlobalContract;
};

export default function RightColumn({ contract }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-lg">
        <h3 className="mb-4 text-sm font-bold text-white">Contract Actions</h3>
        <div className="space-y-3">
          <button className="group w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-left transition-all hover:border-cyan-500/30 hover:bg-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 group-hover:border-cyan-500/50">
                  <span className="text-cyan-400">
                    <PlusIcon size={16} />
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200 group-hover:text-white">
                    Register Strategy
                  </div>
                  <div className="text-[10px] text-slate-500">Add new logic contract</div>
                </div>
              </div>
              <span className="text-slate-600 group-hover:text-cyan-400">
                <ChevronRightIcon size={16} />
              </span>
            </div>
          </button>

          <button className="group w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-left transition-all hover:border-red-500/30 hover:bg-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 group-hover:border-red-500/50">
                  <span className="text-red-400">⛔</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200 group-hover:text-white">
                    Pause Registry
                  </div>
                  <div className="text-[10px] text-slate-500">Emergency stop</div>
                </div>
              </div>
              <span className="text-slate-600 group-hover:text-red-400">
                <ChevronRightIcon size={16} />
              </span>
            </div>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-lg">
        <h3 className="mb-4 text-sm font-bold text-white">Deployment Info</h3>
        <ul className="space-y-4">
          {(contract.timeline ?? []).map((t, idx) => {
            const dot =
              t.kind === "success"
                ? "bg-green-500"
                : "bg-blue-500";

            return (
              <li
                key={`${t.title}-${idx}`}
                className="relative border-l border-slate-700 pl-6 pb-4 last:border-0 last:pb-0"
              >
                <div
                  className={`absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full ${dot} border-2 border-slate-900`}
                />
                <div className="text-xs text-slate-400">{t.title}</div>
                <div className="mt-0.5 text-sm font-medium text-slate-200">{t.subtitle}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}