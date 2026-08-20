import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // better-sqlite3 is a native module — must be externalized for Docker
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;