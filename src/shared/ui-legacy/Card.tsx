"use client";

import React from "react";

export function Card({ style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        padding: 14,
        borderRadius: 14,
        border: "1px solid var(--border)",
        background: "var(--panel)",
        boxShadow: "var(--shadow)",
        maxWidth: "100%",
        ...style,
      }}
    />
  );
}
