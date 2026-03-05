"use client";

import * as React from "react";
import { InfoIcon, XIcon } from "./icons";
import { CHAIN_LABEL } from "../mock";

type Props = {
  open: boolean;
  contractName: string;
  onClose: () => void;
};

export default function DeployModal({ open, contractName, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-700 bg-slate-950 px-5 py-4 rounded-t-xl">
          <div>
            <h3 className="text-lg font-bold text-white">Deploy Contract</h3>
            <p className="mt-0.5 text-xs font-mono text-cyan-400">{contractName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          <div className="flex items-start gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
            <span className="mt-0.5 text-blue-300">
              <InfoIcon size={18} />
            </span>
            <div className="text-xs text-blue-100">
              This will deploy a new instance of the contract bytecode to{" "}
              <span className="font-semibold text-white">{CHAIN_LABEL}</span>.
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">
              Deployer Wallet
            </label>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500">
                <option value="current">Current (0xAdmin...8f2a) - 4.2 ETH</option>
                <option value="multisig">Protocol Multisig</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                ▼
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">
              Initial Owner / Admin <span className="text-red-400">*</span>
            </label>
            <input
              defaultValue="0xAdmin...8f2a"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <p className="mt-1 text-[10px] text-slate-500">
              The address that will have admin privileges on the new contract.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950 p-3">
            <span className="text-xs text-slate-400">Estimated Gas</span>
            <span className="text-sm font-mono text-slate-200">
              ~0.042 ETH <span className="text-slate-500">($85.20)</span>
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-700 bg-slate-950/80 px-5 py-4 rounded-b-xl">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white hover:from-blue-500 hover:to-cyan-400"
          >
            Deploy Now
          </button>
        </div>
      </div>
    </div>
  );
}