export type VaultFeeBufferBalances = {
  vault: string;
  feeBufferAddress: string;

  token0: {
    address: string;
    symbol: string;
    decimals: number;
    raw: string;      // uint256 string
    formatted: string; // human string
  };

  token1: {
    address: string;
    symbol: string;
    decimals: number;
    raw: string;
    formatted: string;
  };

  reward?: {
    address: string;
    symbol: string;
    decimals: number;
    raw: string;
    formatted: string;
  };

  fetchedAtMs: number;
};
