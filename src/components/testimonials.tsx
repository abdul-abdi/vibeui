
import React from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Quote, Star, Award, Verified } from 'lucide-react';

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
      content: "VibeUI has completely transformed our design process. The ability to quickly explore different visual directions saves us hours in the conceptual phase. Our client presentations are now much more engaging.",
      author: "Alex Morgan",
      role: "Lead Designer at CreativeFlow",
      avatar: "/testimonials/alex-morgan.jpg",
      avatarFallback: "AM",
      company: "CreativeFlow",
      rating: 5,
      verified: true
    },
    {
      content: "As a UI/UX educator, I recommend VibeUI to all my students. It's an incredible tool for understanding how different design systems work together. The real-time preview capability makes teaching design principles so much more effective.",
      author: "Sarah Chen",
      role: "Design Educator",
      avatar: "/testimonials/sarah-chen.jpg",
      avatarFallback: "SC",
      company: "DesignAcademy",
      rating: 5,
      verified: true
    },
    {
      content: "Our clients are always impressed when we show them different interface options using VibeUI. It's become an essential part of our client presentation process and has helped us win more projects than ever before.",
      author: "Marcus Johnson",
      role: "UI/UX Consultant",
      avatar: "/testimonials/marcus-johnson.jpg",
      avatarFallback: "MJ",
      company: "DesignStudio",
      rating: 5,
      verified: true
    },
    {
      content: "The speed at which we can now iterate through design concepts is incredible. VibeUI has cut our prototyping time in half and allows us to explore ideas we would have never considered before.",
      author: "Elena Rodriguez",
      role: "Product Designer",
      avatar: "/testimonials/elena-rodriguez.jpg",
      avatarFallback: "ER",
      company: "InnovateUX",
      rating: 5,
      verified: true
    }
  ];

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <motion.div 
        className="absolute -z-10 inset-0 opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb), 0.1), transparent 70%)'
        }}
      />
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: getEasing() }}
        >
          <motion.div
            className="inline-flex items-center justify-center mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Award className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Trusted by Professionals</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Designers Worldwide</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how VibeUI is transforming the way designers create exceptional user experiences.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: getEasing() }}
              className="h-full"
            >
              <Card className="h-full relative overflow-hidden group">
                <motion.div 
                  className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-3 gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-primary/40 mb-4" />
                  <p className="mb-6 text-lg flex-grow">{item.content}</p>
                  
                  <div className="flex items-center mt-auto">
                    <Avatar className="h-12 w-12 mr-4 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary">{item.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{item.author}</p>
                        {item.verified && (
                          <Verified className="h-3.5 w-3.5 text-primary" title="Verified review" />
                        )}
                      </div>
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
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5, ease: getEasing() }}
        >
          <p className="text-muted-foreground">
            Join over <span className="font-semibold text-foreground">2,500+</span> designers already using VibeUI to revolutionize their design workflow.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
