import React, { ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';
import { useVibe } from '@/lib/vibe-engine';
import { m, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export function Layout({ 
  children, 
  title = 'VibeUI - The Ultimate UI Design Inspiration Platform',
  description = 'Discover new interface styles and aesthetics with VibeUI, the design system and UI inspiration platform for designers and developers.'
}: LayoutProps) {
  const router = useRouter();
  const { vibeState } = useVibe();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Performance optimization: defer non-critical operations
  useEffect(() => {
    // Mark as loaded after first render cycle
    const timer = setTimeout(() => setIsLoaded(true), 0);
    
    // Setup performance monitoring
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Report Core Web Vitals
      if ('connection' in navigator && (navigator as any).connection) {
        const conn = (navigator as any).connection;
        console.info(`Network conditions: ${conn.effectiveType}, RTT: ${conn.rtt}ms`);
      }
      
      // Register service worker
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').then(
            (registration) => {
              console.log('ServiceWorker registration successful with scope: ', registration.scope);
            },
            (err) => {
              console.log('ServiceWorker registration failed: ', err);
            }
          );
        });
      }
    }
    
    return () => clearTimeout(timer);
  }, []);

  // Memoize animation variants
  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5E8AF7" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      
      <AnimatePresence mode="wait">
        <m.main
          key={router.pathname}
          {...pageTransition}
          className="min-h-screen bg-background"
        >
          {children}
        </m.main>
      </AnimatePresence>
      
      {/* Preload critical assets in the background after page load */}
      {isLoaded && (
        <div className="hidden">
          {/* Add preload images here */}
        </div>
      )}
    </>
  );
} 