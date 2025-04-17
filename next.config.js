import bundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // This will ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This will ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
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
  productionBrowserSourceMaps: true,
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      connect-src 'self' https://jhvuteawbvlkssznovxq.supabase.co;
      img-src 'self' blob: data: via.placeholder.com images.unsplash.com;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

// Enable bundle analyzer in analyze mode
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? bundleAnalyzer({ enabled: true })
  : (config) => config;

export default withBundleAnalyzer(nextConfig); 