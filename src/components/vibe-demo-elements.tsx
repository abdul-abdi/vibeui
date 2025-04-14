
import React, { useState } from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Copy, CreditCard, LayoutGrid, Type, MousePointer, PenTool } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function VibeDemoElements() {
  const { vibeState } = useVibe();
  const { currentVibe } = vibeState;
  
  const [activeTab, setActiveTab] = useState("ui-components");
  
  // Helper function to safely get easing for Framer Motion
  const getEasing = () => {
    const easing = currentVibe.animation.easing;
    if (Array.isArray(easing)) {
      return easing;
    }
    return [0.4, 0, 0.2, 1]; // default ease-in-out
  };

  // Check for specific vibes to apply special styles
  const isSoftOrganic = currentVibe.name.toLowerCase().includes("organic");
  const isDarkTech = currentVibe.name.toLowerCase().includes("techno") || 
                   currentVibe.name.toLowerCase().includes("dark");
  const isBrutalist = currentVibe.name.toLowerCase().includes("brutal");
  const isPlayful = currentVibe.name.toLowerCase().includes("playful") ||
                  currentVibe.name.toLowerCase().includes("vibrant");
  const isElectric = currentVibe.name.toLowerCase().includes("electric") || 
                   currentVibe.name.toLowerCase().includes("pop") ||
                   currentVibe.name.toLowerCase().includes("neon");
  
  // Get vibe-specific class names
  const getCardClass = () => {
    if (isSoftOrganic) return 'soft-organic-card';
    if (isDarkTech) return 'dark-tech-card';
    if (isBrutalist) return 'brutalist-card';
    if (isPlayful || isElectric) return 'playful-card';
    return '';
  };

  const getPrimaryButtonClass = () => {
    if (isSoftOrganic) return 'soft-organic-primary-button';
    if (isDarkTech) return 'neon-glow-button';
    if (isBrutalist) return 'brutal-button';
    if (isElectric || isPlayful) return 'electric-button';
    return '';
  };

  // Demo UI component for copying color values
  const ColorCopyButton = ({ color, label }: { color: string, label: string }) => {
    const handleCopy = () => {
      navigator.clipboard.writeText(color);
      toast({
        title: "Copied!",
        description: `${label} color: ${color}`
      });
    };

    return (
      <motion.button
        className="vibe-color-pill flex items-center justify-between gap-2 w-full p-2 rounded"
        style={{ 
          backgroundColor: `hsl(${color})`,
          color: color.includes('foreground') ? `hsl(${color})` : 
                 (color.includes('background') || color.includes('muted') || color.includes('accent')) ? 
                 'hsl(var(--foreground))' : 'hsl(var(--background))'
        }}
        onClick={handleCopy}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <span>{label}</span>
        <Copy size={14} />
      </motion.button>
    );
  };

  return (
    <motion.div 
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: getEasing() }}
    >
      <div className="mb-6">
        <Tabs 
          defaultValue="ui-components" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger 
              value="ui-components"
              className={`${activeTab === "ui-components" && isBrutalist ? 'border-2 border-black' : ''}`}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              UI Components
            </TabsTrigger>
            <TabsTrigger 
              value="interactive"
              className={`${activeTab === "interactive" && isBrutalist ? 'border-2 border-black' : ''}`}
            >
              <MousePointer className="mr-2 h-4 w-4" />
              Interactive
            </TabsTrigger>
            <TabsTrigger 
              value="typography"
              className={`${activeTab === "typography" && isBrutalist ? 'border-2 border-black' : ''}`}
            >
              <Type className="mr-2 h-4 w-4" />
              Typography
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ui-components" className="space-y-8 h-full min-h-[400px]">
            <Card className={`${getCardClass()} w-full`}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5" /> 
                    UI Components
                  </CardTitle>
                  <Badge variant={isBrutalist ? "outline" : "secondary"}>Core</Badge>
                </div>
                <CardDescription>
                  Essential UI elements styled according to the current vibe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <div className="text-sm font-medium mb-2">Buttons</div>
                  <div className="flex flex-wrap gap-3">
                    <Button className={getPrimaryButtonClass()}>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="text-sm font-medium mb-2">Badges</div>
                  <div className="flex flex-wrap gap-3">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="text-sm font-medium mb-2">Form Elements</div>
                  <div className="grid gap-3 w-full">
                    <Input placeholder="Text input" className="w-full" />
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="text-sm font-medium mb-2">Colors</div>
                  <div className="grid grid-cols-2 gap-2">
                    <ColorCopyButton color={currentVibe.colors.primary} label="Primary" />
                    <ColorCopyButton color={currentVibe.colors.secondary} label="Secondary" />
                    <ColorCopyButton color={currentVibe.colors.accent} label="Accent" />
                    <ColorCopyButton color={currentVibe.colors.muted} label="Muted" />
                  </div>
                </motion.div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground w-full flex justify-between items-center">
                  <span>Cohesive styling across all components</span>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    <span>Card-based layout</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="interactive" className="space-y-8 min-h-[400px]">
            <Card className={`${getCardClass()} w-full`}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MousePointer className="h-5 w-5" /> 
                    Interactive Elements
                  </CardTitle>
                  <Badge variant={isBrutalist ? "outline" : "secondary"}>Animated</Badge>
                </div>
                <CardDescription>
                  Interactive components with custom animations and behaviors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div className="space-y-4">
                  {/* Interactive button with animation */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium mb-2">Interactive Buttons</div>
                    <div className="flex flex-wrap gap-4">
                      <motion.button
                        className={`px-4 py-2 rounded-lg bg-primary text-primary-foreground flex items-center gap-2 ${isBrutalist ? 'brutal-button' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="h-4 w-4" />
                        <span>Approve</span>
                      </motion.button>
                      
                      <motion.button
                        className={`px-4 py-2 rounded-lg bg-destructive text-destructive-foreground flex items-center gap-2 ${isBrutalist ? 'brutal-button' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-4 w-4" />
                        <span>Decline</span>
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Hover card effect */}
                  <div className="space-y-2 pt-4">
                    <div className="text-sm font-medium mb-2">Hover Effects</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.div 
                        className="p-4 rounded-lg bg-secondary/30 hover-elevate"
                        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                      >
                        <div className="font-medium">Elevation Effect</div>
                        <div className="text-sm text-muted-foreground">Hover to see the card elevate</div>
                      </motion.div>
                      
                      <motion.div 
                        className="p-4 rounded-lg bg-accent/30 relative overflow-hidden group"
                        whileHover={{}}
                      >
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        <div className="font-medium relative z-10">Sweep Effect</div>
                        <div className="text-sm text-muted-foreground relative z-10">Hover to see the gradient sweep</div>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Animated Icon */}
                  <div className="space-y-2 pt-4">
                    <div className="text-sm font-medium mb-2">Animated Icons</div>
                    <div className="flex flex-wrap gap-6 items-center justify-center py-4">
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                          scale: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                        }}
                        className="p-3 rounded-full bg-primary/10"
                      >
                        <PenTool className="h-6 w-6 text-primary" />
                      </motion.div>
                      
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="p-3 rounded-full bg-secondary/10"
                      >
                        <Type className="h-6 w-6 text-secondary-foreground" />
                      </motion.div>
                      
                      <motion.div
                        animate={{ 
                          opacity: [0.5, 1, 0.5],
                          boxShadow: [
                            "0 0 0 rgba(var(--primary-rgb), 0.4)",
                            "0 0 20px rgba(var(--primary-rgb), 0.7)",
                            "0 0 0 rgba(var(--primary-rgb), 0.4)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-3 rounded-full bg-muted"
                      >
                        <LayoutGrid className="h-6 w-6 text-foreground" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Animation speed: {currentVibe.animation.speed}x
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="typography" className="space-y-8 min-h-[400px]">
            <Card className={`${getCardClass()} w-full`}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Type className="h-5 w-5" /> 
                    Typography
                  </CardTitle>
                  <Badge variant={isBrutalist ? "outline" : "secondary"}>Text</Badge>
                </div>
                <CardDescription>
                  Text styles with the current vibe's font family and spacing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold">Heading 1</h1>
                  <h2 className="text-3xl font-semibold">Heading 2</h2>
                  <h3 className="text-2xl font-medium">Heading 3</h3>
                  
                  <hr className="my-4" />
                  
                  <p className="text-base">
                    This is a paragraph with standard text styling that adapts to the current vibe's font family.
                  </p>
                  
                  <p className="text-sm text-muted-foreground">
                    This is smaller text with muted color, showing contrast in typography.
                  </p>
                  
                  <div className="p-4 bg-muted rounded-md font-mono text-sm">
                    <code>Code example</code>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between gap-8 mt-8">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Font Pairings</h4>
                      <p className="text-sm">
                        Each vibe uses carefully selected font pairs for harmony
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Text Spacing</h4>
                      <p className="text-sm">
                        Letter spacing and line height optimized for readability
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Primary Font: {currentVibe.fonts.primary.split(',')[0].replace(/'/g, '')}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
