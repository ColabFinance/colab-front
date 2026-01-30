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

      // No seu caso, o build está reclamando desses módulos vindos de thread-stream/test/*
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
};

export default nextConfig;
