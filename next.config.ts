import type { NextConfig } from "next";
import { SERVER_CONFIG } from "./src/shared/config/env";

const nextConfig: NextConfig = {
  reactCompiler: true,

  serverExternalPackages: ["thread-stream", "pino"],

  webpack: (config) => {
    const extraExternals = [
      "pino-pretty",
      "lokijs",
      "encoding",
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
    const lp = SERVER_CONFIG.apiLpOrigin; // http://13.202.89.97:8000
    const signals = SERVER_CONFIG.apiSignalsOrigin; // http://13.202.89.97:8080
    const marketData = SERVER_CONFIG.apiMarketDataOrigin; // http://13.202.89.97:8081

    return [
      ...(lp ? [{ source: "/lp/:path*", destination: `${lp}/:path*` }] : []),
      ...(signals ? [{ source: "/signals/:path*", destination: `${signals}/:path*` }] : []),
      ...(marketData ? [{ source: "/market-data/:path*", destination: `${marketData}/:path*` }] : []),
    ];
  },
};

export default nextConfig;
