/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Remove 'output: standalone' temporarily - it can cause issues
  // output: 'standalone',
  
  // Ensure dist directory is set correctly
  distDir: '.next',
}

export default nextConfig