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
  output: 'standalone',
  distDir: '.next',
  
  // Disable static generation for API routes
  staticPageGenerationTimeout: 180,
  
  // Ensure API routes are always dynamic
  trailingSlash: false,
  
  // Add this to handle Turbopack issues
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: false,
      };
    }
    return config;
  },
}

export default nextConfig