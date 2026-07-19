import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  // ContentService reads content/** via fs at runtime; Next's tracer can't see
  // those dynamic-path calls, so dynamic routes lose content/ from their bundle.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
};

export default nextConfig;
