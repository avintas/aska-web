import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from root .env.local
config({ path: resolve(__dirname, ".env.local") });

const nextConfig: NextConfig = {
  webpack: (webpackConfig, { dev }) => {
    if (dev) {
      // Disable persistent cache for Windows stability
      webpackConfig.cache = false;
    }
    return webpackConfig;
  },
};

export default nextConfig;
