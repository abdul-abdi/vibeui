import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, Palette, Wand2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVibe } from '@/lib/vibe-engine';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Animation timing constants for consistency
const ANIMATION_DURATION = {
  fast: 0.2,
  medium: 0.3,
  slow: 0.5
};

// Standard easing functions
const EASING = {
  standard: [0.4, 0, 0.2, 1],
  decelerate: [0, 0, 0.2, 1],
  accelerate: [0.4, 0, 1, 1]
};

interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
  icon: React.ReactNode;
  highlight?: string;
  elementToHighlight?: string; // ID or class of element to highlight in UI
}

export function OnboardingTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [didChangedVibe, setDidChangedVibe] = useState(false);
  const { changeVibe, vibeState } = useVibe();
  const spotlightRef = useRef<HTMLDivElement>(null);
  
  // Check if this is the first visit using localStorage
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('vibeui_onboarding_completed');
    if (!hasSeenOnboarding) {
      // Add a small delay to ensure the UI has loaded first
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('vibeui_onboarding_completed', 'true');
    setIsOpen(false);
  };

  // Safely demonstrate vibe change without interfering with the current UI state
  const demonstrateVibeChange = useCallback(() => {
    if (!didChangedVibe && !vibeState.isLocked) {
      // Use a different approach to demonstrate a vibe change without actually changing the main UI
      setDidChangedVibe(true);
      return true;
    }
    return false;
  }, [didChangedVibe, vibeState.isLocked]);

  const steps: OnboardingStep[] = [
    {
      title: "Welcome to VibeUI Shift",
      description: "Discover a new way to explore UI design through dynamic theming. Let's walk through the key features of our platform.",
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      highlight: "hero"
    },
    {
      title: "Vibe Generation",
      description: "Click 'New Vibe' to randomly generate a completely new design system. Each vibe affects colors, typography, spacing, animations, and more.",
      icon: <ChevronRight className="h-6 w-6 text-primary" />,
      highlight: "newVibe",
      elementToHighlight: ".vibe-new-button"
    },
    {
      title: "AI-Powered Designs",
      description: "Generate custom vibes by describing themes and moods. Our AI will create a unique design system tailored to your needs.",
      icon: <Wand2 className="h-6 w-6 text-primary" />,
      highlight: "aiVibe",
      elementToHighlight: ".vibe-ai-button"
    },
    {
      title: "Lock Your Favorite Vibes",
      description: "Found a vibe you love? Lock it to prevent accidental changes while you explore the interface.",
      icon: <Lock className="h-6 w-6 text-primary" />,
      highlight: "lockVibe",
      elementToHighlight: ".vibe-lock-button"
    },
    {
      title: "Explore Design Inspiration",
      description: "Browse through our gallery of components to see how different vibes transform UI elements.",
      icon: <Palette className="h-6 w-6 text-primary" />,
      highlight: "gallery"
    }
  ];

  // When step changes to the vibe generation step, demonstrate it
  useEffect(() => {
    if (isOpen && currentStep === 1) {
      // Only demonstrate visually in the tutorial without changing actual vibe
      demonstrateVibeChange();
    }
    
    // Add spotlight effect to highlight elements in the UI
    if (isOpen && steps[currentStep].elementToHighlight) {
      const elementToHighlight = document.querySelector(steps[currentStep].elementToHighlight || '');
      if (elementToHighlight && spotlightRef.current) {
        const rect = elementToHighlight.getBoundingClientRect();
        spotlightRef.current.style.top = `${rect.top - 8}px`;
        spotlightRef.current.style.left = `${rect.left - 8}px`;
        spotlightRef.current.style.width = `${rect.width + 16}px`;
        spotlightRef.current.style.height = `${rect.height + 16}px`;
        spotlightRef.current.style.opacity = '1';
      }
    } else if (spotlightRef.current) {
      spotlightRef.current.style.opacity = '0';
    }
  }, [isOpen, currentStep, demonstrateVibeChange, steps]);

  // Reset demonstration state when the dialog closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setDidChangedVibe(false);
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = '0';
      }
    }
  }, [isOpen]);

  return (
    <>
      {/* Spotlight element for highlighting UI elements */}
      <div 
        ref={spotlightRef}
        className="fixed pointer-events-none z-[9999] rounded-lg transition-all duration-500 ease-in-out shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.3)]"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />
      
      {/* Trigger button for reopening the tutorial */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 gap-2 shadow-md hover:shadow-lg transition-shadow"
        aria-label="Open tutorial"
      >
        <Sparkles className="h-4 w-4" />
        <span className="ml-1">Tutorial</span>
      </Button>

      {/* Onboarding Dialog */}
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            // Reset when dialog closes
            setCurrentStep(0);
            setDidChangedVibe(false);
          }
        }}
      >
        <DialogContent 
          className="sm:max-w-[500px] p-0 overflow-hidden bg-card shadow-xl border border-border/30"
          aria-labelledby="onboarding-title"
        >
          {/* Progress Indicator */}
          <div className="w-full bg-muted h-1.5 rounded-t-lg overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: ANIMATION_DURATION.medium, ease: EASING.standard }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: ANIMATION_DURATION.medium, ease: EASING.standard }}
              className="p-6"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-primary/10 flex items-center justify-center">
                  {steps[currentStep].icon}
                </div>
                <DialogTitle id="onboarding-title" className="text-xl font-semibold">
                  {steps[currentStep].title}
                </DialogTitle>
              </div>
              
              <DialogDescription className="text-base mb-8 leading-relaxed">
                {steps[currentStep].description}
              </DialogDescription>

              {/* Example visualization based on the current step */}
              <div className="rounded-lg p-5 bg-muted/40 backdrop-blur-sm mb-6 min-h-36 flex items-center justify-center shadow-sm border border-border/20">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: ANIMATION_DURATION.medium, ease: EASING.standard }}
                  className="text-center w-full"
                >
                  {steps[currentStep].highlight === "hero" && (
                    <div className="text-center">
                      <motion.h3 
                        className="text-2xl font-bold mb-2"
                        animate={{ 
                          y: [0, -5, 0],
                          scale: [1, 1.02, 1] 
                        }}
                        transition={{ 
                          duration: 2, 
                          ease: "easeInOut", 
                          repeat: Infinity, 
                          repeatDelay: 3 
                        }}
                      >
                        VibeUI <span className="text-primary">Shift</span>
                      </motion.h3>
                      <p className="text-muted-foreground">Transform your design inspiration journey</p>
                    </div>
                  )}
                  
                  {steps[currentStep].highlight === "newVibe" && (
                    <div className="flex flex-col items-center">
                      <Button 
                        className={cn(
                          "animated-element relative overflow-hidden group mb-3 shadow-md",
                          didChangedVibe ? "bg-primary/80" : ""
                        )}
                        onClick={() => setDidChangedVibe(true)}
                      >
                        <motion.span
                          className="absolute inset-0 bg-primary/20"
                          initial={{ x: '-100%' }}
                          animate={didChangedVibe ? { x: '100%' } : { x: '-100%' }}
                          transition={{ duration: ANIMATION_DURATION.slow, ease: EASING.standard }}
                        />
                        <span className="relative z-10 font-medium">New Vibe</span>
                        <motion.div
                          animate={{ rotate: didChangedVibe ? 360 : 0 }}
                          transition={{ duration: ANIMATION_DURATION.slow, ease: EASING.standard }}
                          className="ml-2 relative z-10"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </motion.div>
                      </Button>
                      <div className="text-sm text-muted-foreground mt-2 max-w-[250px]">
                        {didChangedVibe ? (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: ANIMATION_DURATION.fast }}
                          >
                            <span className="text-primary font-medium">The UI transformed!</span> A new design system has been applied.
                          </motion.div>
                        ) : (
                          "Watch as the entire UI transforms with a single click"
                        )}
                      </div>
                    </div>
                  )}
                  
                  {steps[currentStep].highlight === "aiVibe" && (
                    <div className="flex flex-col items-center">
                      <Button 
                        variant="outline"
                        className="mb-3 flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                      >
                        <motion.div
                          animate={{ 
                            rotate: [0, 15, -15, 0] 
                          }}
                          transition={{ 
                            duration: 1.5, 
                            ease: "easeInOut", 
                            repeat: Infinity, 
                            repeatDelay: 2 
                          }}
                        >
                          <Wand2 className="h-4 w-4 text-primary" />
                        </motion.div>
                        <span className="font-medium">Generate AI Vibe</span>
                      </Button>
                      <div className="text-sm text-muted-foreground mt-2 px-4 py-2 bg-background/50 rounded-md border border-border/30 shadow-sm">
                        "Create a <span className="text-primary font-medium">futuristic neon cyberpunk</span> theme"
                      </div>
                    </div>
                  )}
                  
                  {steps[currentStep].highlight === "lockVibe" && (
                    <div className="flex flex-col items-center">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="w-12 h-12 mb-3 shadow-sm hover:shadow-md transition-all"
                        >
                          <Lock className="h-5 w-5 text-primary" />
                        </Button>
                      </motion.div>
                      <div className="text-sm text-muted-foreground mt-2 max-w-[250px]">
                        Lock your favorite vibe to prevent changes while exploring
                      </div>
                    </div>
                  )}
                  
                  {steps[currentStep].highlight === "gallery" && (
                    <div>
                      <div className="grid grid-cols-2 gap-3 max-w-[300px] mx-auto">
                        <motion.div 
                          className="h-20 rounded-md bg-primary/20 flex items-center justify-center shadow-sm border border-primary/20"
                          whileHover={{ y: -2, scale: 1.02 }}
                          transition={{ duration: ANIMATION_DURATION.fast }}
                        >
                          <span className="font-medium">Card</span>
                        </motion.div>
                        <motion.div 
                          className="h-20 rounded-md bg-secondary/20 flex items-center justify-center shadow-sm border border-secondary/20"
                          whileHover={{ y: -2, scale: 1.02 }}
                          transition={{ duration: ANIMATION_DURATION.fast }}
                        >
                          <span className="font-medium">Button</span>
                        </motion.div>
                        <motion.div 
                          className="h-20 rounded-md bg-accent/20 flex items-center justify-center shadow-sm border border-accent/20"
                          whileHover={{ y: -2, scale: 1.02 }}
                          transition={{ duration: ANIMATION_DURATION.fast }}
                        >
                          <span className="font-medium">Input</span>
                        </motion.div>
                        <motion.div 
                          className="h-20 rounded-md bg-muted flex items-center justify-center shadow-sm border border-muted/50"
                          whileHover={{ y: -2, scale: 1.02 }}
                          transition={{ duration: ANIMATION_DURATION.fast }}
                        >
                          <span className="font-medium">Modal</span>
                        </motion.div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">
                        Explore how components transform with each vibe
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="gap-2 hover:bg-muted/50 transition-colors"
                  aria-label="Go back to previous step"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="gap-2 shadow-sm hover:shadow-md transition-all"
                    aria-label="Go to next step"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleCompleteOnboarding}
                    className="gap-2 shadow-sm hover:shadow-md transition-all" 
                    aria-label="Complete tutorial"
                  >
                    <span>Get Started</span>
                    <motion.div
                      animate={{ 
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.1, 1] 
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        repeatDelay: 2 
                      }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
} 