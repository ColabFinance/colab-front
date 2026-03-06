import { StrategiesExploreItem, StrategyRisk, StrategyType } from "./types";

export const RISK_OPTIONS: { value: StrategyRisk | "all"; label: string }[] = [
  { value: "all", label: "All risk" },
  { value: "low", label: "Low risk" },
  { value: "medium", label: "Medium risk" },
  { value: "high", label: "High risk" },
];

export const TYPE_OPTIONS: { value: StrategyType | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "delta_neutral", label: "Delta neutral" },
  { value: "momentum", label: "Momentum" },
  { value: "stable_compound", label: "Stable compound" },
  { value: "mean_reversion", label: "Mean reversion" },
  { value: "passive", label: "Passive" },
  { value: "custom", label: "Custom" },
];

function s(i: number): string {
  return String(i).padStart(2, "0");
}

export const MOCK_STRATEGIES: StrategiesExploreItem[] = [
  {
    id: "strat_dn_lp_v3",
    name: "Delta Neutral LP",
    code: "DN-LP-V3",
    description:
      "Maintains market neutral position on V3 pools by hedging inventory risk via lending/borrowing legs.",
    risk: "low",
    type: "delta_neutral",
    vaults: 42,
    aprPct: 12.4,
    apyPct: 14.8,
    tvlUsd: 12_450_000,
    tags: ["v3", "hedged", "neutral"],
    updatedAtLabel: "Updated 2h ago",
  },
  {
    id: "strat_mom_reb_v1",
    name: "Momentum Rebalance",
    code: "MOM-REB-V1",
    description:
      "Adjusts ranges based on short-term momentum and volatility. Trades off rebalances vs. performance.",
    risk: "medium",
    type: "momentum",
    vaults: 18,
    aprPct: 24.1,
    apyPct: 28.5,
    tvlUsd: 4_120_000,
    tags: ["v3", "momentum"],
    updatedAtLabel: "Updated 1d ago",
  },
  {
    id: "strat_stb_cmp_v2",
    name: "Stable Auto-Compounder",
    code: "STB-CMP-V2",
    description:
      "Optimized for stable pairs. Auto-compounds at optimal intervals and keeps ranges stable.",
    risk: "low",
    type: "stable_compound",
    vaults: 86,
    aprPct: 5.2,
    apyPct: 5.8,
    tvlUsd: 35_900_000,
    tags: ["stable", "compound"],
    updatedAtLabel: "Updated 3d ago",
  },
  {
    id: "strat_mn_rev_alpha",
    name: "Mean Reversion",
    code: "MN-REV-ALPHA",
    description:
      "Aggressive strategy betting on price returning to a moving average. High variance profile.",
    risk: "high",
    type: "mean_reversion",
    vaults: 12,
    aprPct: 45.8,
    apyPct: 62.1,
    tvlUsd: 1_080_000,
    tags: ["alpha", "aggressive"],
    updatedAtLabel: "Updated 5d ago",
  },
  {
    id: "strat_wrp_pass_v1",
    name: "Wide Range Passive",
    code: "WRP-PASS-V1",
    description:
      "Very wide ranges to reduce rebalancing costs and minimize position churn during noise.",
    risk: "low",
    type: "passive",
    vaults: 58,
    aprPct: 8.5,
    apyPct: 9.2,
    tvlUsd: 9_700_000,
    tags: ["passive", "wide"],
    updatedAtLabel: "Updated 1w ago",
  },

  // fill to 24 (mock)
  ...Array.from({ length: 19 }).map((_, idx) => {
    const i = idx + 6;
    const risk: StrategyRisk = i % 7 === 0 ? "high" : i % 3 === 0 ? "medium" : "low";
    const type: StrategyType =
      i % 5 === 0 ? "custom" : i % 4 === 0 ? "passive" : i % 3 === 0 ? "momentum" : "delta_neutral";

    return {
      id: `strat_mock_${s(i)}`,
      name: `Strategy ${s(i)}`,
      code: `STR-${s(i)}`,
      description:
        "Mock strategy for explore list. Replace with API data later (TVL/APR/APY/vaults).",
      risk,
      type,
      vaults: 4 + ((i * 7) % 55),
      aprPct: 4 + ((i * 11) % 46),
      apyPct: 5 + ((i * 13) % 58),
      tvlUsd: 200_000 + ((i * 975_000) % 18_500_000),
      tags: ["mock"],
      updatedAtLabel: `Updated ${i % 9 === 0 ? "2w" : i % 5 === 0 ? "5d" : "1d"} ago`,
    } satisfies StrategiesExploreItem;
  }),
];