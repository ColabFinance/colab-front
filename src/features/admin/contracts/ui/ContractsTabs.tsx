import type { ContractTabKey } from "../types";
import { ContractTabIcon } from "./icons";

type TabItem = {
  key: ContractTabKey;
  label: string;
  missing: boolean;
};

type Props = {
  active: ContractTabKey;
  tabs: TabItem[];
  onChange: (key: ContractTabKey) => void;
};

export default function ContractsTabs({ active, tabs, onChange }: Props) {
  return (
    <div className="border-b border-slate-800">
      <nav className="-mb-px flex gap-2 overflow-x-auto" aria-label="Contract tabs">
        {tabs.map((tab) => {
          const isActive = tab.key === active;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={[
                "inline-flex items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-4 text-sm font-medium transition-colors",
                isActive
                  ? "border-b-2 border-cyan-400 bg-cyan-500/5 text-cyan-400"
                  : "border-b-2 border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200",
              ].join(" ")}
            >
              <ContractTabIcon contractKey={tab.key} size={16} />
              <span>{tab.label}</span>

              {tab.missing ? (
                <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
              ) : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}