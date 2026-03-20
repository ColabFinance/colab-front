import { StrategiesExploreItem, StrategyChain, StrategyStatus } from "./types";

export const STATUS_OPTIONS: { value: StrategyStatus | "all"; label: string }[] = [
  { value: "all", label: "All status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const CHAIN_OPTIONS: { value: StrategyChain | "all"; label: string }[] = [
  { value: "all", label: "All chains" },
  { value: "ethereum", label: "Ethereum" },
  { value: "base", label: "Base" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "polygon", label: "Polygon" },
  { value: "optimism", label: "Optimism" },
];

function pad(i: number) {
  return String(i).padStart(2, "0");
}

export const MOCK_STRATEGIES: StrategiesExploreItem[] = [
  {
    id: "1",
    strategyIdLabel: "strat_42a1",
    name: "Delta Neutral LP",
    code: "DN-LP-V3",
    indicatorSetName: "Momentum + RSI",
    indicatorSetCode: "ind_set_7",
    chain: "ethereum",
    status: "active",
    linkedVault: true,
    linkedVaultLabel: "Linked",
    updatedAtLabel: "2h ago",
    isPublic: true,
  },
  {
    id: "2",
    strategyIdLabel: "strat_38f2",
    name: "Stable Auto-Compounder",
    code: "STB-CMP-V2",
    indicatorSetName: "Fixed Range",
    indicatorSetCode: "ind_set_2",
    chain: "ethereum",
    status: "active",
    linkedVault: false,
    updatedAtLabel: "5h ago",
    isPublic: true,
  },
  {
    id: "3",
    strategyIdLabel: "strat_29c4",
    name: "Wide Range Passive",
    code: "WRP-PASS-V1",
    indicatorSetName: "Static Wide",
    indicatorSetCode: "ind_set_1",
    chain: "base",
    status: "inactive",
    linkedVault: false,
    updatedAtLabel: "2d ago",
    isPublic: true,
  },
  {
    id: "4",
    strategyIdLabel: "strat_51d8",
    name: "Momentum Rebalance",
    code: "MOM-REB-V1",
    indicatorSetName: "MACD + Bollinger",
    indicatorSetCode: "ind_set_12",
    chain: "arbitrum",
    status: "active",
    linkedVault: true,
    linkedVaultLabel: "Linked",
    updatedAtLabel: "1d ago",
    isPublic: true,
  },
  {
    id: "5",
    strategyIdLabel: "strat_62e9",
    name: "Trend Following",
    code: "TRD-FOL-V2",
    indicatorSetName: "EMA Cross",
    indicatorSetCode: "ind_set_5",
    chain: "polygon",
    status: "active",
    linkedVault: false,
    updatedAtLabel: "3h ago",
    isPublic: true,
  },

  // private ones should never appear in Explore
  {
    id: "6",
    strategyIdLabel: "strat_priv_01",
    name: "Private Alpha Grid",
    code: "PRV-ALPHA-01",
    indicatorSetName: "ATR Bands",
    indicatorSetCode: "ind_set_21",
    chain: "base",
    status: "active",
    linkedVault: false,
    updatedAtLabel: "1h ago",
    isPublic: false,
  },

  ...Array.from({ length: 15 }).map((_, idx) => {
    const i = idx + 7;
    const chain: StrategyChain =
      i % 5 === 0
        ? "optimism"
        : i % 4 === 0
        ? "polygon"
        : i % 3 === 0
        ? "arbitrum"
        : i % 2 === 0
        ? "base"
        : "ethereum";

    const status: StrategyStatus = i % 4 === 0 ? "inactive" : "active";
    const linkedVault = i % 3 === 0;
    const isPublic = i % 6 !== 0;

    return {
      id: String(i),
      strategyIdLabel: `strat_${pad(i)}x${pad((i * 7) % 10)}`,
      name: `Strategy ${pad(i)}`,
      code: `STR-${pad(i)}`,
      indicatorSetName: i % 2 === 0 ? "Momentum Core" : "Range Logic",
      indicatorSetCode: `ind_set_${i}`,
      chain,
      status,
      linkedVault,
      linkedVaultLabel: linkedVault ? "Linked" : undefined,
      updatedAtLabel: i % 5 === 0 ? "2d ago" : i % 2 === 0 ? "6h ago" : "1d ago",
      isPublic,
    } satisfies StrategiesExploreItem;
  }),
];