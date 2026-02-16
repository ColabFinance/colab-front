import type { NextConfig } from "next";

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
};

export default nextConfig;
