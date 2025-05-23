import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEST_PUBLIC_API_URL: 'https://todo-app-production-8c59.up.railway.app',
  },
};

export default nextConfig;
