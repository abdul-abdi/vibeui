
import React, { useRef } from 'react';
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
import { Check, Palette, ChevronRight, ChevronLeft, Wand2 } from 'lucide-react';
import { motion, useInView, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';

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

  // Interactive card shine effect
  const CardWithShine = ({ children, index }: { children: React.ReactNode, index: number }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
    };
    
    const backgroundX = useTransform(
      mouseX,
      [0, 300],
      [-50, 50]
    );
    const backgroundY = useTransform(
      mouseY,
      [0, 300],
      [-50, 50]
    );
    
    const maskImage = useMotionTemplate`radial-gradient(
      180px circle at ${backgroundX}px ${backgroundY}px,
      rgba(255, 255, 255, 0.8),
      transparent 80%
    )`;
    
    return (
      <motion.div
        custom={index}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={cardVariants}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="relative h-full"
      >
        <div 
          className="relative z-10 h-full"
          onMouseMove={handleMouseMove}
        >
          <motion.div
            className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 pointer-events-none transition-opacity duration-500"
            style={{ maskImage }}
          />
          {children}
        </div>
      </motion.div>
    );
  };

  // Check if current vibe is electric/playful for special styles
  const isElectricOrPlayful = vibeState.currentVibe.name.toLowerCase().includes("electric") || 
                             vibeState.currentVibe.name.toLowerCase().includes("pop") ||
                             vibeState.currentVibe.name.toLowerCase().includes("neon") ||
                             vibeState.currentVibe.name.toLowerCase().includes("playful");

  return (
    <motion.section 
      ref={containerRef}
      className="space-y-6 relative"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, ease: getEasing() }}
    >
      {/* Background element */}
      <motion.div 
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background/0 via-accent/5 to-background/0 rounded-xl opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1 }}
      />
      
      <motion.div 
        className="flex flex-wrap justify-between items-center relative z-10 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: getEasing() }}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">AI Generated Vibes</h2>
          <motion.div
            animate={{ 
              rotate: [0, 360], 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            <Wand2 className="h-5 w-5 text-primary" />
          </motion.div>
        </div>
        <Badge 
          variant="outline" 
          className="px-2 bg-background/50 backdrop-blur-sm border-primary/20"
        >
          {aiVibes.length} {aiVibes.length === 1 ? 'vibe' : 'vibes'}
        </Badge>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.5, delay: 0.2, ease: getEasing() }}
        className="relative pb-16"
      >
        <Carousel className="w-full">
          <CarouselContent>
            {aiVibes.map((vibe, index) => (
              <CarouselItem key={vibe.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 p-1 h-full">
                <CardWithShine index={index}>
                  <Card 
                    className={`h-full transition-all duration-300 group hover:shadow-lg border border-border/50 ${
                      currentVibeId === vibe.id ? 'ring-2 ring-primary shadow-lg' : ''
                    }`}
                  >
                    <CardHeader className="relative">
                      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardTitle className="flex justify-between items-center gap-2 text-lg">
                        <span className="truncate">{vibe.name}</span>
                        {currentVibeId === vibe.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                          >
                            <Badge variant="secondary" className="flex-shrink-0 bg-primary/20 text-primary-foreground">
                              Current
                            </Badge>
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
                          style={{ background: `hsl(${vibe.colors.primary})` }}
                          title="Primary"
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity shadow-md">Primary</span>
                        </motion.div>
                        <motion.div 
                          className="w-6 h-6 rounded-full border cursor-pointer relative group/color" 
                          style={{ background: `hsl(${vibe.colors.secondary})` }}
                          title="Secondary"
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity shadow-md">Secondary</span>
                        </motion.div>
                        <motion.div 
                          className="w-6 h-6 rounded-full border cursor-pointer relative group/color" 
                          style={{ background: `hsl(${vibe.colors.accent})` }}
                          title="Accent"
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity shadow-md">Accent</span>
                        </motion.div>
                        <motion.div 
                          className="w-6 h-6 rounded-full border cursor-pointer relative group/color" 
                          style={{ background: `hsl(${vibe.colors.background})` }}
                          title="Background"
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover/color:opacity-100 transition-opacity shadow-md">Background</span>
                        </motion.div>
                      </motion.div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="capitalize bg-card/50">
                          Layout: {vibe.layout}
                        </Badge>
                        <Badge variant="outline" className="capitalize bg-card/50">
                          Speed: {vibe.animation.speed}x
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="mt-auto">
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
                          <>
                            <Palette className="mr-2 h-4 w-4" />
                            Apply Vibe
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </CardWithShine>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious 
            className={`left-1 bg-background/70 backdrop-blur-sm hover:bg-background/90 border border-border/50 ${isElectricOrPlayful ? 'text-primary-foreground' : ''}`}
            aria-label="Previous vibe"
          >
            <ChevronLeft className="h-4 w-4" />
          </CarouselPrevious>
          <CarouselNext 
            className={`right-1 bg-background/70 backdrop-blur-sm hover:bg-background/90 border border-border/50 ${isElectricOrPlayful ? 'text-primary-foreground' : ''}`}
            aria-label="Next vibe"
          >
            <ChevronRight className="h-4 w-4" />
          </CarouselNext>
        </Carousel>
      </motion.div>
    </motion.section>
  );
}
