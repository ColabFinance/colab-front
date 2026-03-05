export type Strategy = {
  strategyId: number;
  adapter: string;
  dexRouter: string;
  token0: string;
  token1: string;
  name: string;
  description: string;
  active: boolean;
};