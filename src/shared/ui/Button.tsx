"use client";

import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ variant = "primary", style, disabled, ...props }: Props) {
  const base: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 700,
    lineHeight: 1,
    userSelect: "none",
    transition: "transform 120ms ease, opacity 120ms ease, background 120ms ease, border-color 120ms ease",
    outline: "none",
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(180deg, var(--panel) 0%, var(--panel-2) 100%)",
      color: "var(--text)",
      borderColor: "var(--border-2)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text)",
      borderColor: "var(--border)",
    },
  };

  const state: React.CSSProperties = disabled
    ? { opacity: 0.5 }
    : { opacity: 0.95 };

  return (
    <button
      {...props}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...state, ...style }}
      onMouseDown={(e) => {
        if (disabled) return;
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(1px)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0px)";
      }}
      onFocus={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 3px rgba(125, 211, 252, 0.25)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    />
  );
}
