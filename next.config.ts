import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://37.59.126.29:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
