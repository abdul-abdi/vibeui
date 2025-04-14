import React, { useEffect, useRef, useState, useMemo, lazy, Suspense } from 'react';
import { VibeProvider, useVibe } from '@/lib/vibe-engine';
import { VibeControls } from '@/components/vibe-controls';
import { VibeInfo } from '@/components/vibe-info';
// Import only essential components immediately
import { Toaster } from '@/components/ui/toaster';
import { m, useMotionTemplate, useMotionValue, useTransform, LazyMotion, domAnimation } from 'framer-motion';
import { ArrowDown, Sparkles, ChevronLeft, Palette, Layers, Zap, Monitor, Sun, Moon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { throttle } from '@/lib/utils';
import { ClientOnly } from '@/components/client-only';
import dynamic from 'next/dynamic';
import { Layout } from '@/components/layout';

// Lazy load heavy components to improve initial load time
const VibeDemoElements = dynamic(() => import('@/components/vibe-demo-elements').then(mod => mod.VibeDemoElements), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] animate-pulse bg-muted/30 rounded-lg" />
});

const VibeGallery = dynamic(() => import('@/components/vibe-gallery').then(mod => mod.VibeGallery), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] animate-pulse bg-muted/30 rounded-lg" />
});

const FeatureShowcase = dynamic(() => import('@/components/feature-showcase').then(mod => mod.FeatureShowcase), {
  ssr: false
});

const Testimonials = dynamic(() => import('@/components/testimonials').then(mod => mod.Testimonials), {
  ssr: false
});

const DesignInspiration = dynamic(() => import('@/components/design-inspiration').then(mod => mod.DesignInspiration), {
  ssr: false
});

const DesignCTA = dynamic(() => import('@/components/design-cta').then(mod => mod.DesignCTA), {
  ssr: false
});

// Dynamically import heavy components
const OnboardingTutorialDynamic = dynamic(() => import('@/components/onboarding-tutorial').then(mod => mod.OnboardingTutorial), { 
  ssr: false,
  loading: () => <div className="w-full h-[300px] animate-pulse bg-muted/30 rounded-lg" />
});

// Function to check if we're in a specific vibe theme
const checkVibeType = (vibeName: string, keywords: string[]): boolean => {
  const lowerName = vibeName.toLowerCase();
  return keywords.some(keyword => lowerName.includes(keyword));
};

const VibeContent = () => {
  const { vibeState, changeVibe } = useVibe();
  const { currentVibe } = vibeState;
  const isInitialLoad = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      // Check for stored theme preference or system preference
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme as 'light' | 'dark';
      }
      
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check device capabilities on mount
  useEffect(() => {
    // Detect low-end devices
    const checkLowPerformanceMode = () => {
      // Check if device is low-end based on RAM and CPU cores
      const isLowEndDevice = 
        // Check for low memory (if available in the browser)
        ('deviceMemory' in navigator && (navigator as any).deviceMemory < 4) ||
        // Check for low CPU cores (if available in the browser)
        ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4) ||
        // Check for mobile device
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
      // Store the setting
      if (isLowEndDevice) {
        localStorage.setItem('lowPerformanceMode', 'true');
      }
      
      return isLowEndDevice || localStorage.getItem('lowPerformanceMode') === 'true';
    };
    
    const isLowPerformance = checkLowPerformanceMode();
    setIsLowPerformanceMode(isLowPerformance);
    
    // Report performance data
    if (window.performance) {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms (${isLowPerformance ? 'Low' : 'Normal'} performance mode)`);
      }, 0);
    }
  }, []);
  
  // Apply theme to document
  useEffect(() => {
    // Add or remove the 'dark' class based on the current theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.add('no-transitions');
      setTimeout(() => {
        document.documentElement.classList.remove('no-transitions');
      }, 100);
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Store the current theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Create a loading screen that shows the animated logo
  useEffect(() => {
    // Adaptive loading time - faster on low-end devices
    const loadingTime = isLowPerformanceMode ? 800 : 1500;
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingTime);
    
    return () => clearTimeout(timer);
  }, [isLowPerformanceMode]);
  
  // Load a vibe on initial render if not locked
  useEffect(() => {
    if (!vibeState.isLocked) {
      if (isInitialLoad.current) {
        setTimeout(() => {
          changeVibe();
          isInitialLoad.current = false;
        }, 300);
      }
    }
  }, [changeVibe, vibeState.isLocked]);
  
  // Helper function for consistent easing across animations
  const getEasing = () => {
    const easing = currentVibe.animation.easing;
    if (Array.isArray(easing)) {
      return easing;
    }
    return [0.4, 0, 0.2, 1];
  };
  
  // Use easing for animations
  const animationEasing = useMemo(() => {
    return getEasing;
  }, []);

  // Reduce animation complexity for low-end devices
  const getAnimationDuration = (baseDuration: number) => {
    return isLowPerformanceMode ? baseDuration * 0.5 : baseDuration;
  };

  // Memoize the animation options for performance
  const animationOptions = useMemo(() => ({
    duration: 0.6,
    ease: "easeOut"
  }), []);

  // Interactive background effect - optimized with throttling
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = throttle((e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, 50); // 50ms throttle for better performance
  
  const backgroundX = useTransform(mouseX, (latest) => latest / 30);
  const backgroundY = useTransform(mouseY, (latest) => latest / 30);
  const backgroundGradient = useMotionTemplate`radial-gradient(
    800px circle at ${backgroundX}px ${backgroundY}px,
    hsl(var(--primary) / 0.15),
    transparent 40%
  )`;

  // For header parallax effect - optimized with throttling
  const [scrollY, setScrollY] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Ensure the scroll position is checked immediately and whenever the scroll event happens
  useEffect(() => {
    // Initial check to set the right scroll position on first render
    const initialScroll = window.scrollY || document.documentElement.scrollTop;
    setScrollY(initialScroll);
    setHasScrolled(initialScroll > 10);
    
    const handleScroll = () => {
      // Get scroll position 
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      setScrollY(currentScroll);
      setHasScrolled(currentScroll > 10);
    };
    
    // Add scroll event listener with passive flag for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Force a scroll check immediately after component mount
    setTimeout(handleScroll, 0);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ensure correct initial state when component mounts or changes
  useEffect(() => {
    const checkScrollPosition = () => {
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      setScrollY(currentScroll);
      setHasScrolled(currentScroll > 10);
    };
    
    // Check on mount
    checkScrollPosition();
    
    // Also check after a short delay to ensure all content is loaded
    const timer = setTimeout(checkScrollPosition, 100);
    return () => clearTimeout(timer);
  }, []);

  const headerParallax = useTransform(
    useMotionValue(scrollY), 
    [0, 300], 
    [0, -50]
  );
  
  const backgroundParallax = useTransform(
    useMotionValue(scrollY),
    [0, 300],
    [0, 30]
  );

  // Determine vibe for specific styling
  const isSoftOrganic = checkVibeType(currentVibe.name, ["organic", "soft", "natural"]);
  const isDarkTech = checkVibeType(currentVibe.name, ["techno", "cyber", "digital", "tech"]);
  const isBrutalist = checkVibeType(currentVibe.name, ["brutal", "neo", "bold"]);
  const isPlayful = checkVibeType(currentVibe.name, ["playful", "vibrant", "fun", "creative"]);
  const isElectric = checkVibeType(currentVibe.name, ["electric", "pop", "neon", "bright"]);
  
  // Dynamic container classes based on vibe - memoized
  const containerClass = useMemo(() => {
    return isSoftOrganic ? 'soft-organic-container' : 
           isDarkTech ? 'dark-tech-container' :
           isBrutalist ? 'brutalist-container' :
           isPlayful ? 'playful-container' :
           isElectric ? 'electric-container' : '';
  }, [isSoftOrganic, isDarkTech, isBrutalist, isPlayful, isElectric]);

  // Loading screen with the animated logo - simplified for performance
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="text-center">
          <svg width="64" height="64" viewBox="0 0 32 32" className="animate-rotate-hue">
            <g id="gradient-circle">
              <circle cx="16" cy="16" r="15" fill="url(#navGradient)" strokeWidth="2"/>
              <path d="M10 16.5L14 20.5L22 12.5" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <linearGradient id="navGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF5757"/>
                <stop offset="25%" stopColor="#FFBD59"/>
                <stop offset="50%" stopColor="#4CD471"/>
                <stop offset="75%" stopColor="#5E8AF7"/>
                <stop offset="100%" stopColor="#C061F7"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div 
        className={`min-h-screen bg-background transition-colors duration-500 relative overflow-x-hidden ${containerClass}`}
        onMouseMove={handleMouseMove}
      >
        {/* Background effects - performance optimized */}
        <m.div 
          className="fixed inset-0 pointer-events-none z-0" 
          style={{ 
            background: backgroundGradient,
            willChange: "background"
          }}
        />
        
        <m.div
          className="fixed inset-0 pointer-events-none z-0 opacity-30"
          animate={{ 
            background: [
              `linear-gradient(to right, hsl(var(--primary) / 0.05), hsl(var(--secondary) / 0.05))`,
              `linear-gradient(to right, hsl(var(--secondary) / 0.05), hsl(var(--primary) / 0.05))`,
              `linear-gradient(to right, hsl(var(--primary) / 0.05), hsl(var(--secondary) / 0.05))`
            ]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          style={{ 
            y: backgroundParallax,
            willChange: "transform, background"
          }}
        />
        
        {/* Special background effects for specific themes */}
        {isSoftOrganic && (
          <m.div 
            className="fixed bottom-0 left-0 right-0 h-64 pointer-events-none z-0 opacity-20"
            style={{
              background: 'linear-gradient(to top, rgba(16, 185, 129, 0.1) 0%, transparent 100%)',
            }}
          />
        )}
        
        {isDarkTech && (
          <m.div 
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15), transparent 70%)',
            }}
            animate={{
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        
        {isElectric && (
          <>
            <m.div 
              className="fixed inset-0 pointer-events-none z-0 opacity-30"
              style={{
                background: 'linear-gradient(45deg, rgba(var(--primary-rgb), 0.1) 0%, rgba(var(--accent-rgb), 0.1) 100%)',
              }}
            />
            {/* Animated grid lines */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div className="absolute inset-0 opacity-10" 
                  style={{
                    backgroundImage: 'linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }}
              />
            </div>
          </>
        )}

        {/* Header */}
        <m.header 
          className={`z-50 py-3 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 transition-all duration-300 ${
            hasScrolled 
              ? 'bg-background dark:bg-background border-b border-border/20 dark:border-border/10 shadow-sm' 
              : 'bg-transparent'
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 * (1/currentVibe.animation.speed), ease: "easeOut" }}
          style={{ 
            backdropFilter: hasScrolled ? "blur(12px)" : "none",
            WebkitBackdropFilter: hasScrolled ? "blur(12px)" : "none",
            boxShadow: hasScrolled ? '0 4px 20px -5px hsla(var(--card-foreground)/0.1)' : 'none',
          }}
          data-solid={hasScrolled ? "true" : "false"}
        >
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <m.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                className="z-10"
              >
                <div className={`flex items-center ${isSoftOrganic ? 'px-3 py-2 rounded-xl bg-white/5 dark:bg-white/10' : ''}`}>
                  <div className="flex items-center">
                    <svg width="32" height="32" viewBox="0 0 32 32" className="animate-rotate-hue mr-2">
                      <g id="gradient-circle">
                        <circle cx="16" cy="16" r="15" fill="url(#navGradient)" strokeWidth="2"/>
                        <path d="M10 16.5L14 20.5L22 12.5" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                      </g>
                      <defs>
                        <linearGradient id="navGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#FF5757"/>
                          <stop offset="25%" stopColor="#FFBD59"/>
                          <stop offset="50%" stopColor="#4CD471"/>
                          <stop offset="75%" stopColor="#5E8AF7"/>
                          <stop offset="100%" stopColor="#C061F7"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <h1 className="text-3xl font-bold">
                      Vibe <span className="text-primary">UI</span>
                    </h1>
                  </div>
                </div>
              </m.div>
              
              {/* Desktop controls */}
              <div className="vibe-control-panel hidden sm:flex z-10 items-center gap-3 bg-background/50 backdrop-blur-sm py-2 px-3 rounded-lg border border-border/20">
                <VibeControls />
              </div>
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 rounded-md bg-background/80 border border-border/20 backdrop-blur-sm"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-foreground" />
                ) : (
                  <Menu className="h-5 w-5 text-foreground" />
                )}
              </button>
            </div>
            
            {/* Mobile dropdown menu */}
            {isMobileMenuOpen && (
              <m.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="sm:hidden mt-4 p-4 bg-background/95 backdrop-blur-md rounded-lg border border-border/20 shadow-lg"
              >
                <div className="mb-4 text-sm text-muted-foreground">
                  The ultimate UI design inspiration platform for modern designers
                </div>
                <div className="vibe-control-panel w-full z-10 flex flex-col gap-3">
                  <VibeControls />
                </div>
              </m.div>
            )}
          </div>
        </m.header>

        {/* Hero section */}
        <section className="relative min-h-[calc(100vh-76px)] flex items-center justify-center overflow-hidden pt-[96px]">
          <div className="container mx-auto px-4 pt-0 pb-8 md:pb-16">
            <div className="flex flex-col gap-8 lg:gap-16 items-center pt-8 md:pt-12">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: getAnimationDuration(0.6), ease: "easeOut" }}
                className="text-center order-1" 
              >
                <m.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: getAnimationDuration(0.5), ease: "easeOut" }}
                  className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 dark:bg-primary/15 text-primary mb-4 md:mb-8 border border-primary/20 dark:border-primary/30 backdrop-blur-sm"
                >
                  <Palette className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-xs md:text-sm font-medium">Design Inspiration Platform</span>
                </m.div>
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-8 leading-tight tracking-tight">
                  Explore UI <span className="text-primary relative inline-block">
                    Design Inspiration
                    <m.span 
                      className="absolute -bottom-1 left-0 right-0 h-1 md:h-1.5 bg-primary/20 dark:bg-primary/30 rounded-full" 
                      initial={{ scaleX: 0, transformOrigin: "left" }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: getAnimationDuration(0.8), ease: "easeOut" }}
                    />
                  </span> with <br className="hidden lg:block" />Dynamic Themes
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground dark:text-muted-foreground/90 mb-6 md:mb-10 max-w-xl mx-auto leading-relaxed">
                  Discover different UI styles, explore design systems, and find inspiration for your next project with VibeUI.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => changeVibe()} className="gap-2 shadow-md hover:shadow-lg transition-all py-4 md:py-6 px-6 md:px-8 text-base md:text-lg hover:scale-105 dark:bg-primary/90 dark:text-primary-foreground">
                    <Zap className="h-4 w-4 md:h-5 md:w-5" />
                    Generate New Vibe
                  </Button>
                  
                  <Button variant="outline" size="lg" className="gap-2 shadow-sm hover:shadow-md transition-all py-4 md:py-6 px-6 md:px-8 text-base md:text-lg hover:bg-primary/5 dark:hover:bg-primary/10 dark:border-primary/20" onClick={() => {
                    document.getElementById('feature-section')?.scrollIntoView({ 
                      behavior: isLowPerformanceMode ? 'auto' : 'smooth',
                      block: 'start'
                    });
                  }}>
                    <Layers className="h-4 w-4 md:h-5 md:w-5" />
                    Explore Features
                  </Button>
                </div>
                
                {/* Feature chips - hidden on smaller screens */}
                <m.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: getAnimationDuration(0.5) }}
                  className="hidden md:flex flex-wrap gap-2 mt-8 justify-center"
                >
                  <div className="px-3 py-1 bg-primary/5 dark:bg-primary/10 text-xs rounded-full border border-primary/10 dark:border-primary/20">Real-time Updates</div>
                  <div className="px-3 py-1 bg-primary/5 dark:bg-primary/10 text-xs rounded-full border border-primary/10 dark:border-primary/20">Dynamic Themes</div>
                  <div className="px-3 py-1 bg-primary/5 dark:bg-primary/10 text-xs rounded-full border border-primary/10 dark:border-primary/20">AI-powered</div>
                  <div className="px-3 py-1 bg-primary/5 dark:bg-primary/10 text-xs rounded-full border border-primary/10 dark:border-primary/20">Export Ready</div>
                </m.div>
              </m.div>
              
              {/* UI mockup - conditionally simplified for low-end devices */}
              <m.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: getAnimationDuration(0.6), ease: "easeOut" }}
                className="relative mt-4 max-w-3xl w-full mx-auto order-2"
              >
                {/* Animated Mac-style UI mockup */}
                <div className="relative z-10 bg-card rounded-xl overflow-hidden shadow-xl border border-border/50 transform lg:rotate-1 hover:rotate-0 transition-transform duration-500 hover:scale-[1.02]">
                  <div className="p-1">
                    <div className="flex items-center gap-1.5 px-3 py-2 border-b">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="ml-2 text-xs text-muted-foreground">VibeUI - Design System Preview</div>
                    </div>
                    
                    {/* Main content area with live animations - simplified for low-end devices */}
                    <div className="p-4 space-y-4">
                      {/* Top navigation with animated active state */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                          <m.div 
                            className="h-8 px-3 rounded-md flex items-center justify-center text-xs font-medium text-background"
                            style={{ backgroundColor: `hsl(var(--primary))` }}
                            whileHover={!isLowPerformanceMode ? { scale: 1.05 } : undefined}
                            animate={!isLowPerformanceMode ? { 
                              y: [0, -2, 0],
                              scale: [1, 1.03, 1]
                            } : undefined}
                            transition={!isLowPerformanceMode ? { duration: 2, repeat: Infinity, repeatDelay: 5 } : undefined}
                          >
                            Dashboard
                          </m.div>
                          <m.div 
                            className="h-8 px-3 rounded-md flex items-center justify-center text-xs font-medium"
                            style={{ backgroundColor: `hsl(var(--muted))` }}
                            whileHover={!isLowPerformanceMode ? { scale: 1.05, backgroundColor: `hsl(var(--muted-foreground)/0.2)` } : undefined}
                          >
                            Projects
                          </m.div>
                          <m.div 
                            className="h-8 px-3 rounded-md flex items-center justify-center text-xs font-medium"
                            style={{ backgroundColor: `hsl(var(--muted))` }}
                            whileHover={!isLowPerformanceMode ? { scale: 1.05, backgroundColor: `hsl(var(--muted-foreground)/0.2)` } : undefined}
                          >
                            Settings
                          </m.div>
                        </div>
                        <m.div 
                          className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium"
                          whileHover={!isLowPerformanceMode ? { scale: 1.1, backgroundColor: `hsl(var(--primary)/0.3)` } : undefined}
                          animate={!isLowPerformanceMode ? { 
                            rotate: [0, 5, 0, -5, 0]
                          } : undefined}
                          transition={!isLowPerformanceMode ? { duration: 5, repeat: Infinity, repeatDelay: 2 } : undefined}
                        >
                          <span className="text-primary">UI</span>
                        </m.div>
                      </div>
                      
                      {/* Simplified UI for rest of mockup on low-end devices */}
                      {isLowPerformanceMode ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="h-8 bg-primary/20 rounded-md w-full"></div>
                              <div className="h-24 bg-background/50 border border-muted/30 rounded-md"></div>
                              <div className="h-4 bg-muted/30 rounded-md w-3/4"></div>
                              <div className="h-4 bg-muted/30 rounded-md w-1/2"></div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-8 bg-secondary/20 rounded-md w-full"></div>
                              <div className="h-24 bg-background/50 rounded-md border border-muted/30">
                                <div className="absolute inset-0 flex items-end justify-around">
                                  <div className="w-1/5 h-[40%] bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-sm"></div>
                                  <div className="w-1/5 h-[60%] bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-sm"></div>
                                  <div className="w-1/5 h-[50%] bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-sm"></div>
                                  <div className="w-1/5 h-[70%] bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-sm"></div>
                                  <div className="w-1/5 h-[45%] bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-sm"></div>
                                </div>
                              </div>
                              <div className="h-4 bg-muted/30 rounded-md w-2/3"></div>
                              <div className="h-4 bg-muted/30 rounded-md w-3/4"></div>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden mt-4">
                            <div className="h-full bg-gradient-to-r from-primary/70 to-primary/40 rounded-full w-3/4"></div>
                          </div>
                        </div>
                      ) : (
                        // Original animated content for high-performance devices
                        <>
                          {/* Content grid with animated elements */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <m.div 
                                className="h-8 bg-primary/20 rounded-md w-full backdrop-blur-sm flex items-center px-3"
                                animate={{ 
                                  opacity: [1, 0.8, 1],
                                  scale: [1, 0.99, 1]
                                }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                              >
                                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                                <div className="w-[40%] h-2 bg-primary/30 rounded-full"></div>
                              </m.div>
                              <m.div 
                                className="h-24 bg-background/50 border border-muted/30 rounded-md flex items-center justify-center overflow-hidden backdrop-blur-sm"
                              >
                                <m.div
                                  className="w-full h-full bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
                                  animate={{
                                    x: [-200, 200, -200],
                                  }}
                                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                ></m.div>
                              </m.div>
                              <m.div 
                                className="h-4 bg-muted/30 rounded-md w-3/4 overflow-hidden"
                                initial={{ width: "30%" }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                              >
                                <m.div 
                                  className="h-full w-full bg-gradient-to-r from-primary/20 to-primary/10"
                                  animate={{ x: [-50, 0] }}
                                  transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                                ></m.div>
                              </m.div>
                              <m.div 
                                className="h-4 bg-muted/30 rounded-md overflow-hidden"
                                initial={{ width: "20%" }}
                                animate={{ width: "55%" }}
                                transition={{ duration: 1.8, delay: 1.2, ease: "easeOut" }}
                              >
                                <m.div 
                                  className="h-full w-full bg-gradient-to-r from-secondary/20 to-secondary/10"
                                  animate={{ x: [-30, 0] }}
                                  transition={{ duration: 1.8, delay: 1.2, ease: "easeOut" }}
                                ></m.div>
                              </m.div>
                            </div>
                            
                            {/* Second column - with data viz */}
                            <div className="space-y-2">
                              <m.div 
                                className="h-8 bg-secondary/20 rounded-md w-full backdrop-blur-sm flex items-center justify-between px-3"
                                animate={{ 
                                  opacity: [1, 0.7, 1]
                                }}
                                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                              >
                                <div className="w-[30%] h-2 bg-secondary/30 rounded-full"></div>
                                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                              </m.div>
                              <m.div 
                                className="h-24 bg-background/50 rounded-md relative overflow-hidden backdrop-blur-sm border border-muted/30"
                              >
                                {/* Simulated data visualization */}
                                <div className="absolute inset-0 flex items-end justify-around">
                                  <m.div className="w-1/5 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-sm"
                                    animate={{ height: ["33%", "60%", "40%", "33%"] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                  ></m.div>
                                  <m.div className="w-1/5 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-sm"
                                    animate={{ height: ["50%", "30%", "70%", "50%"] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                                  ></m.div>
                                  <m.div className="w-1/5 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-sm"
                                    animate={{ height: ["66%", "40%", "80%", "66%"] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                                  ></m.div>
                                  <m.div className="w-1/5 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-sm"
                                    animate={{ height: ["50%", "70%", "30%", "50%"] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                                  ></m.div>
                                  <m.div className="w-1/5 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-sm"
                                    animate={{ height: ["33%", "50%", "25%", "33%"] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                                  ></m.div>
                                </div>
                              </m.div>
                              <m.div 
                                className="h-4 bg-muted/30 rounded-md"
                                initial={{ width: "40%" }}
                                animate={{ width: "65%" }}
                                transition={{ duration: 1.5, delay: 1.4, ease: "easeOut" }}
                              ></m.div>
                              <m.div 
                                className="h-4 bg-muted/30 rounded-md"
                                initial={{ width: "50%" }}
                                animate={{ width: "80%" }}
                                transition={{ duration: 1.8, delay: 1.6, ease: "easeOut" }}
                              ></m.div>
                            </div>
                          </div>
                          
                          {/* Animated progress bar */}
                          <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden mt-4 backdrop-blur-sm">
                            <m.div 
                              className="h-full bg-gradient-to-r from-primary/70 to-primary/40 rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: "75%" }}
                              transition={{ 
                                duration: 3, 
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatType: "reverse"
                              }}
                            ></m.div>
                          </div>
                        </>
                      )}
                      
                      {/* Status indicators - simplified */}
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs text-muted-foreground">Status: Online</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Updated 2m ago</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Background elements - only for high performance mode */}
                {!isLowPerformanceMode && (
                  <>
                    <m.div
                      className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/10 rounded-full -z-10 blur-md"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.3, 0.5]
                      }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    <m.div
                      className="absolute -top-10 -left-6 w-32 h-32 bg-secondary/10 rounded-full -z-10 blur-md"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.4, 0.2, 0.4]
                      }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                  </>
                )}
              </m.div>
            </div>
          </div>
          
          {/* Only show this on non-low-performance devices */}
          {!isLowPerformanceMode && (
            <m.div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer bg-background/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-border/20 hover:bg-background/80 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: getAnimationDuration(0.6), ease: "easeOut" }}
              whileHover={{ y: 5 }}
              onClick={() => {
                document.getElementById('vibe-info-section')?.scrollIntoView({ 
                  behavior: isLowPerformanceMode ? 'auto' : 'smooth',
                  block: 'start' 
                });
              }}
            >
              <p className="text-sm font-medium text-foreground mb-1">Explore More</p>
              <ArrowDown className="h-4 w-4 text-primary animate-bounce" />
            </m.div>
          )}
          
          {/* Hero section bottom divider with improved rendering */}
          <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-t from-background to-transparent pointer-events-none will-change-opacity"></div>
        </section>

        {/* Main content */}
        <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10 flex-grow">
          <div id="vibe-info-section" className="pt-16">
            <m.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: animationEasing() }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Left column - Vibe Info */}
              <section className="space-y-6">
                <m.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: animationEasing() }}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isSoftOrganic ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
                    {isSoftOrganic ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" />
                        <path d="M8 12s1.5 2 4 2 4-2 4-2" />
                        <path d="M9 9h.01" />
                        <path d="M15 9h.01" />
                      </svg>
                    ) : isDarkTech ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M9 8h10" />
                        <path d="M5 8h1" />
                        <path d="M9 16h10" />
                        <path d="M5 16h1" />
                        <path d="M9 12h10" />
                        <path d="M5 12h1" />
                      </svg>
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </div>
                  <h2 className="text-3xl font-bold">
                    Current Vibe: <span className="text-primary">{currentVibe.name}</span>
                  </h2>
                </m.div>
                
                <m.p 
                  className="text-lg text-muted-foreground mt-3 max-w-2xl readable-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: animationEasing() }}
                >
                  VibeUI lets designers explore complete design systems that transform in real-time. 
                  Experiment with colors, typography, layouts, and animations to find the perfect 
                  inspiration for your next project.
                </m.p>
                
                <m.div 
                  className="pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: animationEasing() }}
                >
                  <VibeInfo />
                </m.div>
              </section>
              
              {/* Right column - Demo elements */}
              <m.section 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: animationEasing() }}
              >
                <VibeDemoElements />
              </m.section>
            </m.div>
          </div>
          
          {/* Feature showcase section */}
          <div id="feature-section" className="mt-24">
            <FeatureShowcase />
          </div>
          
          {/* Design inspiration section */}
          <div className="mt-16">
            <DesignInspiration />
          </div>
          
          {/* Gallery section */}
          <m.div 
            id="gallery-section"
            className="mt-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: animationEasing() }}
          >
            <VibeGallery />
          </m.div>
          
          {/* Testimonials section */}
          <div className="mt-8">
            <Testimonials />
          </div>
          
          {/* CTA section */}
          <div className="mt-16">
            <DesignCTA />
          </div>
        </main>

        <m.footer 
          className="relative z-10 mt-auto py-8 px-4 sm:px-6 lg:px-8 border-t backdrop-blur-sm bg-background/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5, ease: animationEasing() }}
        >
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center sm:items-start">
              <p className="text-base font-medium mb-3">
                Vibe UI <span className="text-primary">Shift</span>
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                A design inspiration platform for UI/UX creators
              </p>
            </div>
            <div className="flex items-center gap-3 bg-background/50 px-4 py-2 rounded-full border border-border/20 shadow-sm mt-6 sm:mt-0">
              <m.div 
                className="h-3 w-3 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }} 
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <span className="text-sm font-medium">
                {new Date().toLocaleDateString()} · <span className="text-primary">{currentVibe.name}</span>
              </span>
            </div>
          </div>
        </m.footer>
        
        <Toaster />
      </div>
    </LazyMotion>
  );
};

const Index = () => {
  // Pre-fetch key components on initial load
  useEffect(() => {
    const prefetchComponents = async () => {
      try {
        // Add prefetching logic for key components/data
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            try {
              // Wrap imports in try/catch blocks to prevent errors from breaking the page
              Promise.all([
                import('@/components/onboarding-tutorial').catch(() => {}),
                import('@/components/vibe-comparison').catch(() => {}),
                import('@/components/vibe-history').catch(() => {})
              ]);
            } catch (error) {
              console.warn('Non-critical component prefetching failed:', error);
            }
          });
        } else {
          setTimeout(() => {
            try {
              Promise.all([
                import('@/components/onboarding-tutorial').catch(() => {}),
                import('@/components/vibe-comparison').catch(() => {}),
                import('@/components/vibe-history').catch(() => {})
              ]);
            } catch (error) {
              console.warn('Non-critical component prefetching failed:', error);
            }
          }, 2000);
        }
      } catch (error) {
        console.warn('Component prefetching failed:', error);
        // Non-critical error, application can continue
      }
    };
    
    prefetchComponents();
  }, []);

  return (
    <Layout title="VibeUI - Design System and UI Inspiration Platform">
      <ClientOnly>
        <VibeContent />
      </ClientOnly>
    </Layout>
  );
};

export default Index;
