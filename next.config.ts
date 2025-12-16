import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from root .env.local
config({ path: resolve(__dirname, ".env.local") });

const nextConfig: NextConfig = {
  webpack: (webpackConfig, { dev }) => {
    if (dev) {
      // Windows can occasionally end up with missing `.pack.gz` cache entries
      // which cascades into dev-time ENOENT errors. Disabling persistent cache
      // in dev trades a bit of speed for stability.
      webpackConfig.cache = false;

      // Improve Windows file watching with polling
      if (webpackConfig.watchOptions) {
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          poll: 1000, // Check for changes every second
          aggregateTimeout: 300, // Delay before rebuilding
          ignored: /node_modules/,
        };
      }
    }

    return webpackConfig;
  },
};

export default nextConfig;
