import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
      // caso o Next tenha definido externals como função/objeto, preserva e adiciona nossos externals
      config.externals = [config.externals as any, ...extraExternals];
    } else {
      config.externals = extraExternals as any;
    }

    return config;
  },

  async rewrites() {
    const lp = process.env.API_LP_ORIGIN; // http://13.202.89.97:8000
    const signals = process.env.API_SIGNALS_ORIGIN; // http://13.202.89.97:8080

    return [
      ...(lp ? [{ source: "/lp/:path*", destination: `${lp}/:path*` }] : []),
      ...(signals ? [{ source: "/signals/:path*", destination: `${signals}/:path*` }] : []),
    ];
  },
};

export default nextConfig;
