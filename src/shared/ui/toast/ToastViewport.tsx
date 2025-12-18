"use client";

import React from "react";
import { useToast } from "./useToast";

export function ToastViewport() {
  const { toasts, remove } = useToast();

  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        display: "grid",
        gap: 10,
        zIndex: 9999,
        width: 360,
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            border: "1px solid #eee",
            background: "white",
            borderRadius: 12,
            padding: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
          onClick={() => remove(t.id)}
        >
          <div style={{ fontWeight: 800 }}>{t.title}</div>
          {t.description ? (
            <div style={{ marginTop: 6, opacity: 0.85 }}>{t.description}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
