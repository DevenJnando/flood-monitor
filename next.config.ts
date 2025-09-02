import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
        ppr: 'incremental',
    },
    output: "standalone",
};

export default nextConfig;
