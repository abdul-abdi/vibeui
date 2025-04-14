
import React from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Circle, 
  Layout, 
  Type, 
  Clock, 
  Palette, 
  Sparkles, 
  Smartphone, 
  CheckCircle2, 
  Layers, 
  Shuffle 
} from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function VibeInfo() {
  const { vibeState, changeVibe } = useVibe();
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
  
  // Check for specific vibes to apply special styles
  const isSoftOrganic = currentVibe.name.toLowerCase().includes("organic");
  const isDarkTech = currentVibe.name.toLowerCase().includes("techno") || 
                    currentVibe.name.toLowerCase().includes("dark");
  const isBrutalist = currentVibe.name.toLowerCase().includes("brutal");
  const isPlayful = currentVibe.name.toLowerCase().includes("playful") ||
                   currentVibe.name.toLowerCase().includes("vibrant");
  const isElectric = currentVibe.name.toLowerCase().includes("electric") || 
                    currentVibe.name.toLowerCase().includes("pop") ||
                    currentVibe.name.toLowerCase().includes("neon");
  
  const cardClass = isSoftOrganic ? 'soft-organic-card' : 
                    isDarkTech ? 'dark-tech-card' :
                    isBrutalist ? 'brutalist-card' :
                    isPlayful ? 'playful-card' : '';

  // Generate color gradient background based on vibe
  const generateGradientStyle = () => {
    if (isSoftOrganic) {
      return 'bg-gradient-to-br from-emerald-50 to-emerald-100/50';
    } else if (isDarkTech) {
      return 'bg-gradient-to-br from-slate-900 to-slate-800';
    } else if (isBrutalist) {
      return 'bg-yellow-50';
    } else if (isPlayful) {
      return 'bg-gradient-to-br from-purple-50 to-pink-50';
    } else if (isElectric) {
      return 'bg-gradient-to-br from-slate-800 to-slate-900';
    } else {
      return 'bg-gradient-to-br from-slate-50 to-slate-100/50';
    }
  };
  
  return (
    <div className={`vibe-info-card ${cardClass} h-full`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: getEasing() }}
        className="h-full flex flex-col"
      >
        <div className="flex items-center gap-2">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className={`w-10 h-10 rounded-full ${isSoftOrganic ? 'bg-emerald-100' : isDarkTech ? 'bg-slate-800' : 'bg-primary/20'} flex items-center justify-center`}
          >
            {isSoftOrganic ? (
              <Palette className="h-5 w-5 text-emerald-600" />
            ) : isDarkTech ? (
              <Layers className="h-5 w-5 text-purple-400" />
            ) : isBrutalist ? (
              <Shuffle className="h-5 w-5 text-primary" />
            ) : isElectric ? (
              <Sparkles className="h-5 w-5 text-primary" />
            ) : (
              <Circle className="h-5 w-5 text-primary" />
            )}
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold">
              {currentVibe.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={isSoftOrganic ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}>
                {currentVibe.layout.charAt(0).toUpperCase() + currentVibe.layout.slice(1)} Layout
              </Badge>
              <Badge variant="outline" className={isDarkTech ? 'bg-slate-800 text-slate-200 border-slate-700' : ''}>
                {currentVibe.animation.speed}x Animation
              </Badge>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground mt-3 text-sm">
          {currentVibe.description}
        </p>

        <Card className={`mt-6 border ${isSoftOrganic ? 'border-emerald-200' : isDarkTech ? 'border-slate-700' : ''} ${generateGradientStyle()}`}>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-6">
              {/* Layout */}
              <div className="vibe-attribute flex flex-col gap-1">
                <div className={`w-10 h-10 rounded-lg ${isSoftOrganic ? 'bg-white' : 'bg-primary/10'} flex items-center justify-center mb-1`}>
                  <Layout className={`h-5 w-5 ${isSoftOrganic ? 'text-emerald-600' : 'text-primary'}`} />
                </div>
                <span className="vibe-attribute-label text-xs text-muted-foreground">Layout</span>
                <span className="vibe-attribute-value text-sm font-medium capitalize">
                  {currentVibe.layout}
                </span>
              </div>
              
              {/* Typography */}
              <div className="vibe-attribute flex flex-col gap-1">
                <div className={`w-10 h-10 rounded-lg ${isSoftOrganic ? 'bg-white' : 'bg-primary/10'} flex items-center justify-center mb-1`}>
                  <Type className={`h-5 w-5 ${isSoftOrganic ? 'text-emerald-600' : 'text-primary'}`} />
                </div>
                <span className="vibe-attribute-label text-xs text-muted-foreground">Typography</span>
                <span className="vibe-attribute-value text-sm font-medium">
                  {primaryFont}
                </span>
              </div>
              
              {/* Animation */}
              <div className="vibe-attribute flex flex-col gap-1">
                <div className={`w-10 h-10 rounded-lg ${isSoftOrganic ? 'bg-white' : 'bg-primary/10'} flex items-center justify-center mb-1`}>
                  <Clock className={`h-5 w-5 ${isSoftOrganic ? 'text-emerald-600' : 'text-primary'}`} />
                </div>
                <span className="vibe-attribute-label text-xs text-muted-foreground">Animation</span>
                <span className="vibe-attribute-value text-sm font-medium">
                  {currentVibe.animation.speed}x
                </span>
              </div>
              
              {/* Radius */}
              <div className="vibe-attribute flex flex-col gap-1">
                <div className={`w-10 h-10 rounded-lg ${isSoftOrganic ? 'bg-white' : 'bg-primary/10'} flex items-center justify-center mb-1 ${isSoftOrganic ? 'text-emerald-600' : 'text-primary'}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12h2a8 8 0 0 1 8-8v2" />
                    <path d="M2 12v-2a8 8 0 0 1 8-8h2" />
                    <path d="M22 12h-2a8 8 0 0 1-8 8v-2" />
                    <path d="M22 12v2a8 8 0 0 1-8 8h-2" />
                  </svg>
                </div>
                <span className="vibe-attribute-label text-xs text-muted-foreground">Radius</span>
                <span className="vibe-attribute-value text-sm font-medium">
                  {currentVibe.radius.md}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Color Palette</h3>
          <div className="grid grid-cols-4 gap-2">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={colorVariants}
              className="flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-md bg-primary mb-1" />
              <span className="text-xs text-muted-foreground">Primary</span>
            </motion.div>
            
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={colorVariants}
              className="flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-md bg-secondary mb-1" />
              <span className="text-xs text-muted-foreground">Secondary</span>
            </motion.div>
            
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={colorVariants}
              className="flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-md bg-accent mb-1" />
              <span className="text-xs text-muted-foreground">Accent</span>
            </motion.div>
            
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={colorVariants}
              className="flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-md bg-muted mb-1" />
              <span className="text-xs text-muted-foreground">Muted</span>
            </motion.div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Responsive Design</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <Smartphone className="h-4 w-4 text-muted-foreground mr-1.5" />
              <span className="text-xs text-muted-foreground">Mobile-first design</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground mr-1.5" />
              <span className="text-xs text-muted-foreground">Adaptive layouts</span>
            </div>
          </div>
        </div>

        <TooltipProvider>
          <div className="flex items-center justify-between mt-auto pt-8">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 16V9h14V2"></path>
                <path d="M5 22V21"></path>
                <path d="M19 22v-6"></path>
                <path d="M5 9a3 3 0 0 0 3-3 3 3 0 0 0-3-3"></path>
                <path d="M19 9a3 3 0 0 1-3-3 3 3 0 0 1 3-3"></path>
              </svg>
              <span>Generated with Vibe Engine</span>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`text-xs ${isSoftOrganic ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700' : ''}`}
                  onClick={() => changeVibe()}
                >
                  <Shuffle className="h-3 w-3 mr-1" /> New Style
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate a new random vibe</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </motion.div>
    </div>
  );
}
