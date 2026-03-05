import type { NavItem } from "@/presentation/shell/Sidebar";

export const adminNav: NavItem[] = [
  { label: "Admin Overview", href: "/admin", icon: "chart" },
  { label: "Chains & Env", href: "/admin/chains", icon: "network" },
  { label: "Global Contracts", href: "/admin/contracts", icon: "contract" },
  { label: "DEX Registry", href: "/admin/dex-registry", icon: "atlas" },
  { label: "DEX Pools", href: "/admin/pools", icon: "water" },
  { label: "Adapters", href: "/admin/adapters", icon: "plug" },
  { label: "On-chain Config", href: "/admin/onchain-config", icon: "sliders" },
  { label: "Protocol Fees", href: "/admin/protocol-fees", icon: "fees" },
];