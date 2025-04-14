
import React from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, ThumbsUp, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';

export function DesignInspiration() {
  const { vibeState } = useVibe();
  const { currentVibe } = vibeState;
  
  // Helper for consistent easing
  const getEasing = () => {
    const easing = currentVibe.animation.easing;
    if (Array.isArray(easing)) {
      return easing;
    }
    return [0.4, 0, 0.2, 1];
  };

  // Check for specific vibes to apply special styling
  const isSoftOrganic = currentVibe.name.toLowerCase().includes("organic") || 
                        currentVibe.name.toLowerCase().includes("soft") || 
                        currentVibe.name.toLowerCase().includes("natural");
  
  const isDarkTech = currentVibe.name.toLowerCase().includes("techno") || 
                    currentVibe.name.toLowerCase().includes("cyber") || 
                    currentVibe.name.toLowerCase().includes("digital") || 
                    currentVibe.name.toLowerCase().includes("tech");
                    
  const isBrutalist = currentVibe.name.toLowerCase().includes("brutal") || 
                      currentVibe.name.toLowerCase().includes("neo") || 
                      currentVibe.name.toLowerCase().includes("bold");

  const getInspoBgClass = () => {
    if (isSoftOrganic) return "bg-gradient-to-br from-emerald-50 to-emerald-100/50";
    if (isDarkTech) return "bg-gradient-to-br from-slate-900 to-slate-800";
    if (isBrutalist) return "bg-yellow-50";
    return "bg-gradient-to-br from-slate-50 to-slate-100/50";
  };

  const benefits = [
    {
      icon: <Lightbulb className="h-5 w-5" />,
      text: "Break creative blocks with instant design inspiration"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      text: "Stay updated with the latest UI/UX design trends"
    },
    {
      icon: <ThumbsUp className="h-5 w-5" />,
      text: "Create cohesive design systems that users love"
    }
  ];

  return (
    <section className={`py-24 ${getInspoBgClass()}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: getEasing() }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Endless Inspiration for
              <span className="block text-primary">Modern Designers</span>
            </h2>
            
            <p className="text-lg text-muted-foreground">
              VibeUI helps you explore the vast landscape of design possibilities, empowering you to
              create interfaces that stand out in a crowded digital world.
            </p>
            
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: getEasing() }}
                  className="flex items-center gap-3"
                >
                  <div className={`p-2 rounded-full ${
                    isSoftOrganic ? 'bg-emerald-100 text-emerald-600' : 
                    isDarkTech ? 'bg-indigo-900 text-indigo-300' : 
                    'bg-primary/10 text-primary'
                  }`}>
                    {benefit.icon}
                  </div>
                  <span className={`${isDarkTech ? 'text-slate-100' : ''}`}>{benefit.text}</span>
                </motion.li>
              ))}
            </ul>
            
            <div className="pt-4">
              <Button className="group">
                Explore Design Resources
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: getEasing() }}
            className="relative"
          >
            <div className="aspect-square max-w-lg mx-auto relative">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-4">
                <motion.div 
                  className="bg-card rounded-lg shadow-lg overflow-hidden"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="h-20 bg-primary/20"></div>
                  <div className="p-4">
                    <div className="w-3/4 h-3 bg-muted rounded mb-2"></div>
                    <div className="w-1/2 h-3 bg-muted rounded"></div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-card rounded-lg shadow-lg overflow-hidden"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="p-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full mb-3 mx-auto"></div>
                    <div className="w-3/4 h-3 bg-muted rounded mb-2 mx-auto"></div>
                    <div className="w-1/2 h-3 bg-muted rounded mx-auto"></div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-card rounded-lg shadow-lg overflow-hidden"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="p-4 flex gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-full h-3 bg-muted rounded"></div>
                      <div className="w-2/3 h-3 bg-muted rounded"></div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-card rounded-lg shadow-lg overflow-hidden"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="p-4">
                    <div className="flex gap-1 mb-3">
                      <div className="w-8 h-2 bg-primary/40 rounded-full"></div>
                      <div className="w-8 h-2 bg-muted rounded-full"></div>
                      <div className="w-8 h-2 bg-muted rounded-full"></div>
                    </div>
                    <div className="w-full h-24 bg-muted rounded-lg"></div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Animated circles in background */}
            <motion.div 
              className="absolute -z-10 w-64 h-64 rounded-full bg-primary/10"
              style={{ top: '10%', left: '10%' }}
              animate={{ 
                scale: [1, 1.2, 1], 
                opacity: [0.3, 0.2, 0.3] 
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div 
              className="absolute -z-10 w-40 h-40 rounded-full bg-secondary/20"
              style={{ bottom: '10%', right: '15%' }}
              animate={{ 
                scale: [1, 1.1, 1], 
                opacity: [0.2, 0.1, 0.2] 
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
