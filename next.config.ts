import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker deployment
  output: "standalone",
  reactStrictMode: true,
  // Server external packages (better-sqlite3 is native)
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;