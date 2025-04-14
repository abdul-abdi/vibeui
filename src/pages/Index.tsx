
import React, { useEffect } from 'react';
import { VibeProvider, useVibe } from '@/lib/vibe-engine';
import { VibeControls } from '@/components/vibe-controls';
import { VibeInfo } from '@/components/vibe-info';
import { VibeDemoElements } from '@/components/vibe-demo-elements';
import { VibeGallery } from '@/components/vibe-gallery';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const VibeContent = () => {
  const { vibeState, changeVibe } = useVibe();
  const { currentVibe } = vibeState;

  // Generate a new vibe on first load or page refresh
  useEffect(() => {
    if (!vibeState.isLocked) {
      changeVibe();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Dynamic layout variants based on the current vibe
  const layoutVariants = {
    standard: { 
      main: "grid gap-8 grid-cols-1 lg:grid-cols-2",
      enter: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.5 * (1/currentVibe.animation.speed) } },
    },
    sidebar: {
      main: "grid gap-8 grid-cols-1 lg:grid-cols-[280px_1fr]",
      enter: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0, transition: { duration: 0.6 * (1/currentVibe.animation.speed) } },
    },
    asymmetric: {
      main: "grid gap-8 grid-cols-1 lg:grid-cols-[2fr_1fr]",
      enter: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1, transition: { duration: 0.5 * (1/currentVibe.animation.speed) } },
    },
    centered: {
      main: "flex flex-col items-center",
      enter: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.4 * (1/currentVibe.animation.speed) } },
    },
  };

  const currentLayout = layoutVariants[currentVibe.layout] || layoutVariants.standard;

  // Scroll animation for centered layout
  const handleScrollDown = () => {
    const gallerySection = document.getElementById('gallery-section');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-500`}>
      <motion.header 
        className="py-6 px-4 sm:px-6 lg:px-8 border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.4 * (1/currentVibe.animation.speed), 
          ease: currentVibe.animation.easing 
        }}
      >
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">
              Vibe UI
              <span className="inline-block ml-2 text-primary">Shift</span>
            </h1>
            <p className="text-muted-foreground">
              A dynamic UI experience that changes on every reload
            </p>
          </motion.div>
          <VibeControls />
        </div>
      </motion.header>

      <motion.main 
        className="container mx-auto py-8 px-4 sm:px-6 lg:px-8"
        initial="enter"
        animate="animate"
        variants={{
          enter: { opacity: 0 },
          animate: { 
            opacity: 1, 
            transition: { 
              duration: 0.5, 
              staggerChildren: 0.1 * (1/currentVibe.animation.speed)
            } 
          }
        }}
      >
        <motion.div 
          className={currentLayout.main}
          variants={{
            enter: { opacity: 0 },
            animate: { opacity: 1 }
          }}
        >
          <motion.section 
            className={`space-y-6 ${currentVibe.layout === 'centered' ? 'max-w-2xl mx-auto text-center' : ''}`}
            variants={currentLayout}
          >
            <motion.h2 
              className="text-3xl font-bold tracking-tight"
              variants={{
                enter: { opacity: 0, y: 20 },
                animate: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { 
                    duration: 0.4 * (1/currentVibe.animation.speed) 
                  } 
                }
              }}
            >
              Current Vibe: <span className="text-primary">{currentVibe.name}</span>
            </motion.h2>
            
            <motion.p 
              className="text-lg text-muted-foreground"
              variants={{
                enter: { opacity: 0, y: 20 },
                animate: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { 
                    duration: 0.4 * (1/currentVibe.animation.speed),
                    delay: 0.1
                  } 
                }
              }}
            >
              This UI dynamically changes its entire appearance, layout, and interactions
              based on the randomly selected vibe. Reload the page or click "New Vibe" to experience
              a completely different UI while maintaining functionality.
            </motion.p>
            
            <motion.div 
              className="pt-4"
              variants={{
                enter: { opacity: 0, y: 20 },
                animate: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { 
                    duration: 0.4 * (1/currentVibe.animation.speed),
                    delay: 0.2
                  } 
                }
              }}
            >
              <VibeInfo />
            </motion.div>
          </motion.section>
          
          <motion.section 
            className={`space-y-6 ${currentVibe.layout === 'centered' ? 'max-w-2xl mx-auto' : ''}`}
            variants={currentLayout}
          >
            <VibeDemoElements />
          </motion.section>
        </motion.div>
        
        {currentVibe.layout === 'centered' && (
          <motion.div 
            className="flex justify-center mt-12 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <button 
              onClick={handleScrollDown} 
              className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
              aria-label="Scroll down to gallery"
            >
              <span className="mb-2">Explore Gallery</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
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
          transition={{ duration: 0.6 }}
        >
          <VibeGallery />
        </motion.div>
      </motion.main>

      <motion.footer 
        className="mt-auto py-6 px-4 sm:px-6 lg:px-8 border-t"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Vibe UI - A dynamic UI experience that changes on every page reload
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-soft"></div>
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

// Wrap the main application with the VibeProvider
const Index = () => {
  return (
    <VibeProvider>
      <VibeContent />
    </VibeProvider>
  );
};

export default Index;
