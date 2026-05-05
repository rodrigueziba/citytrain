import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@mkkellogg/gaussian-splats-3d",
  ],
};

export default nextConfig;
