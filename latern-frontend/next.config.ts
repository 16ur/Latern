import type { NextConfig } from "next";

const backendApiUrl = process.env.BACKEND_API_URL ?? "http://localhost:8000/api";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
