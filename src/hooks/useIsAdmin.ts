"use client";

import { useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { CONFIG } from "@/shared/config/env";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";

export function useIsAdmin() {
  const { ready, authenticated } = usePrivy();
  const { ownerAddr } = useOwnerAddress();

  const isAdmin = useMemo(() => {
    if (!ready || !authenticated) return false;
    const a = (ownerAddr || "").toLowerCase();
    if (!a) return false;
    return CONFIG.adminWallets.includes(a);
  }, [ready, authenticated, ownerAddr]);

  return { isAdmin };
}
