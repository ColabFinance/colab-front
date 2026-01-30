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
        <label style={{ fontSize: 12, color: "#444", ...labelStyle }}>
          {label}
        </label>
      ) : null}

      <input
        {...props}
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #ddd",
          width: "100%",
          ...style,
        }}
      />
    </div>
  );
}
