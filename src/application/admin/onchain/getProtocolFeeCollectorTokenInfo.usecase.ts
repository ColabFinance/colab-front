import { Contract } from "ethers";
import { getReadProvider } from "@/infra/evm/provider";
import { getProtocolFeeCollectorRead } from "@/infra/evm/contracts/protocolFeeCollector";

const ERC20_MIN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

function getContractAddress(c: any): string {
  return (c?.target as string) || (c?.address as string);
}

export async function getProtocolFeeCollectorTokenInfoUseCase(params: { token: string }) {
  const token = (params.token || "").trim();
  if (!token) throw new Error("Missing token address.");

  const pfc = await getProtocolFeeCollectorRead();
  const pfcAddr = getContractAddress(pfc);
  if (!pfcAddr) throw new Error("Failed to resolve ProtocolFeeCollector address.");

  const provider = await getReadProvider();
  const erc20 = new Contract(token, ERC20_MIN_ABI, provider);

  const [contractBalance, totalByToken] = await Promise.all([
    erc20.balanceOf(pfcAddr),
    pfc.totalByToken(token),
  ]);

  let decimals = 18;
  let symbol = "TOKEN";
  try {
    decimals = Number(await erc20.decimals());
  } catch {}
  try {
    symbol = String(await erc20.symbol());
  } catch {}

  return {
    pfc: pfcAddr,
    token,
    symbol,
    decimals,
    contractBalance: contractBalance.toString(),
    totalByToken: totalByToken.toString(),
  };
}
