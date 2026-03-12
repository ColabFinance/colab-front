import type { ContractDefinition } from "../types";
import { InfoIcon, LinkIcon } from "./icons";

type Props = {
  contract: ContractDefinition;
  chainLabel: string;
};

export default function RegisterForm({ contract, chainLabel }: Props) {
  return (
    <div className="space-y-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
        <div className="flex items-start gap-3">
          <InfoIcon size={18} className="mt-0.5 text-amber-400" />
          <div>
            <div className="text-sm font-semibold text-amber-300">
              Register mode not wired yet
            </div>
            <p className="mt-1 text-sm text-amber-100/80">
              {contract.registerDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Chain
          </label>
          <input
            type="text"
            value={chainLabel}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Contract Address <span className="text-red-400">*</span>
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="0x..."
              disabled
              className="min-w-0 flex-1 cursor-not-allowed rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 font-mono text-sm text-slate-500"
            />
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-500"
            >
              Verify On-Chain
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-800 pt-4">
        <button
          type="button"
          disabled
          className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-500"
        >
          <LinkIcon size={16} />
          Register {contract.name}
        </button>
      </div>
    </div>
  );
}