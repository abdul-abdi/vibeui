
import React from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { GitBranch, Lightbulb, Megaphone, Share2 } from 'lucide-react';

export function DesignCTA() {
  const { vibeState, changeVibe } = useVibe();
  const { currentVibe } = vibeState;
  
  // Helper for consistent easing
  const getEasing = () => {
    const easing = currentVibe.animation.easing;
    if (Array.isArray(easing)) {
      return easing;
    }
    return [0.4, 0, 0.2, 1];
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full translate-x-1/3 translate-y-1/3"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: getEasing() }}
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-6">
            <Megaphone className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Start Designing Better</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Transform Your Design Process with <span className="text-primary">VibeUI</span>
          </h2>
          
          <p className="text-xl text-muted-foreground">
            Join thousands of designers who use VibeUI to create exceptional user interfaces
            and deliver outstanding experiences that users love.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={() => changeVibe()} className="gap-2">
              <Lightbulb className="h-5 w-5" />
              Generate New Vibe
            </Button>
            
            <Button variant="outline" size="lg" className="gap-2">
              <GitBranch className="h-5 w-5" />
              Fork this Project
            </Button>
          </div>
          
          <div className="pt-10 flex items-center justify-center">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                JD
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-xs">
                AM
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center text-xs">
                RK
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/50 flex items-center justify-center text-xs">
                MJ
              </div>
            </div>
            <p className="ml-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">2,500+</span> designers already using VibeUI
            </p>
            
            <div className="ml-auto flex items-center">
              <Button variant="ghost" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
