import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "/home/dog/projects/strathmenu",
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;