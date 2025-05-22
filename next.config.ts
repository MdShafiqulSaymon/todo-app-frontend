import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEST_PUBLIC_API_URL: 'http://localhost:3000',
  },
};

export default nextConfig;
