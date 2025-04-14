
import React from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Circle, Layout, Type, Clock } from 'lucide-react';

export function VibeInfo() {
  const { vibeState } = useVibe();
  const { currentVibe } = vibeState;
  
  const getEasing = () => {
    const easing = currentVibe.animation.easing;
    if (Array.isArray(easing)) {
      return easing;
    }
    return [0.4, 0, 0.2, 1];
  };

  const colorVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3 * (1/currentVibe.animation.speed),
        ease: getEasing()
      }
    })
  };

  const primaryFont = currentVibe.fonts.primary.split(',')[0].replace(/'/g, '');
  
  // Check if this is the "Soft Organic" vibe
  const isSoftOrganic = currentVibe.name.toLowerCase().includes("organic");
  const cardClass = isSoftOrganic ? 'soft-organic-card' : '';
  
  return (
    <div className={`vibe-info-card ${cardClass}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: getEasing() }}
      >
        <div className="flex items-center gap-2">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <Circle className="h-3 w-3 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800">
            {currentVibe.name}
          </h2>
        </div>
        
        <p className="text-muted-foreground mt-2 text-sm">
          {currentVibe.description}
        </p>

        <div className="grid grid-cols-4 gap-6 mt-6">
          {/* Layout */}
          <div className="vibe-attribute">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layout className="h-5 w-5 text-primary" />
            </div>
            <span className="vibe-attribute-label">Layout</span>
            <span className="vibe-attribute-value capitalize">
              {currentVibe.layout}
            </span>
          </div>
          
          {/* Typography */}
          <div className="vibe-attribute">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Type className="h-5 w-5 text-primary" />
            </div>
            <span className="vibe-attribute-label">Typography</span>
            <span className="vibe-attribute-value">
              {primaryFont}
            </span>
          </div>
          
          {/* Animation */}
          <div className="vibe-attribute">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <span className="vibe-attribute-label">Animation</span>
            <span className="vibe-attribute-value">
              {currentVibe.animation.speed}x
            </span>
          </div>
          
          {/* Radius */}
          <div className="vibe-attribute">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h2a8 8 0 0 1 8-8v2" />
                <path d="M2 12v-2a8 8 0 0 1 8-8h2" />
                <path d="M22 12h-2a8 8 0 0 1-8 8v-2" />
                <path d="M22 12v2a8 8 0 0 1-8 8h-2" />
              </svg>
            </div>
            <span className="vibe-attribute-label">Radius</span>
            <span className="vibe-attribute-value">
              {currentVibe.radius.md}
            </span>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700">Color Palette</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={colorVariants}
              className="vibe-color-pill bg-primary text-primary-foreground"
            >
              Primary
            </motion.div>
            
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={colorVariants}
              className="vibe-color-pill bg-secondary text-secondary-foreground"
            >
              Secondary
            </motion.div>
            
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={colorVariants}
              className="vibe-color-pill bg-accent text-accent-foreground"
            >
              Accent
            </motion.div>
            
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={colorVariants}
              className="vibe-color-pill bg-muted text-muted-foreground"
            >
              Muted
            </motion.div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6 text-xs text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 16V9h14V2"></path>
            <path d="M5 22V21"></path>
            <path d="M19 22v-6"></path>
            <path d="M5 9a3 3 0 0 0 3-3 3 3 0 0 0-3-3"></path>
            <path d="M19 9a3 3 0 0 1-3-3 3 3 0 0 1 3-3"></path>
          </svg>
          <span>Generated with Vibe Engine</span>
        </div>
      </motion.div>
    </div>
  );
}
