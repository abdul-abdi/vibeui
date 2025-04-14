import React, { useRef, useEffect } from 'react';
import { useVibe } from '@/lib/vibe-engine';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Palette, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

export function VibeGallery() {
  const { aiVibes, vibeState, changeVibe } = useVibe();
  const currentVibeId = vibeState.currentVibe.id;
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Don't show the gallery if there are no AI vibes
  if (aiVibes.length === 0) {
    return null;
  }
  
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: getEasing()
      }
    })
  };

  return (
    <motion.section 
      ref={containerRef}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, ease: getEasing() }}
    >
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: getEasing() }}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">AI Generated Vibes</h2>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
          >
            <Palette className="h-5 w-5 text-primary" />
          </motion.div>
        </div>
        <Badge variant="outline" className="px-2">
          {aiVibes.length} {aiVibes.length === 1 ? 'vibe' : 'vibes'}
        </Badge>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.5, delay: 0.2, ease: getEasing() }}
      >
        <Carousel className="w-full pb-10">
          <CarouselContent>
            {aiVibes.map((vibe, index) => (
              <CarouselItem key={vibe.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 p-1">
                <motion.div
                  custom={index}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={cardVariants}
                >
                  <Card className={`h-full transition-all hover:shadow-lg ${
                    currentVibeId === vibe.id ? 'ring-2 ring-primary' : ''
                  } group`}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center gap-2 text-lg">
                        <span className="truncate">{vibe.name}</span>
                        {currentVibeId === vibe.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                          >
                            <Badge variant="secondary" className="flex-shrink-0">Current</Badge>
                          </motion.div>
                        )}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{vibe.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <motion.div 
                        className="flex flex-wrap gap-2 mb-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, ease: getEasing() }}
                      >
                        <motion.div 
                          className="w-6 h-6 rounded-full border cursor-pointer relative group/color" 
                          style={{ background: vibe.colors.primary }}
                          title="Primary"
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity">Primary</span>
                        </motion.div>
                        <motion.div 
                          className="w-6 h-6 rounded-full border cursor-pointer relative group/color" 
                          style={{ background: vibe.colors.secondary }}
                          title="Secondary"
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity">Secondary</span>
                        </motion.div>
                        <motion.div 
                          className="w-6 h-6 rounded-full border cursor-pointer relative group/color" 
                          style={{ background: vibe.colors.accent }}
                          title="Accent"
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity">Accent</span>
                        </motion.div>
                        <motion.div 
                          className="w-6 h-6 rounded-full border cursor-pointer relative group/color" 
                          style={{ background: vibe.colors.background }}
                          title="Background"
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity">Background</span>
                        </motion.div>
                      </motion.div>
                      <Badge variant="outline" className="capitalize">
                        Layout: {vibe.layout}
                      </Badge>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant={currentVibeId === vibe.id ? "secondary" : "default"} 
                        className="w-full group/btn relative overflow-hidden" 
                        onClick={() => changeVibe(vibe.id)}
                      >
                        <motion.span
                          className="absolute inset-0 bg-primary/10"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                        {currentVibeId === vibe.id ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Applied
                          </>
                        ) : (
                          'Apply Vibe'
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious 
            className="left-1 bg-background/70 backdrop-blur-sm hover:bg-background/90"
            aria-label="Previous vibe"
          >
            <ChevronLeft className="h-4 w-4" />
          </CarouselPrevious>
          <CarouselNext 
            className="right-1 bg-background/70 backdrop-blur-sm hover:bg-background/90" 
            aria-label="Next vibe"
          >
            <ChevronRight className="h-4 w-4" />
          </CarouselNext>
        </Carousel>
      </motion.div>
    </motion.section>
  );
}
