import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from root .env.local
config({ path: resolve(__dirname, ".env.local") });

const nextConfig: NextConfig = {
  webpack: (webpackConfig, { dev }) => {
    // Windows can occasionally end up with missing `.pack.gz` cache entries
    // which cascades into dev-time ENOENT errors. Disabling persistent cache
    // in dev trades a bit of speed for stability.
    if (dev) {
      webpackConfig.cache = false;
    }

    return webpackConfig;
  },
};

export default nextConfig;
