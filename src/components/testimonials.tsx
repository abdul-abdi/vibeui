import React, { useEffect, useState } from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { Card, CardContent } from '@/components/ui/card';
import { m } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Quote } from 'lucide-react';

export function Testimonials() {
  const { vibeState } = useVibe();
  const { currentVibe } = vibeState;
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false);
  
  useEffect(() => {
    // Check if low-performance mode should be enabled
    const isLowPerf = localStorage.getItem('lowPerformanceMode') === 'true';
    setIsLowPerformanceMode(isLowPerf);
  }, []);
  
  // Helper for consistent easing
  const getEasing = () => {
    const easing = currentVibe.animation.easing;
    if (Array.isArray(easing)) {
      return easing;
    }
    return [0.4, 0, 0.2, 1];
  };

  const testimonials = [
    {
      content: "VibeUI has been incredibly helpful for our design exploration process. It's a great tool for getting quick visual concepts.",
      author: "Alex Morgan",
      role: "UX Designer",
      avatar: "AM",
      company: "CreativeFlow"
    },
    {
      content: "As a UI/UX educator, I find VibeUI useful for demonstrating different design systems to my students. It's a practical learning tool.",
      author: "Sarah Chen",
      role: "Design Educator",
      avatar: "SC",
      company: "DesignAcademy"
    },
    {
      content: "The ability to quickly switch between different interface styles helps us show various options to clients during the conceptual phase.",
      author: "Marcus Johnson",
      role: "UI/UX Consultant",
      avatar: "MJ",
      company: "DesignStudio"
    }
  ];

  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <m.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: isLowPerformanceMode ? "-50px" : "-100px" }}
          transition={{ duration: isLowPerformanceMode ? 0.3 : 0.6, ease: getEasing() }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">What Designers Are Saying</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            See how VibeUI is helping designers explore visual concepts and find inspiration.
          </p>
        </m.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((item, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: isLowPerformanceMode ? "-50px" : "-100px" }}
              transition={{ 
                delay: isLowPerformanceMode ? 0 : index * 0.1, 
                duration: isLowPerformanceMode ? 0.3 : 0.5, 
                ease: getEasing() 
              }}
            >
              <Card className="h-full">
                <CardContent className="p-4 sm:p-6">
                  <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-primary/40 mb-3 sm:mb-4" />
                  <p className="mb-4 sm:mb-6 text-base sm:text-lg">{item.content}</p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 mr-3 sm:mr-4">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">{item.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">{item.author}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{item.role}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {item.company}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
