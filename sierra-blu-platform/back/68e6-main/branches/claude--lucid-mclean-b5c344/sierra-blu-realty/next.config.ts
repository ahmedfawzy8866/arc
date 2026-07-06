import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "sierra-blu.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/propertyfinder.xml",
        destination: "/api/propertyfinder",
      },
      {
        source: "/feed.xml",
        destination: "/api/propertyfinder",
      },
    ];
  },
};


export default nextConfig;
