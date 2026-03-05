"use client";

import * as React from "react";
import { CheckIcon, XIcon } from "./icons";

type Props = {
  open: boolean;
  contractName: string;
  onClose: () => void;
};

export default function RegisterModal({ open, contractName, onClose }: Props) {
  const [address, setAddress] = React.useState("");
  const [verified, setVerified] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setAddress("");
      setVerified(false);
    }
  }, [open]);

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
            <h3 className="text-lg font-bold text-white">Register Existing Contract</h3>
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
          <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
            <p className="text-xs leading-relaxed text-slate-400">
              Registering an existing contract will link it to the Protocol Admin Dashboard.
              The system will verify the contract bytecode matches the expected version.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">
              Contract Address <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <button
                onClick={() => setVerified(true)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm font-medium text-slate-200 hover:border-cyan-500/50 hover:text-white"
              >
                Verify
              </button>
            </div>
          </div>

          {verified && (
            <div className="flex items-center gap-3 rounded-lg border border-green-500/25 bg-green-500/10 p-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-slate-950">
                <CheckIcon size={16} />
              </span>
              <div>
                <div className="text-xs font-bold text-green-400">Verification Successful</div>
                <div className="text-[10px] text-green-300/70">
                  Bytecode matches v1.2.4 • Owner: 0xAdmin...8f2a
                </div>
              </div>
            </div>
          )}
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
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
            disabled={!verified}
          >
            Confirm Registration
          </button>
        </div>
      </div>
    </div>
  );
}