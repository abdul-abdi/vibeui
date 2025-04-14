import '../index.css';
import type { AppProps } from 'next/app';
import { VibeProvider } from '@/lib/vibe-engine';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';

function MyApp({ Component, pageProps }: AppProps) {
  // Create query client with optimized settings
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  // Register performance observers
  useEffect(() => {
    // Only run in production and client-side
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Report Core Web Vitals with dynamic import
      const reportWebVitals = async () => {
        try {
          // Import specific functions directly to avoid type issues
          const { onCLS, onFID, onLCP } = await import('web-vitals');
          
          onCLS((metric) => {
            console.log('CLS:', metric.value);
          });
          
          onFID((metric) => {
            console.log('FID:', metric.value);
          });
          
          onLCP((metric) => {
            console.log('LCP:', metric.value);
          });
        } catch (err) {
          console.error('Failed to load web-vitals:', err);
        }
      };
      
      // Use requestIdleCallback to avoid blocking main thread
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(reportWebVitals);
      } else {
        setTimeout(reportWebVitals, 500);
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <VibeProvider>
          <LazyMotion features={domAnimation} strict>
            <Component {...pageProps} />
            <Toaster position="bottom-right" />
          </LazyMotion>
        </VibeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp; 