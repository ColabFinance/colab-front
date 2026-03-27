"use client";

import React, { createContext, useCallback, useMemo, useState } from "react";

export type ToastItem = { id: string; title: string; description?: string };

type Ctx = {
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, "id">) => void;
  remove: (id: string) => void;
};

export const ToastContext = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const item: ToastItem = { id, ...t };
    setToasts((prev) => [item, ...prev]);
    setTimeout(() => remove(id), 3500);
  }, [remove]);

  const value = useMemo(() => ({ toasts, push, remove }), [toasts, push, remove]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
