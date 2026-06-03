import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Supabase Storage — your actual painting photos
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        // Supabase Storage CDN
        protocol: "https",
        hostname: "*.supabase.com",
      },
    ],
  },
};

export default nextConfig;
