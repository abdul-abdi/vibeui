
import React from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Quote } from 'lucide-react';

export function Testimonials() {
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
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: getEasing() }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Designers Are Saying</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how VibeUI is helping designers explore visual concepts and find inspiration.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: getEasing() }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/40 mb-4" />
                  <p className="mb-6 text-lg">{item.content}</p>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback className="bg-primary/10 text-primary">{item.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{item.author}</p>
                      <p className="text-sm text-muted-foreground">{item.role}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {item.company}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
