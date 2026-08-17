import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "uploads.onecompiler.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin/leads",
        destination: "/admin/admission-forms",
        permanent: true,
      },
      {
        source: "/admin/applications",
        destination: "/admin/students",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
