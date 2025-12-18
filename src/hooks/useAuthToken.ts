"use client";

import { useCallback, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

type UseAuthTokenResult = {
  token: string;
  authenticated: boolean;
  ready: boolean;
  ensureTokenOrLogin: () => Promise<string>;
};

export function useAuthToken(): UseAuthTokenResult {
  const { ready, authenticated, login, getAccessToken } = usePrivy();

  const [token, setToken] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (!ready || !authenticated) {
        setToken("");
        return;
      }
      const t = await getAccessToken();
      setToken(t || "");
    })();
  }, [ready, authenticated, getAccessToken]);

  const ensureTokenOrLogin = useCallback(async () => {
    if (!ready) return "";

    if (!authenticated) {
      try {
        await login();
      } catch {
        return "";
      }
    }

    const t = await getAccessToken();
    const finalToken = t || "";
    setToken(finalToken);
    return finalToken;
  }, [ready, authenticated, login, getAccessToken]);

  return { token, authenticated, ready, ensureTokenOrLogin };
}
