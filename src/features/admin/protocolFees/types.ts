export type ProtocolFeeCollectorSummary = {
  contractName: string;
  contractAddress: string;
  contractExplorerUrl?: string;

  treasuryAddress: string;
  treasuryExplorerUrl?: string;

  feeBps: number;

  totalValueUsdLabel: string;
  totalValueDeltaLabel?: string;

  lastWithdrawalLabel: string;
  lastWithdrawalExplorerUrl?: string;
};

export type ProtocolFeeBalanceItem = {
  id: string;

  symbol: string;
  name: string;

  tokenAddress: string;
  tokenExplorerUrl?: string;

  balanceLabel: string;
  valueUsdLabel: string;

  updatedAtLabel: string;
};

export type WithdrawStatus = "success" | "pending" | "failed";

export type ProtocolFeeWithdrawHistoryItem = {
  id: string;

  txHash: string;
  txHashShort: string;
  txExplorerUrl?: string;

  tokenSymbol: string;
  amountLabel: string;

  destinationShort: string;

  status: WithdrawStatus;
  timestampLabel: string;
};