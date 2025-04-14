
import React, { useRef } from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Palette, 
  Layers, 
  Paintbrush, 
  Type, 
  Figma, 
  Code2, 
  RefreshCw,
  Copy,
  Monitor,
  Smartphone,
  ColorPicker,
  SlidersHorizontal
} from 'lucide-react';

export function DesignCapabilities() {
  const { vibeState } = useVibe();
  const { currentVibe } = vibeState;
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  // Helper for consistent easing
  const getEasing = () => {
    const easing = currentVibe.animation.easing;
    if (Array.isArray(easing)) {
      return easing;
    }
    return [0.4, 0, 0.2, 1];
  };

  const capabilities = [
    {
      icon: <Palette className="h-7 w-7" />,
      title: "Dynamic Color Systems",
      description: "Generate perfect color palettes instantly with intelligent contrast handling",
      tags: ["HSL/RGB/HEX", "Accessibility", "Themes"]
    },
    {
      icon: <Type className="h-7 w-7" />,
      title: "Typography Scales",
      description: "Discover beautiful font pairings with responsive type scales",
      tags: ["Readability", "Hierarchy", "Leading"]
    },
    {
      icon: <Layers className="h-7 w-7" />,
      title: "Component Libraries",
      description: "Explore different component styles that maintain visual cohesion",
      tags: ["Shadows", "Borders", "States"]
    },
    {
      icon: <RefreshCw className="h-7 w-7" />,
      title: "Live Transformations",
      description: "See design systems transform in real-time as you explore options",
      tags: ["Interactive", "Immediate", "Fluid"]
    },
    {
      icon: <Monitor className="h-7 w-7" />,
      title: "Responsive Design",
      description: "Every design automatically adapts to all screen sizes with precision",
      tags: ["Mobile", "Tablet", "Desktop"]
    },
    {
      icon: <ColorPicker className="h-7 w-7" />,
      title: "Design Tokens",
      description: "Export design tokens for immediate use in your production system",
      tags: ["CSS Variables", "Theme", "Integration"]
    },
    {
      icon: <SlidersHorizontal className="h-7 w-7" />,
      title: "Animation Controls",
      description: "Fine-tune motion dynamics to perfectly match your brand's personality",
      tags: ["Timing", "Easing", "Transitions"]
    },
    {
      icon: <Figma className="h-7 w-7" />,
      title: "Design Tool Export",
      description: "Push generated styles directly to your favorite design tools",
      tags: ["Figma", "Sketch", "XD"]
    }
  ];

  return (
    <section ref={containerRef} className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-primary/5 rounded-full transform translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-secondary/5 rounded-full transform -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: getEasing() }}
        >
          <motion.div
            className="inline-flex items-center justify-center mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Paintbrush className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Design Superpowers</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">All the Tools You Need</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            VibeUI gives designers and developers the power to create, iterate, and perfect
            user interfaces with unprecedented speed and flexibility.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: getEasing() }}
              className="h-full"
            >
              <Card className="h-full group hover:shadow-md transition-all duration-300 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {item.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="bg-background/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.4, duration: 0.5, ease: getEasing() }}
        >
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">VibeUI</span> is constantly evolving with new features and capabilities based on designer feedback.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
