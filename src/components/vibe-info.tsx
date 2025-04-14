import React from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Palette, Type, Layers, Circle } from 'lucide-react';

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
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: getEasing() }}
    >
      <Card className="overflow-hidden backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4, ease: getEasing() }}
            >
              {currentVibe.name}
            </motion.span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Palette className="h-5 w-5 text-primary" />
            </motion.div>
          </CardTitle>
          <CardDescription className="line-clamp-2">{currentVibe.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, ease: getEasing() }}
          >
            <motion.div 
              className="flex flex-col items-center space-y-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, ease: getEasing() }}
            >
              <Circle className="h-5 w-5 text-primary mb-1" />
              <h4 className="text-sm font-semibold">Layout</h4>
              <Badge variant="outline" className="capitalize">
                {currentVibe.layout}
              </Badge>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center space-y-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, ease: getEasing() }}
            >
              <Type className="h-5 w-5 text-primary mb-1" />
              <h4 className="text-sm font-semibold">Typography</h4>
              <p className="text-xs text-center text-muted-foreground">
                {primaryFont}
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center space-y-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, ease: getEasing() }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mb-1">
                <path d="M5 16V9h14V2"></path>
                <path d="M5 22V21"></path>
                <path d="M19 22v-6"></path>
                <path d="M5 9a3 3 0 0 0 3-3 3 3 0 0 0-3-3"></path>
                <path d="M19 9a3 3 0 0 1-3-3 3 3 0 0 1 3-3"></path>
              </svg>
              <h4 className="text-sm font-semibold">Animation</h4>
              <p className="text-xs text-center text-muted-foreground">
                {currentVibe.animation.speed}x speed
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center space-y-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, ease: getEasing() }}
            >
              <Circle className="h-5 w-5 text-primary mb-1" />
              <h4 className="text-sm font-semibold">Radius</h4>
              <p className="text-xs text-center text-muted-foreground">
                {currentVibe.radius.md}
              </p>
            </motion.div>
          </motion.div>
          
          <div className="space-y-3">
            <motion.h4 
              className="text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, ease: getEasing() }}
            >
              Color Palette
            </motion.h4>
            <motion.div 
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, ease: getEasing() }}
            >
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={colorVariants}
                className="relative group"
              >
                <Badge variant="secondary" className="bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
                  Primary
                </Badge>
              </motion.div>
              
              <motion.div
                custom={1}
                initial="hidden"
                animate="visible"
                variants={colorVariants}
                className="relative group"
              >
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground group-hover:scale-110 transition-transform">
                  Secondary
                </Badge>
              </motion.div>
              
              <motion.div
                custom={2}
                initial="hidden"
                animate="visible"
                variants={colorVariants}
                className="relative group"
              >
                <Badge variant="secondary" className="bg-accent text-accent-foreground group-hover:scale-110 transition-transform">
                  Accent
                </Badge>
              </motion.div>
              
              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                variants={colorVariants}
                className="relative group"
              >
                <Badge variant="secondary" className="bg-muted text-muted-foreground group-hover:scale-110 transition-transform">
                  Muted
                </Badge>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, ease: getEasing() }}
          >
            <div className="text-xs text-muted-foreground flex items-center justify-end gap-2">
              <Layers className="h-3 w-3" />
              <span>Generated with Vibe Engine</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
