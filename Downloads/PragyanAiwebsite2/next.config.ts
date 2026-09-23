import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory otherwise makes Next.js
  // infer the wrong workspace root.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // 90 is used for the cinematic plates and the gateway, which are enlarged
    // by the camera and show compression artifacts at the default 75.
    qualities: [75, 90],
  },
};

export default nextConfig;
