import React from "react";
import { Surface } from "@/presentation/components/Surface";
import type { HomeSnapshot } from "../types";

function valueToneClass(tone?: "white" | "green" | "cyan" | "blue") {
  if (tone === "green") return "text-green-300";
  if (tone === "cyan") return "text-cyan-300";
  if (tone === "blue") return "text-blue-300";
  return "text-white";
}

export function MySnapshot({ data }: { data: HomeSnapshot }) {
  return (
    <Surface variant="panel" className="p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative">
        {data.items.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="text-slate-400 text-xs font-medium">{item.label}</div>
            <div className={`text-2xl font-bold ${valueToneClass(item.tone)}`}>{item.value}</div>
            <div className="text-[10px] text-slate-500">{item.hint || "—"}</div>
          </div>
        ))}
      </div>
    </Surface>
  );
}