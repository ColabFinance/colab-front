import Link from "next/link";
import type { OperationalWarning } from "../types";
import { ActionBadge } from "@/presentation/components/ActionBadge";

type Props = {
  warnings: OperationalWarning[];
};

const toneClassMap: Record<
  OperationalWarning["tone"],
  {
    wrapper: string;
    title: string;
    body: string;
    button: string;
    icon: string;
  }
> = {
  red: {
    wrapper: "bg-red-500/5 border border-red-500/20",
    title: "text-red-400",
    body: "text-red-300/80",
    button: "text-red-400 hover:text-red-300",
    icon: "fa-solid fa-triangle-exclamation text-red-400",
  },
  orange: {
    wrapper: "bg-orange-500/5 border border-orange-500/20",
    title: "text-orange-400",
    body: "text-orange-300/80",
    button: "text-orange-400 hover:text-orange-300",
    icon: "fa-solid fa-exclamation-circle text-orange-400",
  },
  yellow: {
    wrapper: "bg-yellow-500/5 border border-yellow-500/20",
    title: "text-yellow-400",
    body: "text-yellow-300/80",
    button: "text-yellow-400 hover:text-yellow-300",
    icon: "fa-solid fa-power-off text-yellow-400",
  },
  blue: {
    wrapper: "bg-blue-500/5 border border-blue-500/20",
    title: "text-blue-400",
    body: "text-blue-300/80",
    button: "text-blue-400 hover:text-blue-300",
    icon: "fa-solid fa-clock text-blue-400",
  },
};

export function OperationalWarningsPanel({ warnings }: Props) {
  if (!warnings.length) {
    return null;
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
      <div className="p-4 border-b border-slate-700">
        <h3 className="font-bold text-white text-lg">Operational Warnings</h3>
      </div>

      <div className="p-6 space-y-4">
        {warnings.map((warning) => {
          const tone = toneClassMap[warning.tone];

          return (
            <div
              key={warning.id}
              className={`rounded-lg p-4 flex items-start gap-3 ${tone.wrapper}`}
            >
              <div className="flex-shrink-0">
                <i className={`${tone.icon} text-xl`} />
              </div>

              <div className="flex-1">
                <h4 className={`text-sm font-bold mb-1 ${tone.title}`}>{warning.title}</h4>
                <p className={`text-xs mb-2 ${tone.body}`}>{warning.description}</p>
                <ActionBadge href={warning.href} label={warning.ctaLabel} tone={warning.tone} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}