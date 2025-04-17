import React from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { 
  Palette, 
  Sparkles, 
  Shuffle, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Brush, 
  Component, 
  Layers, 
  Code, 
  Zap
} from 'lucide-react';
import { m } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

export function FeatureShowcase() {
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
  
  const featureItems = [
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Dynamic Color Themes",
      description: "Explore different color palettes and themes that can inspire your design projects."
    },
    {
      icon: <Component className="h-6 w-6" />,
      title: "UI Components",
      description: "Browse through various UI components and see how they adapt to different design styles."
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Responsive Layouts",
      description: "View how designs adapt to different screen sizes to ensure a consistent experience."
    },
    {
      icon: <Brush className="h-6 w-6" />,
      title: "Typography Examples",
      description: "See different font pairings and typographic styles that can enhance your designs."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Animation Inspiration",
      description: "Get inspiration for subtle animations and transitions that can improve user experience."
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Visual Reference",
      description: "Use VibeUI as a visual reference and inspiration source for your own design projects."
    }
  ];
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <m.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: getEasing() }}
        >
          <m.div 
            className="inline-flex items-center justify-center mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Design Inspiration</span>
          </m.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Explore Design Possibilities</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            VibeUI provides a collection of design inspirations to help spark creativity
            and explore different visual directions for your projects.
          </p>
        </m.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureItems.map((item, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: getEasing() }}
            >
              <Card className="h-full transition-all hover:shadow-md group relative overflow-hidden">
                <CardContent className="p-6 flex flex-col h-full">
                  <m.div
                    className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                    whileHover={{ opacity: 1 }}
                  />
                  <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground flex-grow">{item.description}</p>
                </CardContent>
              </Card>
            </m.div>
          ))}
        </div>

        <m.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5, ease: getEasing() }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => changeVibe()} className="gap-2">
              <Shuffle className="h-4 w-4" />
              Generate New Vibe
            </Button>
            {/* Button variant="outline" size="lg" className="gap-2">
              <Code className="h-4 w-4" />
              View Example
            </Button> */}
          </div>
        </m.div>
      </div>
    </section>
  );
}
