import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from root .env.local
config({ path: resolve(__dirname, ".env.local") });

const nextConfig: NextConfig = {
  // Turbopack (--turbo flag) handles all bundling now
  // No webpack configuration needed
};

export default nextConfig;
