{ label: "Home", href: "/", faIcon: "fa-house" },

import type { NavItem } from "@/presentation/shell/AdminSidebar";

export type UserNavTone = "blue" | "cyan" | "slate";

export type UserShellNavItem = {
  label: string;
  href: string;
  faIcon: string;
  badge?: string;
  disabled?: boolean;
};

export type UserShellNavSection = {
  title: string;
  tone: UserNavTone;
  items: UserShellNavItem[];
};

export const userShellNavSections: UserShellNavSection[] = [
  {
    title: "LP Domain",
    tone: "blue",
    items: [
      
      { label: "Explore Vaults", href: "/vaults", faIcon: "fa-compass" },
      { label: "My Vaults", href: "/my/vaults", faIcon: "fa-vault" },
      { label: "Explore LP Strategies", href: "/strategies", faIcon: "fa-layer-group" },
      { label: "My LP Strategies", href: "/my/strategies", faIcon: "fa-robot" },
      { label: "LP Portfolio", href: "/portfolio", faIcon: "fa-chart-pie" },
      { label: "LP Backtest", href: "/backtest", faIcon: "fa-vial" },
    ],
  },
  {
    title: "Trade Domain",
    tone: "cyan",
    items: [
      { label: "Trade Home", href: "/tradeHome", faIcon: "fa-house" },
      {
        label: "Trade Strategies",
        href: "/trade/strategies",
        faIcon: "fa-chess-knight",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Trade Monitor",
        href: "/trade/monitor",
        faIcon: "fa-desktop",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Positions & Orders",
        href: "/trade/positions-orders",
        faIcon: "fa-list-check",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Execution Profiles",
        href: "/trade/execution-profiles",
        faIcon: "fa-gears",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Trade Portfolio",
        href: "/trade/portfolio",
        faIcon: "fa-briefcase",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Trade Backtest",
        href: "/trade/backtest",
        faIcon: "fa-flask",
        disabled: true,
        badge: "Soon",
      },
    ],
  },
  {
    title: "Resources",
    tone: "slate",
    items: [
      { label: "Learn", href: "/learn", faIcon: "fa-graduation-cap" },
      { label: "Settings", href: "/settings", faIcon: "fa-cog" },
    ],
  },
];

export const userNav: NavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Vaults", href: "/vaults", icon: "vault" },
  { label: "Strategies", href: "/strategies", icon: "strategy" },
  { label: "Trade Home", href: "/tradeHome", icon: "home" },
];

function matchesPath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getUserPageTitle(pathname: string) {
  const allItems = userShellNavSections.flatMap((section) => section.items);
  const found = allItems.find((item) => matchesPath(pathname, item.href));
  if (found) return found.label;

  if (pathname === "/") return "LP Home";
  return "Protocol User";
}