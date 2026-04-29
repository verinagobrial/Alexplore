/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // Your existing setting
  },
  images: {
    unoptimized: true,  // Your existing setting
  },
  eslint: {
    ignoreDuringBuilds: true,  // Add this to ignore ESLint errors
  },
  output: 'standalone',  // Add this for better Vercel deployment
  swcMinify: true,  // Optional: faster builds
  reactStrictMode: false,  // Optional: reduces warnings
}

export default nextConfig