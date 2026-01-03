import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Allow embedding well embed pages in iframes from any origin
        source: '/well/:shortCode/embed',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' *",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
