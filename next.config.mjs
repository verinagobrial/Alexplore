/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ['vm-6um6j92or6tnkazy2h8ggc2t.vusercontent.net'],
  },
}

export default nextConfig
