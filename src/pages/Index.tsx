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
import { DesignCapabilities } from '@/components/design-capabilities';
import { Toaster } from '@/components/ui/toaster';
import { motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { ArrowDown, Sparkles, ChevronLeft, Palette, Layers, Zap, Monitor, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';

const checkVibeType = (vibeName: string, keywords: string[]): boolean => {
  const lowerName = vibeName.toLowerCase();
  return keywords.some(keyword => lowerName.includes(keyword));
};

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
  }, [changeVibe, vibeState.isLocked]);

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

  const isSoftOrganic = checkVibeType(currentVibe.name, ["organic", "soft", "natural"]);
  const isDarkTech = checkVibeType(currentVibe.name, ["techno", "cyber", "digital", "tech"]);
  const isBrutalist = checkVibeType(currentVibe.name, ["brutal", "neo", "bold"]);
  const isPlayful = checkVibeType(currentVibe.name, ["playful", "vibrant", "fun", "creative"]);
  const isElectric = checkVibeType(currentVibe.name, ["electric", "pop", "neon", "bright"]);

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
      
      <motion.div 
        className="fixed bottom-0 left-0 right-0 h-64 pointer-events-none z-0 opacity-20 hardware-accelerated"
        style={{
          background: 'linear-gradient(to top, rgba(16, 185, 129, 0.1) 0%, transparent 100%)',
        }}
      />
      
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
      
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0 opacity-30 hardware-accelerated"
        style={{
          background: 'linear-gradient(45deg, rgba(var(--primary-rgb), 0.1) 0%, rgba(var(--accent-rgb), 0.1) 100%)',
        }}
      />
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hardware-accelerated">
        <div className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: 'linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
        />
      </div>
      
      <motion.header 
        className="relative z-10 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 backdrop-blur-sm bg-background/70 border-b border-border/20"
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
                  <motion.span
                    initial={{ rotate: -5 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="inline-block"
                  >
                    Vibe<span className="text-primary">UI</span>
                  </motion.span>
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
                <p className="text-sm text-muted-foreground mt-1 flex items-center">
                  <span>The designer's inspiration platform</span>
                  <motion.span 
                    className="inline-flex ml-2 bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    New
                  </motion.span>
                </p>
              </div>
            </motion.div>
            <div className="vibe-control-panel w-full sm:w-auto">
              <VibeControls />
            </div>
          </div>
        </div>
      </motion.header>

      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
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
                Generate endless UI inspiration, explore complete design systems, and create exceptional user experiences in seconds.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" onClick={() => changeVibe()} className="gap-2 relative overflow-hidden group">
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
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
              
              <motion.div 
                className="mt-8 flex items-center justify-center lg:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs border-2 border-background">
                    JD
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-xs border-2 border-background">
                    AM
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center text-xs border-2 border-background">
                    RK
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/50 flex items-center justify-center text-xs border-2 border-background">
                    +
                  </div>
                </div>
                <p className="ml-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">2,500+</span> designers already using VibeUI
                </p>
              </motion.div>
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
                
                <motion.div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0.8, 1.1, 0.8] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 3 
                  }}
                >
                  <div className="bg-primary/20 backdrop-blur-sm rounded-full p-3 border border-primary/30">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                </motion.div>
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
              
              <motion.div 
                className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/4 pointer-events-none"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <div className="bg-card/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border">
                  <div className="flex items-center gap-2">
                    <MousePointer className="h-4 w-4 text-primary" />
                    <p className="text-sm">Interactive Preview</p>
                  </div>
                </div>
              </motion.div>
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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-grow">
        <div id="vibe-info-section" className="pt-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: getEasing() }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
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
        
        <div className="mt-24">
          <DesignCapabilities />
        </div>
        
        <div id="feature-section" className="mt-16">
          <FeatureShowcase />
        </div>
        
        <div className="mt-16">
          <DesignInspiration />
        </div>
        
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
        
        <div className="mt-16">
          <Testimonials />
        </div>
        
        <div className="mt-16">
          <DesignCTA />
        </div>
      </main>

      <motion.footer 
        className="relative z-10 mt-auto py-8 px-4 sm:px-6 lg:px-8 border-t backdrop-blur-sm bg-background/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, ease: getEasing() }}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">VibeUI</h3>
              <p className="text-sm text-muted-foreground">
                The ultimate platform for UI/UX design inspiration, helping designers create exceptional user experiences.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Features</h3>
              <ul className="space-y-2">
                <li><a href="#feature-section" className="text-sm text-muted-foreground hover:text-primary transition-colors">Design Systems</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Component Library</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Color Palettes</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Typography</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Discord</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">GitHub</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} VibeUI. All rights reserved.
            </p>
            
            <div className="flex items-center gap-2">
              <motion.div 
                className="h-2 w-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }} 
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <span className="text-sm text-muted-foreground">
                Current vibe: <span className="text-primary">{currentVibe.name}</span>
              </span>
            </div>
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
