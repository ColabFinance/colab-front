"use client";

import React, { useState } from "react";
import { cn } from "@/shared/utils/cn";
import { Icon } from "@/presentation/icons/Icon";

export function AddressPill({
  address,
  className,
  withCopy = true,
}: {
  address: string;
  className?: string;
  withCopy?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const short = address.length > 10 ? `${address.slice(0, 4)}...${address.slice(-4)}` : address;

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 800);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={withCopy ? onCopy : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-900/60 px-2 py-1 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors",
        className
      )}
      title={withCopy ? "Copy address" : undefined}
    >
      <span>{short}</span>
      {withCopy && <Icon name="copy" className="h-3.5 w-3.5 opacity-80" />}
      {copied && <span className="ml-1 text-[10px] text-cyan-300">copied</span>}
    </button>
  );
}