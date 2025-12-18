"use client";

import React from "react";

export function Card({ style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        padding: 14,
        borderRadius: 12,
        border: "1px solid #eee",
        ...style,
      }}
    />
  );
}
