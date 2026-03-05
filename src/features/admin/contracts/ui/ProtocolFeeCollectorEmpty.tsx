"use client";

import * as React from "react";
import { LinkIcon, RocketIcon } from "./icons";

type Props = {
  onDeploy: () => void;
  onRegister: () => void;
};

export default function ProtocolFeeCollectorEmpty({ onDeploy, onRegister }: Props) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-12 text-center shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-800 shadow-inner">
        <span className="text-3xl text-slate-500">📝</span>
      </div>

      <h3 className="mb-2 text-xl font-bold text-white">Contract Not Configured</h3>
      <p className="mx-auto mb-8 max-w-md text-slate-400">
        ProtocolFeeCollector is missing on this chain. You need to deploy or register an existing
        contract to enable fee collection.
      </p>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          onClick={onDeploy}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 font-medium text-white shadow-lg hover:from-blue-500 hover:to-cyan-400"
        >
          <RocketIcon size={18} />
          Deploy New
        </button>

        <button
          onClick={onRegister}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-6 py-2.5 font-medium text-slate-200 hover:border-cyan-500/50 hover:text-white"
        >
          <LinkIcon size={18} />
          Register Existing
        </button>
      </div>
    </div>
  );
}