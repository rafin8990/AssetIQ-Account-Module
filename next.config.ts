import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev assets and HMR are blocked unless the browser host is listed.
  // localhost is allowed by default; IP access (local and the live server) is not.
  allowedDevOrigins: ["127.0.0.1", "192.168.20.168", "146.190.84.19"],
};

export default nextConfig;
