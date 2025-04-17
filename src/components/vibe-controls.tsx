import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, RefreshCw, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { VibeHistory } from '@/components/vibe-history';
import { VibeComparison } from '@/components/vibe-comparison';
import { VibeCodeExport } from '@/components/vibe-code-export';
import { EnhancedAiVibeGenerator } from '@/components/enhanced-ai-vibe-generator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { m } from 'framer-motion';
import { cn } from '@/lib/utils';

// Animation timing constants for consistency - memoized
const ANIMATION_DURATION = Object.freeze({
  fast: 0.2,
  medium: 0.3,
  slow: 0.5
});

// Standard easing functions - memoized
const EASING = Object.freeze({
  standard: [0.4, 0, 0.2, 1],
  decelerate: [0, 0, 0.2, 1],
  accelerate: [0.4, 0, 1, 1]
});

// Add orientation prop type
type VibeControlsProps = {
  orientation?: 'horizontal' | 'vertical';
};

export function VibeControls({ orientation = 'horizontal' }: VibeControlsProps) {
  const { vibeState, changeVibe, toggleLock, previousVibe, nextVibe, isGenerating, historyIndex } = useVibe();
  
  // Calculate derived state only when history changes
  const canGoBack = useMemo(() => 
    historyIndex > 0, 
    [historyIndex]
  );
  
  const canGoForward = useMemo(() => 
    historyIndex < vibeState.vibeHistory.length - 1,
    [historyIndex, vibeState.vibeHistory]
  );
  
  // Check for low performance mode
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false);
  
  // Determine if current vibe is dark to apply additional contrast
  const [isDarkVibe, setIsDarkVibe] = useState(false);
  
  useEffect(() => {
    // Check if low-performance mode flag exists - only run once
    const isLowPerf = localStorage.getItem('lowPerformanceMode') === 'true';
    setIsLowPerformanceMode(isLowPerf);
  }, []);
  
  useEffect(() => {
    // Check if current vibe is dark - only when current vibe changes
    if (vibeState.currentVibe) {
      const backgroundLightness = getLightness(vibeState.currentVibe.colors.background);
      setIsDarkVibe(backgroundLightness < 50);
    }
  }, [vibeState.currentVibe]);
  
  // Helper function to extract lightness from HSL color
  const getLightness = useCallback((hslColor: string): number => {
    const parts = hslColor.split(' ');
    if (parts.length < 3) return 50;
    
    return parseFloat(parts[2].replace('%', ''));
  }, []);
  
  // Helper function to safely get easing for Framer Motion - memoized
  const getEasing = useMemo(() => {
    if (!vibeState.currentVibe) return EASING.standard;
    
    const easing = vibeState.currentVibe.animation.easing;
    // If easing is already an array, use it directly
    if (Array.isArray(easing)) {
      return easing;
    }
    // Otherwise, use a default easing
    return EASING.standard;
  }, [vibeState.currentVibe]);

  // Controls container animation - memoized based on performance mode
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: isLowPerformanceMode ? ANIMATION_DURATION.fast : ANIMATION_DURATION.medium,
        staggerChildren: isLowPerformanceMode ? 0 : 0.08,
        ease: getEasing
      }
    }
  }), [isLowPerformanceMode, getEasing]);

  // Item animation for each control button - memoized based on performance mode
  const itemVariants = useMemo(() => 
    isLowPerformanceMode ? 
    {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: ANIMATION_DURATION.fast } }
    } :
    {
      hidden: { opacity: 0, y: -10 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: ANIMATION_DURATION.medium, ease: getEasing }
      }
    }, [isLowPerformanceMode, getEasing]);

  // Sparkles animation - memoized and only used if not in low performance mode
  const sparkleVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: [0, 1, 0], 
      scale: [0, 1, 0.5],
      transition: { duration: 1, repeat: Infinity, repeatDelay: 3 } 
    }
  }), []);

  // Optimize event handler with useCallback
  const handleChangeVibe = useCallback(() => {
    // Ensure we don't interfere with onboarding tutorials
    if (!vibeState.isLocked) {
      changeVibe();
    }
  }, [vibeState.isLocked, changeVibe]);

  // Optimize handler with useCallback
  const handlePreviousVibe = useCallback(() => {
    console.log("Navigating to previous vibe");
    console.log("Current history:", vibeState.vibeHistory);
    console.log("Current vibe ID:", vibeState.currentVibe.id);
    previousVibe();
  }, [previousVibe, vibeState]);

  // Optimize handler with useCallback
  const handleNextVibe = useCallback(() => {
    console.log("Navigating to next vibe");
    console.log("Current history:", vibeState.vibeHistory);
    console.log("Current vibe ID:", vibeState.currentVibe.id);
    nextVibe();
  }, [nextVibe, vibeState]);

  // Memoize the controls to prevent unnecessary re-renders
  const controlButtons = useMemo(() => (
    <div className="flex items-center gap-1 sm:gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <m.div 
            variants={itemVariants}
            whileHover={!isLowPerformanceMode ? { scale: 1.05 } : undefined} 
            whileTap={!isLowPerformanceMode ? { scale: 0.95 } : undefined}
          >
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePreviousVibe}
              disabled={!canGoBack}
              className={cn(
                "w-7 h-7 sm:w-8 sm:h-8 relative vibe-prev-button",
                isDarkVibe && "border-primary/50 bg-background/90" // Enhanced visibility for dark vibes
              )}
              aria-label="Previous vibe"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              {!isLowPerformanceMode && canGoBack && (
                <m.span 
                  className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: ANIMATION_DURATION.fast }}
                />
              )}
            </Button>
          </m.div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Previous vibe</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <m.div 
            variants={itemVariants}
            whileHover={!isLowPerformanceMode ? { scale: 1.05 } : undefined} 
            whileTap={!isLowPerformanceMode ? { scale: 0.95 } : undefined}
            className="relative"
          >
            <Button 
              variant="default" 
              onClick={handleChangeVibe}
              disabled={vibeState.isLocked}
              className={cn(
                "animated-element relative overflow-hidden group vibe-new-button text-xs sm:text-sm",
                "shadow-sm hover:shadow-md transition-shadow px-2 sm:px-3 h-7 sm:h-8",
                isDarkVibe && "shadow-primary/20" // Add subtle glow for dark vibes
              )}
              aria-label="Generate new vibe"
            >
              {!isLowPerformanceMode && (
                <m.span
                  className="absolute inset-0 bg-primary/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: ANIMATION_DURATION.slow }}
                />
              )}
              <span className="relative z-10 font-medium">New Vibe</span>
              <m.div
                animate={isGenerating ? { rotate: 360 } : undefined}
                transition={isGenerating ? { duration: 1, ease: "linear", repeat: Infinity } : undefined}
                className="ml-1 sm:ml-2 relative z-10"
              >
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
              </m.div>
            </Button>
            {!isLowPerformanceMode && !vibeState.isLocked && (
              <m.div 
                className="absolute top-0 right-0 -mt-1 -mr-1"
                variants={sparkleVariants}
              >
                <Sparkles className={cn(
                  "h-2 w-2 sm:h-3 sm:w-3 text-primary",
                  isDarkVibe && "filter drop-shadow(0 0 2px hsl(var(--primary)))" // Add glow for dark vibes
                )} />
              </m.div>
            )}
          </m.div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Generate a random new vibe</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <m.div 
            variants={itemVariants}
            whileHover={!isLowPerformanceMode ? { scale: 1.05 } : undefined} 
            whileTap={!isLowPerformanceMode ? { scale: 0.95 } : undefined}
          >
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleLock}
              className={cn(
                "w-7 h-7 sm:w-8 sm:h-8 transition-colors vibe-lock-button",
                vibeState.isLocked ? "bg-primary/10 border-primary/30" : "",
                isDarkVibe && !vibeState.isLocked && "border-primary/50 bg-background/90" // Enhanced visibility for dark vibes
              )}
              aria-label={vibeState.isLocked ? "Unlock vibe changes" : "Lock current vibe"}
              aria-pressed={vibeState.isLocked}
            >
              <m.div
                initial={isLowPerformanceMode ? { scale: 1 } : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={isLowPerformanceMode ? {} : { type: "spring", stiffness: 300, damping: 15 }}
              >
                {vibeState.isLocked ? (
                  <Lock className={cn(
                    "h-3 w-3 sm:h-4 sm:w-4",
                    isDarkVibe && "text-primary filter drop-shadow(0 0 2px hsl(var(--primary)))" // Add glow for dark vibes
                  )} />
                ) : (
                  <Unlock className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </m.div>
            </Button>
          </m.div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{vibeState.isLocked ? 'Unlock vibe changes' : 'Lock current vibe'}</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <m.div 
            variants={itemVariants}
            whileHover={!isLowPerformanceMode ? { scale: 1.05 } : undefined} 
            whileTap={!isLowPerformanceMode ? { scale: 0.95 } : undefined}
          >
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNextVibe}
              disabled={!canGoForward}
              className={cn(
                "w-7 h-7 sm:w-8 sm:h-8 vibe-next-button relative",
                isDarkVibe && "border-primary/50 bg-background/90" // Enhanced visibility for dark vibes
              )}
              aria-label="Next vibe"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              {!isLowPerformanceMode && canGoForward && (
                <m.span 
                  className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: ANIMATION_DURATION.fast }}
                />
              )}
            </Button>
          </m.div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Next vibe</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ), [
    itemVariants, 
    isLowPerformanceMode, 
    handlePreviousVibe, 
    canGoBack, 
    vibeState.isLocked, 
    isDarkVibe, 
    sparkleVariants, 
    handleChangeVibe, 
    isGenerating,
    toggleLock, 
    handleNextVibe, 
    canGoForward
  ]);

  // Memoize additional controls to prevent unnecessary re-renders
  const additionalControls = useMemo(() => (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Only show the first button on small screens */}
      <m.div variants={itemVariants} className="block">
        <VibeHistory />
      </m.div>
      
      {/* Hide these on very small screens */}
      <m.div variants={itemVariants} className="block">
        <VibeComparison />
      </m.div>
      
      <m.div variants={itemVariants} className="hidden sm:block">
        <VibeCodeExport />
      </m.div>
    </div>
  ), [itemVariants]);

  return (
    <m.div 
      className={cn(
        "flex",
        orientation === 'vertical' 
          ? "flex-col items-stretch p-2" 
          : "items-center gap-2 p-2 sm:gap-3 sm:p-3",
        "bg-card/80 backdrop-blur-sm rounded-md shadow-md border border-border/30",
        isDarkVibe && "ring-1 ring-primary/30"
      )}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      aria-label="Vibe controls"
      role="toolbar"
      aria-orientation={orientation}
    >
      <TooltipProvider delayDuration={isLowPerformanceMode ? 1000 : 300}>
        {/* Navigation Controls Group (Apply padding when vertical) */}
        <div className={cn(orientation === 'vertical' && 'py-2')}> 
          {controlButtons}
        </div>
        
        {/* Visual separator between control groups (No vertical margin) */}
        <Separator 
          orientation={orientation === 'vertical' ? 'horizontal' : 'vertical'}
          className={cn(
            orientation === 'vertical' 
              ? 'w-full' // Horizontal separator style - No margin
              : 'h-6 sm:h-8 mx-1', // Vertical separator style
            isDarkVibe ? "opacity-50" : "opacity-30"
          )} 
        />

        {/* Additional controls (Apply padding when vertical) */}
        <div className={cn(orientation === 'vertical' && 'py-2')}> 
          {additionalControls}
        </div>

        {/* Visual separator before AI generator (No vertical margin) */}
        <Separator 
          orientation={orientation === 'vertical' ? 'horizontal' : 'vertical'}
          className={cn(
            orientation === 'vertical' 
              ? 'w-full' // Horizontal separator style - No margin
              : 'h-6 sm:h-8 mx-1 block', // Vertical separator style
            isDarkVibe ? "opacity-50" : "opacity-30" 
          )} 
        />
        
        {/* AI Generator (Apply padding when vertical) */}
        <div className={cn(orientation === 'vertical' && 'py-2')}> 
          <m.div variants={itemVariants} className="block">
            <EnhancedAiVibeGenerator />
          </m.div>
        </div>
      </TooltipProvider>
    </m.div>
  );
}
