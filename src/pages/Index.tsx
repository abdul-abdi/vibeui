
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

  // Determine vibe for specific styling
  const isSoftOrganic = currentVibe.name.toLowerCase().includes("organic");
  const isDarkTech = currentVibe.name.toLowerCase().includes("techno");
  const isBrutalist = currentVibe.name.toLowerCase().includes("brutal");
  const isPlayful = currentVibe.name.toLowerCase().includes("playful") || 
                  currentVibe.name.toLowerCase().includes("vibrant");
  const isElectric = currentVibe.name.toLowerCase().includes("electric") || 
                    currentVibe.name.toLowerCase().includes("pop") ||
                    currentVibe.name.toLowerCase().includes("neon");
  
  // Dynamic container classes based on vibe
  const containerClass = isSoftOrganic ? 'soft-organic-container' : 
                         isDarkTech ? 'dark-tech-container' :
                         isBrutalist ? 'brutalist-container' :
                         isPlayful ? 'playful-container' :
                         isElectric ? 'electric-container' : '';

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
      
      {/* Special background effects for specific themes */}
      {isSoftOrganic && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 h-64 pointer-events-none z-0 opacity-20"
          style={{
            background: 'linear-gradient(to top, rgba(16, 185, 129, 0.1) 0%, transparent 100%)',
          }}
        />
      )}
      
      {isDarkTech && (
        <motion.div 
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
          <motion.div 
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
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10 flex-grow">
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
              This UI dynamically changes its entire appearance, layout, and interactions
              based on the selected vibe theme. Experience responsive design, smooth animations, 
              and cohesive styling across all components.
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
          
          /* Soft Organic Theme-specific styles */
          .soft-organic-theme .soft-organic-card {
            border-radius: 24px;
            border-color: rgba(16, 185, 129, 0.2);
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.1);
          }
          
          .soft-organic-theme .soft-organic-primary-button {
            border-radius: 24px;
            background-color: hsl(160, 84%, 39%);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
          }
          
          .soft-organic-theme .soft-organic-secondary-button {
            border-radius: 24px;
            background-color: rgba(16, 185, 129, 0.1);
            color: hsl(160, 84%, 39%);
          }
          
          .soft-organic-theme .soft-organic-outline-button {
            border-radius: 24px;
            border-color: rgba(16, 185, 129, 0.3);
            color: hsl(160, 84%, 39%);
          }
          
          .soft-organic-theme .soft-organic-input {
            border-radius: 16px;
            border-color: rgba(16, 185, 129, 0.2);
          }
          
          .soft-organic-theme .soft-organic-badge {
            background-color: rgba(16, 185, 129, 0.1);
            color: hsl(160, 84%, 39%);
            border-radius: 12px;
          }
          
          /* Dark Techno Theme-specific styles */
          .dark-techno-theme .dark-tech-card {
            background-color: rgba(30, 30, 35, 0.7);
            border-color: rgba(139, 92, 246, 0.3);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          }
          
          .dark-techno-theme .neon-glow-button {
            border: 1px solid rgba(var(--primary-rgb), 0.7);
            box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.5);
            text-shadow: 0 0 5px rgba(var(--primary-rgb), 0.5);
          }
          
          .dark-techno-theme .neon-outline-button {
            background-color: transparent;
            border: 1px solid rgba(var(--primary-rgb), 0.7);
            color: hsl(var(--primary));
            text-shadow: 0 0 5px rgba(var(--primary-rgb), 0.5);
          }
          
          .dark-techno-theme .neon-input {
            background-color: rgba(30, 30, 35, 0.5);
            border-color: rgba(var(--primary-rgb), 0.3);
          }
          
          .dark-techno-theme .neon-badge {
            background-color: rgba(var(--primary-rgb), 0.2);
            text-shadow: 0 0 5px rgba(var(--primary-rgb), 0.5);
          }
          
          /* Neo Brutalism Theme-specific styles */
          .neo-brutalism-theme .brutalist-card {
            background-color: #ffffff;
            border: 2px solid #000000;
            box-shadow: 4px 4px 0 #000000;
            border-radius: 0;
          }
          
          .neo-brutalism-theme .brutal-button {
            background-color: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
            border: 2px solid #000000;
            box-shadow: 3px 3px 0 #000000;
            border-radius: 0;
            transition: transform 0.1s ease, box-shadow 0.1s ease;
          }
          
          .neo-brutalism-theme .brutal-button:hover {
            transform: translate(-1px, -1px);
            box-shadow: 4px 4px 0 #000000;
          }
          
          .neo-brutalism-theme .brutal-button:active {
            transform: translate(2px, 2px);
            box-shadow: 1px 1px 0 #000000;
          }
          
          /* Electric Pop Theme-specific styles */
          .electric-pop-theme .neon-card {
            background-color: rgba(10, 10, 20, 0.8);
            border-color: rgba(var(--primary-rgb), 0.5);
            box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3);
          }
          
          .electric-pop-theme .neon-glow-button {
            border: 1px solid rgba(var(--primary-rgb), 0.7);
            box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.5);
            text-shadow: 0 0 5px rgba(var(--primary-rgb), 0.5);
            background: linear-gradient(45deg, hsl(var(--primary)), hsl(var(--accent)));
            animation: neon-pulse 2s infinite;
          }
          
          /* Text styles */
          .vibe-attribute {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0.5rem;
          }
          
          .vibe-attribute-label {
            font-size: 0.75rem;
            color: hsl(var(--muted-foreground));
          }
          
          .vibe-attribute-value {
            font-size: 0.875rem;
            font-weight: 500;
          }
          
          /* For demo color pills */
          .vibe-color-pill {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 2rem;
            padding: 0 0.75rem;
            font-size: 0.75rem;
            font-weight: 500;
            border-radius: 9999px;
          }
          
          /* Animated elements utility class */
          .animated-element {
            transition: all 0.3s ease;
          }
          
          /* Typography specifics for different themes */
          .soft-organic-theme h1, .soft-organic-theme h2, .soft-organic-theme h3 {
            color: hsl(160, 84%, 20%);
          }
          
          .dark-techno-theme h1, .dark-techno-theme h2, .dark-techno-theme h3 {
            text-shadow: 0 0 8px rgba(var(--primary-rgb), 0.5);
          }
          
          .electric-pop-theme h1, .electric-pop-theme h2, .electric-pop-theme h3 {
            background: linear-gradient(45deg, hsl(var(--primary)), hsl(var(--accent)));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: color-cycle 10s infinite;
          }
          
          /* Typewriter effect for headings */
          .typewriter-effect {
            display: inline-block;
            overflow: hidden;
            border-right: 2px solid;
            white-space: nowrap;
            margin: 0;
            animation: typewriter 3.5s steps(40, end), blink 1s step-end infinite;
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
