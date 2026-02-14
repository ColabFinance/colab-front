// src/shared/config/v3SwapFees.ts

export type V3Fee = string; // uint24 em string (ex: "100", "500", "2500", "10000")
export const DEFAULT_V3_SWAP_FEE: V3Fee = "2500";

function is0xAddress(a: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(a);
}

function pairKey(a: string, b: string): string {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  return x < y ? `${x}_${y}` : `${y}_${x}`;
}

/**
 * Fee preferido por PAR (independente da direção).
 * As keys são SEMPRE lowercase e order-agnostic.
 */
const FEE_BY_PAIR: Record<string, V3Fee> = {
  // ===== BASE =====
  [pairKey(
    "0x4200000000000000000000000000000000000006", // WETH (Base)
    "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"  // USDC (Base)
  )]: "100",

  [pairKey(
    "0x3055913c90fcc1a6ce9a358911721eeb942013a1", // (exemplo)
    "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"  // USDC (Base)
  )]: "2500",

  // ===== BNB (exemplo) =====
  // [pairKey("0x...cake...", "0x...usdc...")]: "2500",
};

/** Retorna o fee preferido do par (se existir), senão null */
export function getPreferredV3FeeForPair(tokenA?: string, tokenB?: string): V3Fee | null {
  if (!tokenA || !tokenB) return null;
  if (!is0xAddress(tokenA) || !is0xAddress(tokenB)) return null;
  if (tokenA.toLowerCase() === tokenB.toLowerCase()) return null;

  return FEE_BY_PAIR[pairKey(tokenA, tokenB)] ?? null;
}
