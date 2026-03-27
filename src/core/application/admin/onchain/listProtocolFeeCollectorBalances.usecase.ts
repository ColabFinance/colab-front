import { formatUnits } from "ethers";
import { getProtocolFeeCollectorTokenInfoUseCase } from "./getProtocolFeeCollectorTokenInfo.usecase";

const STABLE_SYMBOLS = new Set(["USDC", "USDT", "DAI", "USDBC"]);

function formatApproxUsd(symbol: string, exactBalance: string) {
  if (!STABLE_SYMBOLS.has(symbol.toUpperCase())) return "—";

  const n = Number(exactBalance);
  if (!Number.isFinite(n)) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

function formatBalance(exact: string, symbol: string) {
  const n = Number(exact);
  if (!Number.isFinite(n)) return `${exact} ${symbol}`;

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 6,
  }).format(n)} ${symbol}`;
}

export async function listProtocolFeeCollectorBalancesUseCase(params: {
  trackedTokens: Array<{
    id?: string;
    tokenAddress: string;
    label?: string | null;
  }>;
}) {
  const nowLabel = new Date().toLocaleString();

  const rows = await Promise.all(
    params.trackedTokens.map(async (item) => {
      const out = await getProtocolFeeCollectorTokenInfoUseCase({
        token: item.tokenAddress,
      });

      const exactBalance = formatUnits(out.contractBalance, out.decimals);
      const totalReportedExact = formatUnits(out.totalByToken, out.decimals);

      return {
        id: item.id || item.tokenAddress.toLowerCase(),
        symbol: out.symbol,
        name: item.label?.trim() || out.symbol,
        tokenAddress: out.token,
        balanceLabel: formatBalance(exactBalance, out.symbol),
        valueUsdLabel: formatApproxUsd(out.symbol, exactBalance),
        updatedAtLabel: nowLabel,
        decimals: out.decimals,
        rawBalance: out.contractBalance,
        exactBalance,
        totalReportedRaw: out.totalByToken,
        totalReportedLabel: formatBalance(totalReportedExact, out.symbol),
      };
    })
  );

  return rows;
}