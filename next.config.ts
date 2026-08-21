import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // sql.js is WASM-based, no native modules needed
  serverExternalPackages: ["sql.js"],
};

export default nextConfig;