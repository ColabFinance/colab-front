"use client";

import { useCallback, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

export function useAuthToken() {
  const { authenticated, getAccessToken } = usePrivy();
  const [tokenPreview, setTokenPreview] = useState("");

  const getToken = useCallback(async () => {
    if (!authenticated) return "";
    const t = await getAccessToken();
    return t || "";
  }, [authenticated, getAccessToken]);

  useEffect(() => {
    (async () => {
      if (!authenticated) {
        setTokenPreview("");
        return;
      }
      const t = await getAccessToken();
      setTokenPreview(t ? `${t.slice(0, 22)}...` : "");
    })();
  }, [authenticated, getAccessToken]);

  return { getToken, tokenPreview };
}
