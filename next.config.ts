import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This site reads live data (the active theme) from Supabase on every
  // request, so the Next 16 component cache is disabled.
  cacheComponents: false,
};

export default nextConfig;
