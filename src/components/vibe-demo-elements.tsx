
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVibe } from '@/lib/vibe-engine';
import { ChevronRight, Star, Heart, MessageSquare, Sparkles, Check, ArrowRight, Palette, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export function VibeDemoElements() {
  const { vibeState } = useVibe();
  const { currentVibe } = vibeState;
  const [activeTab, setActiveTab] = useState("interactive");
  
  // Check for specific vibes to apply special styles
  const isSoftOrganic = currentVibe.name.toLowerCase().includes("organic");
  const isNeonOrTech = currentVibe.name.toLowerCase().includes("techno") || 
                       currentVibe.name.toLowerCase().includes("electric") ||
                       currentVibe.name.toLowerCase().includes("neon");
  const isElegant = currentVibe.name.toLowerCase().includes("elegant") || 
                   currentVibe.name.toLowerCase().includes("serif");
  const isBrutal = currentVibe.name.toLowerCase().includes("brutal") || 
                  currentVibe.name.toLowerCase().includes("neo");
  
  // Dynamic button classes based on vibe
  const buttonClasses = {
    primary: isSoftOrganic ? 'soft-organic-primary-button' : 
             isNeonOrTech ? 'neon-glow-button' : 
             isBrutal ? 'brutal-button' : '',
    secondary: isSoftOrganic ? 'soft-organic-secondary-button' : 
               isNeonOrTech ? 'neon-outline-button' : 
               isBrutal ? 'brutal-secondary-button' : '',
    outline: isSoftOrganic ? 'soft-organic-outline-button' : 
             isNeonOrTech ? 'neon-accent-button' : 
             isBrutal ? 'brutal-outline-button' : '',
    ghost: isSoftOrganic ? 'soft-organic-ghost-button' : 
           isNeonOrTech ? 'neon-ghost-button' : 
           isBrutal ? 'brutal-ghost-button' : '',
    link: isSoftOrganic ? 'soft-organic-link-button' : 
          isNeonOrTech ? 'neon-link-button' : 
          isBrutal ? 'brutal-link-button' : ''
  };
  
  // Dynamic card classes based on vibe
  const cardClass = isSoftOrganic ? 'soft-organic-card' : 
                    isNeonOrTech ? 'neon-card' : 
                    isBrutal ? 'brutal-card' : 
                    isElegant ? 'elegant-card' : '';

  // Helper for consistent animation across all elements
  const getEasing = () => {
    const easing = currentVibe.animation.easing;
    return Array.isArray(easing) ? easing : [0.4, 0, 0.2, 1];
  };
  
  // Animation variants for elements
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4 * (1/currentVibe.animation.speed),
        ease: getEasing()
      }
    })
  };
  
  const tabVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.3 } }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="interactive" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">UI Components</h3>
          <TabsList className="grid grid-cols-3 w-auto">
            <TabsTrigger value="interactive">Interactive</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
          </TabsList>
        </div>

        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={tabVariants}
          className="w-full"
        >
          <TabsContent value="interactive" className="space-y-6">
            <Card className={`shadow-sm ${cardClass}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Interactive Elements
                </CardTitle>
                <CardDescription>Buttons and form controls with the current vibe styling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-3">Buttons</h4>
                  <div className="flex flex-wrap gap-3">
                    <motion.div custom={0} initial="hidden" animate="visible" variants={itemVariants}>
                      <Button variant="default" className={`${buttonClasses.primary} group`}>
                        Primary Button
                        <motion.span 
                          className="ml-1" 
                          initial={{ x: 0 }} 
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.span>
                      </Button>
                    </motion.div>
                    
                    <motion.div custom={1} initial="hidden" animate="visible" variants={itemVariants}>
                      <Button variant="secondary" className={buttonClasses.secondary}>Secondary Button</Button>
                    </motion.div>
                    
                    <motion.div custom={2} initial="hidden" animate="visible" variants={itemVariants}>
                      <Button variant="outline" className={buttonClasses.outline}>Outline Button</Button>
                    </motion.div>
                    
                    <motion.div custom={3} initial="hidden" animate="visible" variants={itemVariants}>
                      <Button variant="ghost" className={buttonClasses.ghost}>Ghost Button</Button>
                    </motion.div>
                    
                    <motion.div custom={4} initial="hidden" animate="visible" variants={itemVariants}>
                      <Button variant="link" className={buttonClasses.link}>Link Button</Button>
                    </motion.div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Form Controls</h4>
                  <div className="flex flex-wrap gap-3 items-center">
                    <motion.div custom={5} initial="hidden" animate="visible" variants={itemVariants} className="max-w-[250px]">
                      <Input placeholder="Standard input" className={isSoftOrganic ? 'soft-organic-input' : isNeonOrTech ? 'neon-input' : ''} />
                    </motion.div>
                    
                    <motion.div custom={6} initial="hidden" animate="visible" variants={itemVariants} className="flex flex-wrap gap-2 items-center">
                      <Badge className={isSoftOrganic ? 'soft-organic-badge' : isNeonOrTech ? 'neon-badge' : ''}>Badge</Badge>
                      <Badge variant="secondary" className={isSoftOrganic ? 'soft-organic-secondary-badge' : isNeonOrTech ? 'neon-secondary-badge' : ''}>Secondary Badge</Badge>
                      <Badge variant="outline" className={isSoftOrganic ? 'soft-organic-outline-badge' : isNeonOrTech ? 'neon-outline-badge' : ''}>Outline Badge</Badge>
                      <Badge variant="destructive" className={isSoftOrganic ? 'soft-organic-destructive-badge' : isNeonOrTech ? 'neon-destructive-badge' : ''}>Destructive Badge</Badge>
                    </motion.div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${isSoftOrganic ? 'bg-primary/5' : 'bg-secondary/20'} mt-4`}>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>All interactive elements adapt to the current vibe's color scheme and animation style</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <motion.div custom={0} initial="hidden" animate="visible" variants={itemVariants}>
                <Card className={`shadow-sm hover:shadow-md transition-shadow ${cardClass}`}>
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description with details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This card demonstrates the current vibe styling with automatic transitions.</p>
                    
                    <div className={`p-3 rounded-lg mt-4 ${isSoftOrganic ? 'bg-emerald-50' : 'bg-accent/10'}`}>
                      <p className="text-sm">Cards adapt to each vibe with appropriate styling for headers, content, and actions.</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm">Cancel</Button>
                    <Button size="sm" className={buttonClasses.primary}>Action</Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div custom={1} initial="hidden" animate="visible" variants={itemVariants}>
                <Card className={`shadow-sm hover:shadow-md transition-shadow ${cardClass}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>Interactive Card</CardTitle>
                      <div className={`p-2 rounded-full ${isSoftOrganic ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/20 text-primary'} flex items-center justify-center`}>
                        <Star className="h-4 w-4" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>This card showcases content with the current vibe animations and hover effects.</p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className={`h-4 w-4 ${isNeonOrTech ? 'text-pink-500' : 'text-rose-500'}`} />
                        <span className="text-sm text-muted-foreground">24</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className={`h-4 w-4 ${isNeonOrTech ? 'text-cyan-500' : isSoftOrganic ? 'text-emerald-500' : 'text-blue-500'}`} />
                        <span className="text-sm text-muted-foreground">12</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" className="ml-auto group">
                      Read More 
                      <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
            
            {/* Feature highlight card */}
            <motion.div custom={2} initial="hidden" animate="visible" variants={itemVariants}>
              <Card className={`${cardClass} ${isSoftOrganic ? 'border-emerald-200' : isNeonOrTech ? 'border-primary/30' : ''}`}>
                <CardHeader className={isNeonOrTech ? 'bg-gradient-to-r from-primary/10 to-accent/5' : isSoftOrganic ? 'bg-emerald-50/50' : ''}>
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${isSoftOrganic ? 'bg-white text-emerald-600' : isNeonOrTech ? 'bg-black/20 text-primary' : 'bg-primary/20 text-primary'}`}>
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>Dynamic Styling System</CardTitle>
                      <CardDescription>Cards adapt to each vibe theme automatically</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Color Transitions</h4>
                      <p className="text-sm text-muted-foreground">Colors transition smoothly between themes using HSL values</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Responsive Layout</h4>
                      <p className="text-sm text-muted-foreground">All components automatically adjust to screen size</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Animation Timing</h4>
                      <p className="text-sm text-muted-foreground">Animation speed and easing adjusts to each vibe</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Themed Components</h4>
                      <p className="text-sm text-muted-foreground">Every component adapts to the current theme</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <Card className={`shadow-sm ${cardClass}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Typography
                </CardTitle>
                <CardDescription>Text styles with the current vibe's font family and spacing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div custom={0} initial="hidden" animate="visible" variants={itemVariants} className="space-y-3">
                  <h1 className={`text-4xl font-bold ${isSoftOrganic ? 'text-emerald-800' : ''}`}>Heading 1</h1>
                  <h2 className={`text-3xl font-semibold ${isSoftOrganic ? 'text-emerald-700' : ''}`}>Heading 2</h2>
                  <h3 className={`text-2xl font-medium ${isSoftOrganic ? 'text-emerald-600' : ''}`}>Heading 3</h3>
                </motion.div>
                <Separator className="my-4" />
                <motion.div custom={1} initial="hidden" animate="visible" variants={itemVariants} className="space-y-4">
                  <div>
                    <p className="text-lg mb-2">This is a paragraph with standard text styling that adapts to the current vibe's font family.</p>
                    <p className="text-sm text-muted-foreground">This is smaller text with muted color, showing contrast in typography.</p>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${isSoftOrganic ? 'bg-emerald-50' : 'bg-muted'}`}>
                    <p><code className="text-sm px-1 py-0.5 rounded bg-muted">Code example</code></p>
                    <p className="text-sm mt-2">
                      Structured text elements allow for consistent hierarchy of information. Typography adapts with each vibe change including font
                      family, weight, and spacing.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div custom={2} initial="hidden" animate="visible" variants={itemVariants}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Font Pairings</h4>
                      <p className="text-sm text-muted-foreground">Each vibe uses carefully selected font pairs for harmony</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Text Spacing</h4>
                      <p className="text-sm text-muted-foreground">Letter spacing and line height optimized for readability</p>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}
