import type { ContractDefinition } from "../types";
import { ContractTabIcon, InfoIcon } from "./icons";

type Props = {
  contract: ContractDefinition;
};

export default function EmptyContractState({ contract }: Props) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-12 text-center shadow-lg">
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-slate-800 bg-slate-800 shadow-inner">
        <ContractTabIcon contractKey={contract.key} size={28} className="text-slate-500" />
      </div>

      <h3 className="mb-2 text-xl font-bold text-white">No Active Contract</h3>

      <p className="mx-auto max-w-xl text-slate-400">
        No active {contract.name} record was found for the selected chain.
      </p>

      <div className="mx-auto mt-6 max-w-xl rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-4 text-left">
        <div className="flex items-start gap-3">
          <InfoIcon size={18} className="mt-0.5 text-cyan-400" />
          <div>
            <div className="text-sm font-semibold text-cyan-300">{contract.name}</div>
            <p className="mt-1 text-sm text-cyan-100/80">{contract.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}