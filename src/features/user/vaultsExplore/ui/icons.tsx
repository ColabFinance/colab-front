import React from "react";
import { cn } from "@/shared/utils/cn";

type Props = { className?: string };

export function StarIcon({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-4 w-4", className)}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 17.27l-5.18 3.04 1.4-5.93L3 9.24l6.06-.52L12 3l2.94 5.72 6.06.52-5.22 5.14 1.4 5.93L12 17.27z" />
    </svg>
  );
}

export function CopyIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 8h12v12H8z" />
      <path d="M4 16H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

export function ListIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

export function GridIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h7v7H4z" />
      <path d="M13 4h7v7h-7z" />
      <path d="M4 13h7v7H4z" />
      <path d="M13 13h7v7h-7z" />
    </svg>
  );
}