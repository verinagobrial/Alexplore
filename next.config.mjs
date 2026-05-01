/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // eslint config is no longer supported in next.config.mjs
  // Remove the eslint key completely
  
  // Ensure dist directory is set correctly
  distDir: '.next',
}

export default nextConfig