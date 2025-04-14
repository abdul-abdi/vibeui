
import React, { useEffect, useRef, useState } from 'react';
import { VibeProvider, useVibe } from '@/lib/vibe-engine';
import { VibeControls } from '@/components/vibe-controls';
import { VibeInfo } from '@/components/vibe-info';
import { VibeDemoElements } from '@/components/vibe-demo-elements';
import { VibeGallery } from '@/components/vibe-gallery';
import { Toaster } from '@/components/ui/toaster';
import { motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { ArrowDown, Sparkles, ChevronLeft } from 'lucide-react';

const VibeContent = () => {
  const { vibeState, changeVibe } = useVibe();
  const { currentVibe } = vibeState;
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!vibeState.isLocked) {
      if (isInitialLoad.current) {
        setTimeout(() => {
          changeVibe();
          isInitialLoad.current = false;
        }, 300);
      }
    }
  }, []);

  const getEasing = () => {
    const easing = currentVibe.animation.easing;
    if (Array.isArray(easing)) {
      return easing;
    }
    return [0.4, 0, 0.2, 1];
  };

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

  // Determine if this is the "Soft Organic" vibe
  const isSoftOrganic = currentVibe.name.toLowerCase().includes("organic");
  const containerClass = isSoftOrganic ? 'soft-organic-container' : '';

  return (
    <div 
      className={`min-h-screen bg-background transition-colors duration-500 relative ${containerClass}`}
      onMouseMove={handleMouseMove}
    >
      {/* Background effects */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{ background: backgroundGradient }}
      />
      
      <motion.div
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
        style={{ y: backgroundParallax }}
      />

      {/* Header */}
      <motion.header 
        className="relative z-10 py-4 px-4 sm:px-6 lg:px-8"
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
              <div className="flex flex-col items-start">
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
                <p className="text-muted-foreground text-sm mt-1">
                  A dynamic UI experience that changes on every reload
                </p>
              </div>
            </motion.div>
            <div className="vibe-control-panel">
              <VibeControls />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
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
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <ChevronLeft className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">
                Current Vibe: <span className="text-primary">{currentVibe.name}</span>
              </h2>
            </motion.div>
            
            <motion.p 
              className="text-lg text-muted-foreground mt-3 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: getEasing() }}
            >
              This UI dynamically changes its entire appearance, layout, and interactions
              based on the randomly selected vibe. Reload the page or click "New Vibe" to experience
              a completely different UI while maintaining functionality.
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
      </main>

      <motion.footer 
        className="relative z-10 mt-auto py-6 px-4 sm:px-6 lg:px-8 border-t backdrop-blur-sm bg-background/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, ease: getEasing() }}
      >
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Vibe UI - A dynamic UI experience that changes on every page reload
          </p>
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
      
      <style>
        {`
          :root {
            transition: color 0.5s ease, background-color 0.5s ease;
          }
          
          .transitioning-vibe * {
            transition: background-color 0.6s ease, 
                        border-color 0.6s ease, 
                        color 0.6s ease,
                        box-shadow 0.6s ease,
                        transform 0.6s ease;
          }
          
          /* Enhanced scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: hsl(var(--primary) / 0.3);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: hsl(var(--primary) / 0.5);
          }
          
          ::-webkit-scrollbar-track {
            background: hsl(var(--muted) / 0.3);
          }
        `}
      </style>
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
