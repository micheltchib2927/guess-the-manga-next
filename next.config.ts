import type { NextConfig } from "next";
import { createNodeDebugChannel } from "next/dist/server/app-render/debug-channel-server";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,

  images : {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        pathname: "/images/**"
      }
    ]
  }
};

export default nextConfig;
