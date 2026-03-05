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

        // mobile-first: ocupa quase toda largura, mas limita no desktop
        width: "calc(100vw - 32px)",
        maxWidth: 420,
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          style={{
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(10, 16, 28, 0.92)",
            backdropFilter: "blur(10px)",
            borderRadius: 12,
            padding: 12,
            boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
            cursor: "pointer",
          }}
          onClick={() => remove(t.id)}
        >
          <div
            style={{
              fontWeight: 800,
              color: "rgba(255,255,255,0.92)",
              lineHeight: 1.2,
            }}
          >
            {t.title}
          </div>

          {t.description ? (
            <div
              style={{
                marginTop: 6,
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.25,
                wordBreak: "break-word",
              }}
            >
              {t.description}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
