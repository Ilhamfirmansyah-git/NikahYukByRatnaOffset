/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // API routes: jangan pernah di-cache oleh browser atau CDN
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  // Paksa Prisma generate di build time Vercel
  outputFileTracingIncludes: {
    "/*": ["./node_modules/.prisma/**/*"],
  },
};

export default nextConfig;
