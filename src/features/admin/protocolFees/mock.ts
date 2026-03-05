import {
  ProtocolFeeBalanceItem,
  ProtocolFeeCollectorSummary,
  ProtocolFeeWithdrawHistoryItem,
} from "./types";

export const MOCK_COLLECTOR: ProtocolFeeCollectorSummary = {
  contractName: "ProtocolFeeCollector",
  contractAddress: "0x8a7b000000000000000000000000000000003b92",
  contractExplorerUrl: "#",

  treasuryAddress: "0xTre000000000000000000000000000000000sury",
  treasuryExplorerUrl: "#",

  feeBps: 500,

  totalValueUsdLabel: "$42,853.12",
  totalValueDeltaLabel: "+2.4% (24h)",

  lastWithdrawalLabel: "2 days ago",
  lastWithdrawalExplorerUrl: "#",
};

export const MOCK_BALANCES: ProtocolFeeBalanceItem[] = [
  {
    id: "bal_weth",
    symbol: "WETH",
    name: "Wrapped Ether",
    tokenAddress: "0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2",
    tokenExplorerUrl: "#",
    balanceLabel: "12.4502",
    valueUsdLabel: "$28,450.12",
    updatedAtLabel: "2 mins ago",
  },
  {
    id: "bal_usdc",
    symbol: "USDC",
    name: "USD Coin",
    tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    tokenExplorerUrl: "#",
    balanceLabel: "14,205.00",
    valueUsdLabel: "$14,205.00",
    updatedAtLabel: "5 mins ago",
  },
  {
    id: "bal_wbtc",
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    tokenAddress: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    tokenExplorerUrl: "#",
    balanceLabel: "0.0045",
    valueUsdLabel: "$198.00",
    updatedAtLabel: "1 hour ago",
  },
];

export const MOCK_WITHDRAW_HISTORY: ProtocolFeeWithdrawHistoryItem[] = [
  {
    id: "wh_1",
    txHash: "0x5d2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa8a1c",
    txHashShort: "0x5d2...8a1c",
    txExplorerUrl: "#",
    tokenSymbol: "WETH",
    amountLabel: "5.0000",
    destinationShort: "0xTre...sury",
    status: "success",
    timestampLabel: "2 days ago",
  },
  {
    id: "wh_2",
    txHash: "0x1a4bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb29f",
    txHashShort: "0x1a4...b29f",
    txExplorerUrl: "#",
    tokenSymbol: "USDC",
    amountLabel: "50,000.00",
    destinationShort: "0xTre...sury",
    status: "success",
    timestampLabel: "5 days ago",
  },
];