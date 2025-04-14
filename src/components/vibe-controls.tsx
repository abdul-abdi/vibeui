
import React from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, RefreshCw, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { AiVibeGenerator } from '@/components/ai-vibe-generator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

export function VibeControls() {
  const { vibeState, changeVibe, toggleLock, previousVibe, nextVibe, isGenerating } = useVibe();
  const canGoBack = vibeState.vibeHistory && vibeState.vibeHistory.length > 1;
  const canGoForward = false; // We need to implement this logic to check if there are more vibes in history
  
  // Helper function to safely get easing for Framer Motion
  const getEasing = () => {
    const easing = vibeState.currentVibe.animation.easing;
    // If easing is already an array, use it directly
    if (Array.isArray(easing)) {
      return easing;
    }
    // Otherwise, use a default easing
    return [0.4, 0, 0.2, 1]; // default ease-in-out
  };

  // Controls container animation
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.08,
        ease: getEasing()
      }
    }
  };

  // Item animation for each control button
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: getEasing() }
    }
  };

  // Sparkles animation
  const sparkleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: [0, 1, 0], 
      scale: [0, 1, 0.5],
      transition: { duration: 1, repeat: Infinity, repeatDelay: 3 } 
    }
  };

  return (
    <motion.div 
      className="flex items-center gap-2 p-2 bg-card/80 backdrop-blur-sm rounded-md shadow-md border border-border/50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => previousVibe()}
                disabled={!canGoBack || vibeState.isLocked}
                className="w-8 h-8 relative"
                aria-label="Previous vibe"
              >
                <ChevronLeft className="h-4 w-4" />
                {canGoBack && (
                  <motion.span 
                    className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>Previous vibe</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button 
                variant="default" 
                onClick={() => changeVibe()}
                disabled={vibeState.isLocked}
                className="animated-element relative overflow-hidden group"
                aria-label="Generate new vibe"
              >
                <motion.span
                  className="absolute inset-0 bg-primary/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8 }}
                />
                <span className="relative z-10">New Vibe</span>
                <motion.div
                  animate={{ rotate: isGenerating ? 360 : 0 }}
                  transition={{ duration: 1, ease: "linear", repeat: isGenerating ? Infinity : 0 }}
                  className="ml-2 relative z-10"
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
              </Button>
              {!vibeState.isLocked && (
                <motion.div 
                  className="absolute top-0 right-0 -mt-1 -mr-1"
                  variants={sparkleVariants}
                >
                  <Sparkles className="h-3 w-3 text-primary" />
                </motion.div>
              )}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>Generate a random new vibe</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleLock}
                className={`w-8 h-8 ${vibeState.isLocked ? 'bg-primary/10' : ''} transition-colors`}
                aria-label={vibeState.isLocked ? "Unlock vibe changes" : "Lock current vibe"}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {vibeState.isLocked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Unlock className="h-4 w-4" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>{vibeState.isLocked ? 'Unlock vibe changes' : 'Lock current vibe'}</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => nextVibe()}
                disabled={!canGoForward || vibeState.isLocked}
                className="w-8 h-8"
                aria-label="Next vibe"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>Next vibe</TooltipContent>
        </Tooltip>
        
        <motion.div variants={itemVariants}>
          <AiVibeGenerator />
        </motion.div>
      </TooltipProvider>
    </motion.div>
  );
}
