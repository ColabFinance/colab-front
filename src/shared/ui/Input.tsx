"use client";

import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  containerStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
};

export function Input({ label, containerStyle, labelStyle, style, ...props }: Props) {
  return (
    <div style={{ display: "grid", gap: 6, ...containerStyle }}>
      {label ? (
        <label style={{ fontSize: 12, color: "var(--muted)", ...labelStyle }}>
          {label}
        </label>
      ) : null}

      <input
        {...props}
        style={{
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          width: "100%",
          background: "var(--panel-2)",
          color: "var(--text)",
          outline: "none",
          ...style,
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(125, 211, 252, 0.20)";
          (e.currentTarget as HTMLInputElement).style.borderColor = "var(--border-2)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLInputElement).style.boxShadow = "none";
          (e.currentTarget as HTMLInputElement).style.borderColor = "var(--border)";
          props.onBlur?.(e);
        }}
      />
    </div>
  );
}
