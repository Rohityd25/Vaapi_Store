import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'vaapi-preview.preview.emergentagent.com',
    'vaapi-preview.cluster-2.preview.emergentcf.cloud',
    '2dc9265c-5836-4d95-b42b-60c6a74f3741.preview.emergentagent.com',
    '*.preview.emergentagent.com',
    '*.preview.emergentcf.cloud',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ],
  },
};

export default nextConfig;
