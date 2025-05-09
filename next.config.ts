import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "image.lexica.art",
      },
      {
        hostname: "videos.pexels.com",
      },
    ],
  },
  httpAgentOptions: {
    keepAlive: true,
  },
};

export default nextConfig;
