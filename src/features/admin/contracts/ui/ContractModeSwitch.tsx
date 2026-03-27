import type { ContractMode } from "../types";
import { LinkIcon, RocketIcon } from "./icons";

type Props = {
  contractName: string;
  activeMode: ContractMode;
  onChange: (mode: ContractMode) => void;
};

export default function ContractModeSwitch({
  contractName,
  activeMode,
  onChange,
}: Props) {
  return (
    <div className="inline-flex w-fit gap-2 rounded-lg border border-slate-800 bg-slate-900 p-1">
      <button
        type="button"
        onClick={() => onChange("deploy")}
        className={[
          "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
          activeMode === "deploy"
            ? "bg-cyan-600 text-white"
            : "border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200",
        ].join(" ")}
      >
        <RocketIcon size={16} />
        <span>Deploy New {contractName}</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("register")}
        className={[
          "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
          activeMode === "register"
            ? "bg-cyan-600 text-white"
            : "border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200",
        ].join(" ")}
      >
        <LinkIcon size={16} />
        <span>Register Existing {contractName}</span>
      </button>
    </div>
  );
}