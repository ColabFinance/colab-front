import type { NextConfig } from "next";
import { CONFIG } from "./src/shared/config/env";

const nextConfig: NextConfig = {
  reactCompiler: true,

  /**
   * Evita o Next tentar bundlar thread-stream/pino no server (causa desses imports de /test).
   * Recomendação do próprio thread-stream para Next.js.
   */
  serverExternalPackages: ["thread-stream", "pino"],

  webpack: (config) => {
    // Reown recomenda externals pra SSR no Next
    const extraExternals = [
      "pino-pretty",
      "lokijs",
      "encoding",

      // build está reclamando desses módulos vindos de thread-stream/test/*
      "tape",
      "why-is-node-running",
      "tap",
    ];

    if (Array.isArray(config.externals)) {
      config.externals.push(...extraExternals);
    } else if (config.externals) {
      config.externals = [config.externals as any, ...extraExternals];
    } else {
      config.externals = extraExternals as any;
    }

    return config;
  },

  async rewrites() {
    const lp = CONFIG.apiLpBaseUrl; // http://127.0.0.1:8000
    const signals = CONFIG.apiSignalsBaseUrl; // http://127.0.0.1:8080
    const marketData = CONFIG.apiMarketDataUrl; // http://127.0.0.1:8081

    return [
      ...(lp ? [{ source: "/lp/:path*", destination: `${lp}/:path*` }] : []),
      ...(signals ? [{ source: "/signals/:path*", destination: `${signals}/:path*` }] : []),
      ...(marketData ? [{ source: "/market-data/:path*", destination: `${marketData}/:path*` }] : []),
    ];
  },
};

export default nextConfig;
