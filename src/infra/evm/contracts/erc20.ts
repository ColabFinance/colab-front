import { Contract, type Signer, isAddress } from "ethers";
import { getReadProvider } from "@/infra/evm/provider";

export const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function transfer(address to, uint256 value) returns (bool)",
] as const;

export function getErc20Contract(params: { tokenAddress: string; signer?: Signer }) {
  const addr = (params.tokenAddress || "").trim();
  if (!isAddress(addr)) {
    throw new Error(`Invalid tokenAddress: "${params.tokenAddress}"`);
  }
  const runner = params.signer ?? getReadProvider();
  return new Contract(addr, ERC20_ABI, runner);
}
