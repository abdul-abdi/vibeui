import React, { useEffect, useRef } from 'react';
import { VibeProvider, useVibe } from '@/lib/vibe-engine';
import { VibeControls } from '@/components/vibe-controls';
import { VibeInfo } from '@/components/vibe-info';
import { VibeDemoElements } from '@/components/vibe-demo-elements';
import { VibeGallery } from '@/components/vibe-gallery';
import { Toaster } from '@/components/ui/toaster';
import { motion, Variants, useMotionTemplate, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';

const VibeContent = () => {
  const { vibeState, changeVibe } = useVibe();
  const { currentVibe } = vibeState;
  const prevVibeRef = useRef(currentVibe);
  
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

  useEffect(() => {
    prevVibeRef.current = currentVibe;
  }, [currentVibe]);

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

  const layoutVariants: Record<string, {
    containerClass: string;
    variants: Variants;
  }> = {
    standard: { 
      containerClass: "grid gap-8 grid-cols-1 lg:grid-cols-2",
      variants: {
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.5 * (1/currentVibe.animation.speed), 
            ease: getEasing()
          } 
        },
        exit: {
          opacity: 0,
          y: -20,
          transition: {
            duration: 0.3 * (1/currentVibe.animation.speed),
            ease: getEasing()
          }
        }
      }
    },
    sidebar: {
      containerClass: "grid gap-8 grid-cols-1 lg:grid-cols-[280px_1fr]",
      variants: {
        hidden: { opacity: 0, x: -50 },
        visible: { 
          opacity: 1, 
          x: 0, 
          transition: { 
            duration: 0.6 * (1/currentVibe.animation.speed),
            ease: getEasing()
          } 
        },
        exit: {
          opacity: 0,
          x: 50,
          transition: {
            duration: 0.3 * (1/currentVibe.animation.speed),
            ease: getEasing()
          }
        }
      }
    },
    asymmetric: {
      containerClass: "grid gap-8 grid-cols-1 lg:grid-cols-[2fr_1fr]",
      variants: {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
          opacity: 1, 
          scale: 1, 
          transition: { 
            duration: 0.5 * (1/currentVibe.animation.speed),
            ease: getEasing() 
          } 
        },
        exit: {
          opacity: 0,
          scale: 1.05,
          transition: {
            duration: 0.3 * (1/currentVibe.animation.speed),
            ease: getEasing()
          }
        }
      }
    },
    centered: {
      containerClass: "flex flex-col items-center",
      variants: {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1, 
          transition: { 
            duration: 0.4 * (1/currentVibe.animation.speed),
            ease: getEasing() 
          } 
        },
        exit: {
          opacity: 0,
          transition: {
            duration: 0.3 * (1/currentVibe.animation.speed),
            ease: getEasing()
          }
        }
      }
    },
  };

  const currentLayout = layoutVariants[currentVibe.layout] || layoutVariants.standard;

  const handleScrollDown = () => {
    const gallerySection = document.getElementById('gallery-section');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fadeInVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        delay: i * 0.1, 
        ease: getEasing() 
      }
    }),
    exit: { 
      opacity: 0, 
      y: -10, 
      transition: { 
        duration: 0.3, 
        ease: getEasing() 
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: getEasing() } 
    },
    hover: { 
      y: -10, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2, ease: getEasing() } 
    },
    exit: { 
      opacity: 0, 
      y: 10, 
      transition: { duration: 0.3, ease: getEasing() } 
    }
  };

  const contentFlowVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        ease: getEasing()
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        ease: getEasing()
      }
    }
  };

  const [scrollY, setScrollY] = React.useState(0);
  
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

  return (
    <div 
      className="min-h-screen bg-background text-foreground transition-colors duration-500 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
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

      <motion.header 
        className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 border-b backdrop-blur-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.4 * (1/currentVibe.animation.speed), 
          ease: getEasing() 
        }}
        style={{ y: headerParallax }}
      >
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: getEasing() }}
          >
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Vibe UI
              <motion.span 
                className="inline-block text-primary relative"
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
            <p className="text-muted-foreground">
              A dynamic UI experience that changes on every reload
            </p>
          </motion.div>
          <VibeControls />
        </div>
      </motion.header>

      <motion.main 
        className="container relative z-10 mx-auto py-8 px-4 sm:px-6 lg:px-8 overflow-hidden"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={contentFlowVariants}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentVibe.id}
            className={currentLayout.containerClass}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentFlowVariants}
          >
            <motion.section 
              className={`space-y-6 ${currentVibe.layout === 'centered' ? 'max-w-2xl mx-auto text-center' : ''}`}
              variants={currentLayout.variants}
            >
              <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="absolute -z-10 w-full h-full blur-3xl opacity-20 bg-gradient-to-r from-primary/50 via-accent/30 to-secondary/50"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 0.98, 1]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                <motion.h2 
                  className="text-3xl font-bold tracking-tight"
                  variants={fadeInVariants}
                  custom={0}
                >
                  Current Vibe: <span className="text-primary">{currentVibe.name}</span>
                </motion.h2>
                
                <motion.p 
                  className="text-lg text-muted-foreground mt-3 max-w-2xl"
                  variants={fadeInVariants}
                  custom={1}
                >
                  This UI dynamically changes its entire appearance, layout, and interactions
                  based on the randomly selected vibe. Reload the page or click "New Vibe" to experience
                  a completely different UI while maintaining functionality.
                </motion.p>
              </motion.div>
              
              <motion.div 
                className="pt-6"
                variants={fadeInVariants}
                custom={2}
              >
                <VibeInfo />
              </motion.div>
            </motion.section>
            
            <motion.section 
              className={`space-y-6 ${currentVibe.layout === 'centered' ? 'max-w-2xl mx-auto' : ''}`}
              variants={currentLayout.variants}
            >
              <motion.div 
                whileInView={{ opacity: [0, 1], y: [20, 0] }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <VibeDemoElements />
              </motion.div>
            </motion.section>
          </motion.div>
        </AnimatePresence>
        
        {currentVibe.layout === 'centered' && (
          <motion.div 
            className="flex justify-center mt-12 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5, ease: getEasing() }}
          >
            <button 
              onClick={handleScrollDown} 
              className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors group"
              aria-label="Scroll down to gallery"
            >
              <span className="mb-2 group-hover:scale-105 transition-transform">Explore Gallery</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="group-hover:text-primary"
              >
                <ArrowDown strokeWidth={1.5} />
              </motion.div>
            </button>
          </motion.div>
        )}
        
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
      </motion.main>

      <motion.footer 
        className="relative z-10 mt-auto py-6 px-4 sm:px-6 lg:px-8 border-t backdrop-blur-lg"
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
          
          .layout-standard,
          .layout-asymmetric,
          .layout-centered,
          .layout-sidebar {
            transition: all 0.5s ease;
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
