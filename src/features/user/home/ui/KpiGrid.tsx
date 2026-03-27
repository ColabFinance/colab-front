import React from "react";
import type { HomeKpi } from "../types";

function inferFaIcon(k: HomeKpi): string {
  const anyK = k as any;

  // se você já quiser mandar "fa-solid fa-sack-dollar" direto no hook:
  if (typeof anyK.icon === "string" && anyK.icon.trim()) return anyK.icon;

  const id = String((k as any).id ?? "").toLowerCase();
  const label = String((k as any).label ?? "").toLowerCase();

  const key = `${id} ${label}`;

  if (key.includes("tvl")) return "fa-solid fa-sack-dollar";
  if (key.includes("vault")) return "fa-solid fa-vault";
  if (key.includes("strateg")) return "fa-solid fa-chess-knight";
  if (key.includes("fee")) return "fa-solid fa-coins";
  if (key.includes("apy") || key.includes("apr") || key.includes("percent")) return "fa-solid fa-percent";
  if (key.includes("health")) return "fa-solid fa-heart-pulse";

  return "fa-solid fa-circle";
}

function isHealth(k: HomeKpi) {
  const id = String((k as any).id ?? "").toLowerCase();
  const label = String((k as any).label ?? "").toLowerCase();
  return id.includes("health") || label.includes("health");
}

function toneStyles(tone?: HomeKpi["tone"]) {
  if (tone === "blue")
    return {
      card: "hover:border-blue-500/30",
      iconWrap: "bg-blue-500/10 text-blue-400",
      valueHover: "group-hover:text-blue-400",
    };

  if (tone === "cyan")
    return {
      card: "hover:border-cyan-500/30",
      iconWrap: "bg-cyan-500/10 text-cyan-400",
      valueHover: "group-hover:text-cyan-400",
    };

  if (tone === "purple")
    return {
      card: "hover:border-purple-500/30",
      iconWrap: "bg-purple-500/10 text-purple-400",
      valueHover: "group-hover:text-purple-400",
    };

  if (tone === "green")
    return {
      card: "hover:border-green-500/30",
      iconWrap: "bg-green-500/10 text-green-400",
      valueHover: "group-hover:text-green-400",
    };

  if (tone === "amber")
    return {
      card: "hover:border-yellow-500/30",
      iconWrap: "bg-yellow-500/10 text-yellow-400",
      valueHover: "group-hover:text-yellow-400",
    };

  return {
    card: "hover:border-slate-600",
    iconWrap: "bg-slate-800 text-slate-300",
    valueHover: "",
  };
}

export function KpiGrid({ items }: { items: HomeKpi[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      {items.map((k) => {
        const s = toneStyles(k.tone);
        const faIcon = inferFaIcon(k);

        return (
          <div
            key={(k as any).id ?? k.label}
            className={[
              "bg-slate-900 border border-slate-700 rounded-xl p-3 md:p-4 transition-colors group",
              s.card,
            ].join(" ")}
          >
            <div className="flex justify-between items-start mb-2">
              <div className={["p-1.5 md:p-2 rounded-lg", s.iconWrap].join(" ")}>
                <i className={[faIcon, "text-xs md:text-base"].join(" ")} aria-hidden="true" />
              </div>

              {k.deltaLabel && (
                <span className="text-[9px] md:text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20">
                  {k.deltaLabel}
                </span>
              )}
            </div>

            <div className="text-slate-400 text-[10px] md:text-xs font-medium mb-1">{k.label}</div>

            {isHealth(k) ? (
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-white text-base md:text-lg font-bold tracking-tight">{k.value}</span>
              </div>
            ) : (
              <div className={["text-white text-base md:text-lg font-bold tracking-tight transition-colors", s.valueHover].join(" ")}>
                {k.value}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}