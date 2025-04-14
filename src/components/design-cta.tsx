import React from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { m } from 'framer-motion';
import { Button } from './ui/button';
import { Lightbulb, Megaphone } from 'lucide-react';

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
        <m.div 
          className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <m.div 
          className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full translate-x-1/3 translate-y-1/3"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
      
      <div className="container mx-auto px-4">
        <m.div 
          className="max-w-3xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: getEasing() }}
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-6">
            <Megaphone className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Design Inspiration</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Explore Design Possibilities with <span className="text-primary">VibeUI</span>
          </h2>
          
          <p className="text-xl text-muted-foreground">
            Discover different UI styles and design systems to inspire your next project
            and enhance your creative process.
          </p>
          
          <div className="flex items-center justify-center pt-4">
            <Button size="lg" onClick={() => changeVibe()} className="gap-2">
              <Lightbulb className="h-5 w-5" />
              Generate New Vibe
            </Button>
          </div>
          
          <div className="pt-10 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              A design inspiration tool for UI/UX creators
            </p>
          </div>
        </m.div>
      </div>
    </section>
  );
}
