/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  experimental: {
    optimizeCss: {
      critters: {
        preload: 'media',
        pruneSource: true,
      }
    },
    scrollRestoration: true,
    optimizePackageImports: ['framer-motion', 'lucide-react', '@radix-ui/react-*'],
  },
  compress: true,
  poweredByHeader: false,
};

// Enable bundle analyzer in analyze mode
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

module.exports = withBundleAnalyzer(nextConfig); 