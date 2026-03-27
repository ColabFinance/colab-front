"use client";

import React, { useEffect } from "react";

type DrawerShellProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function DrawerShell({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: DrawerShellProps) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[99] bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-[100] flex w-full justify-end">
        <div className="h-full w-full max-w-xl border-l border-slate-800 bg-slate-900 shadow-2xl">
          <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-800 bg-slate-900 px-6 py-5">
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              {subtitle ? <p className="mt-1 text-xs text-slate-400">{subtitle}</p> : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-400 transition hover:border-slate-700 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="max-h-[calc(100vh-140px)] overflow-y-auto px-6 py-6">
            {children}
          </div>

          {footer ? (
            <div className="sticky bottom-0 border-t border-slate-800 bg-slate-900 px-6 py-5">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}