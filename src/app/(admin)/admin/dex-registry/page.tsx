import React from "react";
import { PageHeader } from "@/presentation/shell/PageHeader";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="DEX Registry" subtitle="Register DEX routers/addresses per chain." />
      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 text-slate-400">
        Stub page (UI vem no próximo HTML).
      </div>
    </div>
  );
}