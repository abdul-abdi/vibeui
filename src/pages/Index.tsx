
import React, { useEffect, useRef, useState } from 'react';
import { VibeProvider, useVibe } from '@/lib/vibe-engine';
import { VibeControls } from '@/components/vibe-controls';
import { VibeInfo } from '@/components/vibe-info';
import { VibeDemoElements } from '@/components/vibe-demo-elements';
import { VibeGallery } from '@/components/vibe-gallery';
import { FeatureShowcase } from '@/components/feature-showcase';
import { Testimonials } from '@/components/testimonials';
import { DesignInspiration } from '@/components/design-inspiration';
import { DesignCTA } from '@/components/design-cta';
import { Toaster } from '@/components/ui/toaster';
import { motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { ArrowDown, Sparkles, ChevronLeft, Palette, Layers, Zap, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Function to check if we're in a specific vibe theme
const checkVibeType = (vibeName: string, keywords: string[]): boolean => {
  const lowerName = vibeName.toLowerCase();
  return keywords.some(keyword => lowerName.includes(keyword));
};

const VibeContent = () => {
  const { vibeState, changeVibe } = useVibe();
  const { currentVibe } = vibeState;
  const isInitialLoad = useRef(true);

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

  // Interactive background effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };
  
  const backgroundX = useTransform(mouseX, (latest) => latest / 30);
  const backgroundY = useTransform(mouseY, (latest) => latest / 30);
  const backgroundGradient = useMotionTemplate`radial-gradient(
    800px circle at ${backgroundX}px ${backgroundY}px,
    hsl(var(--primary) / 0.15),
    transparent 40%
  )`;

  // For header parallax effect
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
  
  // Dynamic container classes based on vibe
  const containerClass = isSoftOrganic ? 'soft-organic-container' : 
                         isDarkTech ? 'dark-tech-container' :
                         isBrutalist ? 'brutalist-container' :
                         isPlayful ? 'playful-container' :
                         isElectric ? 'electric-container' : '';

  return (
    <div 
      className={`min-h-screen bg-background transition-colors duration-500 relative overflow-guard ${containerClass}`}
      onMouseMove={handleMouseMove}
    >
      {/* Background effects */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0 hardware-accelerated" 
        style={{ background: backgroundGradient }}
      />
      
      <motion.div
        className="fixed inset-0 pointer-events-none z-0 opacity-30 hardware-accelerated"
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
        style={{ y: backgroundParallax }}
      />
      
      {/* Special background effects for specific themes */}
      {isSoftOrganic && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 h-64 pointer-events-none z-0 opacity-20 hardware-accelerated"
          style={{
            background: 'linear-gradient(to top, rgba(16, 185, 129, 0.1) 0%, transparent 100%)',
          }}
        />
      )}
      
      {isDarkTech && (
        <motion.div 
          className="fixed inset-0 pointer-events-none z-0 hardware-accelerated"
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
          <motion.div 
            className="fixed inset-0 pointer-events-none z-0 opacity-30 hardware-accelerated"
            style={{
              background: 'linear-gradient(45deg, rgba(var(--primary-rgb), 0.1) 0%, rgba(var(--accent-rgb), 0.1) 100%)',
            }}
          />
          {/* Animated grid lines */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hardware-accelerated">
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
      <motion.header 
        className="relative z-10 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 backdrop-blur-sm bg-background/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 * (1/currentVibe.animation.speed), ease: getEasing() }}
        style={{ y: headerParallax }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: getEasing() }}
            >
              <div className={`flex flex-col items-start ${isSoftOrganic ? 'px-3 py-2 rounded-xl backdrop-blur-sm bg-white/20' : ''}`}>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  Vibe <span className="text-primary">UI</span>
                  <motion.span 
                    className="inline-block text-primary relative ml-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5, ease: getEasing() }}
                  >
                    Shift
                    <motion.div 
                      className="absolute -top-1 -right-1"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.8, 1],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                    >
                      <Sparkles className="h-3 w-3 text-primary" />
                    </motion.div>
                  </motion.span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  The ultimate UI design inspiration platform for modern designers
                </p>
              </div>
            </motion.div>
            <div className="vibe-control-panel w-full sm:w-auto">
              <VibeControls />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: getEasing() }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-6"
              >
                <Palette className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Design Inspiration Platform</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Transform Your <span className="text-primary">Design Process</span> with Dynamic UI
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                Discover endless UI inspiration, explore design systems, and create exceptional user experiences with VibeUI.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" onClick={() => changeVibe()} className="gap-2">
                  <Zap className="h-4 w-4" />
                  Generate New Vibe
                </Button>
                
                <Button variant="outline" size="lg" className="gap-2" onClick={() => {
                  document.getElementById('feature-section')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <Layers className="h-4 w-4" />
                  Explore Features
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                    JD
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-xs">
                    AM
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center text-xs">
                    RK
                  </div>
                </div>
                <p className="ml-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">2,500+</span> designers already using VibeUI
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: getEasing() }}
              className="relative"
            >
              <div className="relative z-10 bg-card rounded-xl overflow-hidden shadow-xl border border-border/50">
                <div className="p-1">
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-2 text-xs text-muted-foreground">VibeUI - Design System Preview</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-4">
                    <div className="space-y-2">
                      <div className="h-8 bg-primary/20 rounded-md w-full"></div>
                      <div className="h-24 bg-muted rounded-md"></div>
                      <div className="h-4 bg-muted/50 rounded-md w-3/4"></div>
                      <div className="h-4 bg-muted/50 rounded-md w-1/2"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-secondary/20 rounded-md w-full"></div>
                      <div className="h-24 bg-muted rounded-md"></div>
                      <div className="h-4 bg-muted/50 rounded-md w-2/3"></div>
                      <div className="h-4 bg-muted/50 rounded-md w-3/4"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-accent/20 rounded-md w-full"></div>
                      <div className="h-12 bg-muted rounded-md"></div>
                      <div className="h-4 bg-muted/50 rounded-md w-1/2"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-destructive/20 rounded-md w-full"></div>
                      <div className="h-12 bg-muted rounded-md"></div>
                      <div className="h-4 bg-muted/50 rounded-md w-3/4"></div>
                    </div>
                  </div>
                  <div className="flex justify-between p-4 border-t">
                    <div className="h-8 w-8 bg-primary/20 rounded-full"></div>
                    <div className="h-8 bg-primary/20 rounded-md w-24"></div>
                  </div>
                </div>
              </div>
              
              <motion.div
                className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full -z-10"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.3, 0.5]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div
                className="absolute -top-6 -left-6 w-24 h-24 bg-secondary/10 rounded-full -z-10"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.2, 0.4]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </motion.div>
          </div>
          
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => {
              document.getElementById('vibe-info-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <p className="text-sm text-muted-foreground mb-2">Explore More</p>
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10 flex-grow">
        <div id="vibe-info-section" className="pt-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: getEasing() }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left column - Vibe Info */}
            <section className="space-y-6">
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: getEasing() }}
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
              </motion.div>
              
              <motion.p 
                className="text-lg text-muted-foreground mt-3 max-w-2xl readable-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: getEasing() }}
              >
                VibeUI lets designers explore complete design systems that transform in real-time. 
                Experiment with colors, typography, layouts, and animations to find the perfect 
                inspiration for your next project.
              </motion.p>
              
              <motion.div 
                className="pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: getEasing() }}
              >
                <VibeInfo />
              </motion.div>
            </section>
            
            {/* Right column - Demo elements */}
            <motion.section 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: getEasing() }}
            >
              <VibeDemoElements />
            </motion.section>
          </motion.div>
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
        <motion.div 
          id="gallery-section"
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: getEasing() }}
        >
          <VibeGallery />
        </motion.div>
        
        {/* Testimonials section */}
        <div className="mt-24">
          <Testimonials />
        </div>
        
        {/* CTA section */}
        <div className="mt-16">
          <DesignCTA />
        </div>
      </main>

      <motion.footer 
        className="relative z-10 mt-auto py-6 px-4 sm:px-6 lg:px-8 border-t backdrop-blur-sm bg-background/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, ease: getEasing() }}
      >
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Vibe UI - The ultimate UI/UX design inspiration platform
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Gallery</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div 
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }} 
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString()} · {currentVibe.name}
            </span>
          </div>
        </div>
      </motion.footer>
      
      <Toaster />
    </div>
  );
};

const Index = () => {
  return (
    <VibeProvider>
      <VibeContent />
    </VibeProvider>
  );
};

export default Index;
