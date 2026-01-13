export type ChainKey = "base" | "bnb";

export type AppChain = {
  key: ChainKey;
  id: number;
  name: string;
  network: string;
  nativeCurrency: { name: string; symbol: string; decimals: 18 };
  rpcUrls: { default: { http: string[] } };
};

// Catálogo das chains que você suporta no app.
// Hoje você vai usar só BASE, mas o catálogo já nasce pronto.
export const CHAINS: Record<ChainKey, Omit<AppChain, "rpcUrls">> = {
  base: {
    key: "base",
    id: 8453,
    name: "Base",
    network: "base",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  bnb: {
    key: "bnb",
    id: 56,
    name: "BNB Chain",
    network: "bsc",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  },
};
