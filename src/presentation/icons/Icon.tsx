import React from "react";
import { cn } from "@/shared/utils/cn";

export type IconName =
  | "chart"
  | "network"
  | "contract"
  | "atlas"
  | "water"
  | "plug"
  | "sliders"
  | "fees"
  | "home"
  | "vault"
  | "strategy"
  | "bell"
  | "gear"
  | "search"
  | "chevronDown"
  | "external"
  | "copy"
  | "rocket"
  | "heart"
  | "clock"
  | "warning"
  | "check"
  | "layerGroup";

type Props = {
  name: IconName;
  className?: string;
};

function Svg({
  children,
  className,
  viewBox = "0 0 24 24",
}: {
  children: React.ReactNode;
  className?: string;
  viewBox?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      className={cn("h-5 w-5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function Icon({ name, className }: Props) {
  switch (name) {
    case "chart":
      return (
        <Svg className={className}>
          <path d="M3 3v18h18" />
          <path d="M7 14l4-4 3 3 6-7" />
        </Svg>
      );
    case "network":
      return (
        <Svg className={className}>
          <circle cx="6" cy="6" r="2" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="12" cy="18" r="2" />
          <path d="M8 6h8" />
          <path d="M7.5 7.5l3 7" />
          <path d="M16.5 7.5l-3 7" />
        </Svg>
      );
    case "contract":
      return (
        <Svg className={className}>
          <path d="M7 3h10v18H7z" />
          <path d="M9 7h6" />
          <path d="M9 11h6" />
          <path d="M9 15h4" />
        </Svg>
      );
    case "atlas":
      return (
        <Svg className={className}>
          <path d="M4 19a2 2 0 0 0 2 2h12" />
          <path d="M6 21V5a2 2 0 0 1 2-2h10v16H8a2 2 0 0 0-2 2z" />
          <path d="M10 7h6" />
        </Svg>
      );
    case "water":
      return (
        <Svg className={className}>
          <path d="M12 2s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z" />
        </Svg>
      );
    case "plug":
      return (
        <Svg className={className}>
          <path d="M9 2v6" />
          <path d="M15 2v6" />
          <path d="M7 8h10" />
          <path d="M12 8v6a4 4 0 0 1-4 4H7" />
        </Svg>
      );
    case "sliders":
      return (
        <Svg className={className}>
          <path d="M4 21v-7" />
          <path d="M4 10V3" />
          <path d="M12 21v-9" />
          <path d="M12 8V3" />
          <path d="M20 21v-5" />
          <path d="M20 12V3" />
          <path d="M2 14h4" />
          <path d="M10 8h4" />
          <path d="M18 16h4" />
        </Svg>
      );
    case "fees":
      return (
        <Svg className={className}>
          <path d="M12 1v22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
        </Svg>
      );
    case "home":
      return (
        <Svg className={className}>
          <path d="M3 11l9-8 9 8" />
          <path d="M5 10v10h14V10" />
        </Svg>
      );
    case "vault":
      return (
        <Svg className={className}>
          <rect x="3" y="7" width="18" height="14" rx="2" />
          <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
          <circle cx="12" cy="14" r="2" />
          <path d="M12 16v2" />
        </Svg>
      );
    case "strategy":
      return (
        <Svg className={className}>
          <path d="M4 20V6" />
          <path d="M4 6l4 4 4-8 4 8 4-4v14" />
        </Svg>
      );
    case "bell":
      return (
        <Svg className={className}>
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </Svg>
      );
    case "gear":
      return (
        <Svg className={className}>
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.04.04-1.7 2.94-.05-.02a1.7 1.7 0 0 0-2.07.65l-.02.05H8.06l-.02-.05a1.7 1.7 0 0 0-2.07-.65l-.05.02-1.7-2.94.04-.04A1.7 1.7 0 0 0 4.6 15l-.05-.02V9.02l.05-.02A1.7 1.7 0 0 0 4.26 7.13l-.04-.04 1.7-2.94.05.02a1.7 1.7 0 0 0 2.07-.65l.02-.05h7.88l.02.05a1.7 1.7 0 0 0 2.07.65l.05-.02 1.7 2.94-.04.04A1.7 1.7 0 0 0 19.4 9l.05.02v5.96z" />
        </Svg>
      );
    case "search":
      return (
        <Svg className={className}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </Svg>
      );
    case "chevronDown":
      return (
        <Svg className={className}>
          <path d="M6 9l6 6 6-6" />
        </Svg>
      );
    case "external":
      return (
        <Svg className={className}>
          <path d="M14 3h7v7" />
          <path d="M10 14L21 3" />
          <path d="M21 14v7H3V3h7" />
        </Svg>
      );
    case "copy":
      return (
        <Svg className={className}>
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <rect x="2" y="2" width="13" height="13" rx="2" />
        </Svg>
      );
    case "rocket":
      return (
        <Svg className={className}>
          <path d="M5 13l4 6 2-4 4-2 6-4-6-6-4 6-2 4-4 2z" />
        </Svg>
      );
    case "heart":
      return (
        <Svg className={className}>
          <path d="M20 13c-2 6-8 9-8 9s-6-3-8-9" />
          <path d="M3.5 10.5l3-3 3 3 3-6 3 6 3-3 3 3" />
        </Svg>
      );
    case "clock":
      return (
        <Svg className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6l4 2" />
        </Svg>
      );
    case "warning":
      return (
        <Svg className={className}>
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.3 3.6L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0z" />
        </Svg>
      );
    case "check":
      return (
        <Svg className={className}>
          <path d="M20 6L9 17l-5-5" />
        </Svg>
      );
    case "layerGroup":
      return (
        <Svg className={className}>
          <path d="M12 2l9 5-9 5-9-5 9-5z" />
          <path d="M3 12l9 5 9-5" />
          <path d="M3 17l9 5 9-5" />
        </Svg>
      );
    default:
      return <span className={cn("inline-block h-5 w-5", className)} />;
  }
}