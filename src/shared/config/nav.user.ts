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
      { label: "LP Home", href: "/", faIcon: "fa-house" },
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
      { label: "Trade Strategies", href: "/trade/strategies", faIcon: "fa-chess-knight" },
      { label: "Trade Monitor", href: "/trade/monitor", faIcon: "fa-desktop" },
      { label: "Positions & Orders", href: "/trade/positions-orders", faIcon: "fa-list-check" },
      { label: "Execution Profiles", href: "/trade/execution-profiles", faIcon: "fa-gears" },
      { label: "Trade Portfolio", href: "/trade/portfolio", faIcon: "fa-briefcase" },
      { label: "Trade Backtest", href: "/trade/backtest", faIcon: "fa-flask" },
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
  { label: "LP Home", href: "/", icon: "home" },
  { label: "Vaults", href: "/vaults", icon: "vault" },
  { label: "Strategies", href: "/strategies", icon: "strategy" },
  { label: "Trade Home", href: "/tradeHome", icon: "home" },
  { label: "Trade Strategies", href: "/trade/strategies", icon: "strategy" },
  { label: "Trade Monitor", href: "/trade/monitor", icon: "chart" },
  { label: "Positions & Orders", href: "/trade/positions-orders", icon: "chart" },
  { label: "Execution Profiles", href: "/trade/execution-profiles", icon: "chart" },
  { label: "Trade Portfolio", href: "/trade/portfolio", icon: "chart" },
  { label: "Trade Backtest", href: "/trade/backtest", icon: "chart" },
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