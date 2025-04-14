import React, { useState } from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Loader2, Sparkles, Palette, Wand2, Type, 
  Sliders, Settings2, Layout, Layers, Lightbulb, 
  RotateCcw, Save
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import { m, AnimatePresence } from 'framer-motion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function EnhancedAiVibeGenerator() {
  const { generateAiVibe, isGenerating, vibeState } = useVibe();
  const [open, setOpen] = useState(false);
  
  // Basic settings
  const [theme, setTheme] = useState('');
  const [mood, setMood] = useState('');
  
  // Advanced settings
  const [advancedMode, setAdvancedMode] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Color settings
  const [primaryColor, setPrimaryColor] = useState('');
  const [accentColor, setAccentColor] = useState('');
  const [colorScheme, setColorScheme] = useState('balanced');
  const [contrastLevel, setContrastLevel] = useState(50);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Typography settings
  const [fontPairing, setFontPairing] = useState('modern');
  const [headingStyle, setHeadingStyle] = useState('standard');
  const [textSize, setTextSize] = useState(50);
  
  // Animation settings
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [animationStyle, setAnimationStyle] = useState('standard');
  const [useParallax, setUseParallax] = useState(true);

  // Layout settings
  const [layoutStyle, setLayoutStyle] = useState('standard');
  const [cornerRounding, setCornerRounding] = useState(50);
  const [elementDensity, setElementDensity] = useState(50);

  const getEasing = () => {
    const easing = vibeState.currentVibe.animation.easing;
    if (Array.isArray(easing)) {
      return easing;
    }
    return [0.4, 0, 0.2, 1];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (advancedMode) {
      // If advanced mode is on, create a more detailed prompt based on all settings
      const colorDescription = `Use ${primaryColor || 'appropriate'} as primary color and ${accentColor || 'complementary'} as accent color with ${colorScheme} distribution and ${contrastLevel}% contrast in ${isDarkMode ? 'dark' : 'light'} mode.`;
      
      const typographyDescription = `Use ${fontPairing} font pairing with ${headingStyle} headings and ${textSize > 60 ? 'larger' : textSize < 40 ? 'smaller' : 'medium'} text.`;
      
      const animationDescription = `Animations should be ${animationSpeed > 60 ? 'fast' : animationSpeed < 40 ? 'slow' : 'medium'} with ${animationStyle} style ${useParallax ? 'including parallax effects' : ''}.`;
      
      const layoutDescription = `Layout should follow a ${layoutStyle} structure with ${cornerRounding > 60 ? 'rounded' : cornerRounding < 40 ? 'sharp' : 'moderate'} corners and ${elementDensity > 60 ? 'high' : elementDensity < 40 ? 'low' : 'medium'} element density.`;
      
      const advancedPrompt = `${theme || 'modern'} ${mood || 'balanced'} theme with these specifications: ${colorDescription} ${typographyDescription} ${animationDescription} ${layoutDescription}`;
      
      toast({
        title: "Generating custom vibe...",
        description: "Creating with advanced specifications",
      });
      
      const success = await generateAiVibe(advancedPrompt, '');
      if (success) {
        setOpen(false);
        resetForm();
      }
    } else {
      // Basic mode
      if (!theme && !mood) {
        toast({
          title: "Input needed",
          description: "Please enter a theme or mood to generate a custom vibe",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Generating custom vibe...",
        description: `Creating a ${theme} ${mood ? '& ' + mood : ''} inspired design`,
      });
      
      const success = await generateAiVibe(theme, mood);
      if (success) {
        setOpen(false);
        resetForm();
      }
    }
  };

  const handleQuickGenerate = async () => {
    toast({
      title: "Generating AI vibe...",
      description: "Creating a surprise design",
    });
    await generateAiVibe();
  };

  const resetForm = () => {
    // Reset all form values
    setTheme('');
    setMood('');
    setPrimaryColor('');
    setAccentColor('');
    setColorScheme('balanced');
    setContrastLevel(50);
    setIsDarkMode(false);
    setFontPairing('modern');
    setHeadingStyle('standard');
    setTextSize(50);
    setAnimationSpeed(50);
    setAnimationStyle('standard');
    setUseParallax(true);
    setLayoutStyle('standard');
    setCornerRounding(50);
    setElementDensity(50);
    setActiveTab('basic');
  };

  // Example suggestions
  const themeExamples = ["cyberpunk", "nature", "minimal", "retro", "futuristic", "neon", "elegant", "playful"];
  const moodExamples = ["energetic", "calm", "professional", "playful", "elegant", "dark", "vibrant", "muted"];
  const colorExamples = ["blue", "teal", "purple", "red", "orange", "green", "pink", "grayscale"];

  const getRandomExample = (examples: string[]) => {
    return examples[Math.floor(Math.random() * examples.length)];
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2, ease: getEasing() } },
    tap: { scale: 0.95, transition: { duration: 0.1, ease: getEasing() } }
  };

  const iconVariants = {
    idle: { rotate: 0 },
    hover: { rotate: [0, 15, -15, 0], transition: { duration: 0.6, repeat: Infinity } }
  };

  return (
    <div className="flex items-center gap-2">
      <m.div
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
      >
        <Button 
          onClick={handleQuickGenerate} 
          disabled={isGenerating}
          variant="outline"
          className="animated-element flex items-center gap-2 relative overflow-hidden group"
        >
          <m.span
            className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="relative z-10">Generating...</span>
            </>
          ) : (
            <>
              <m.div variants={iconVariants}>
                <Wand2 className="h-4 w-4" />
              </m.div>
              <span className="relative z-10">AI Vibe</span>
            </>
          )}
        </Button>
      </m.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <m.div
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              disabled={isGenerating}
              className="w-8 h-8 relative"
              title="Advanced AI Vibe Generator"
            >
              <m.div variants={iconVariants}>
                <Settings2 className="h-4 w-4" />
              </m.div>
              <AnimatePresence>
                <m.span
                  className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />
              </AnimatePresence>
            </Button>
          </m.div>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Advanced AI Vibe Generator
              </DialogTitle>
              <DialogDescription className="text-base">
                Generate custom design systems with precise control
              </DialogDescription>
              
              <div className="flex items-center justify-end space-x-2 mt-2">
                <div className="text-sm">Advanced Mode</div>
                <Switch
                  checked={advancedMode}
                  onCheckedChange={setAdvancedMode}
                />
              </div>
            </DialogHeader>
            
            <div className="mt-4">
              {advancedMode ? (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-5 mb-4">
                    <TabsTrigger value="basic" className="flex items-center gap-1">
                      <Lightbulb className="h-4 w-4" />
                      <span className="hidden sm:inline">Basic</span>
                    </TabsTrigger>
                    <TabsTrigger value="colors" className="flex items-center gap-1">
                      <Palette className="h-4 w-4" />
                      <span className="hidden sm:inline">Colors</span>
                    </TabsTrigger>
                    <TabsTrigger value="typography" className="flex items-center gap-1">
                      <Type className="h-4 w-4" />
                      <span className="hidden sm:inline">Typography</span>
                    </TabsTrigger>
                    <TabsTrigger value="animation" className="flex items-center gap-1">
                      <Sliders className="h-4 w-4" />
                      <span className="hidden sm:inline">Animation</span>
                    </TabsTrigger>
                    <TabsTrigger value="layout" className="flex items-center gap-1">
                      <Layout className="h-4 w-4" />
                      <span className="hidden sm:inline">Layout</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Input
                          id="theme"
                          placeholder={`e.g. ${getRandomExample(themeExamples)}`}
                          value={theme}
                          onChange={(e) => setTheme(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Visual style: cyberpunk, minimal, retro...
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="mood">Mood</Label>
                        <Input
                          id="mood"
                          placeholder={`e.g. ${getRandomExample(moodExamples)}`}
                          value={mood}
                          onChange={(e) => setMood(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Emotional feel: calm, energetic, elegant...
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="colors" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="primaryColor"
                            placeholder={`e.g. ${getRandomExample(colorExamples)}`}
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="flex-1"
                          />
                          {primaryColor && (
                            <div 
                              className="w-8 h-8 rounded-md border" 
                              style={{ 
                                backgroundColor: primaryColor,
                                boxShadow: `0 0 10px ${primaryColor}`
                              }}
                            />
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="accentColor">Accent Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="accentColor"
                            placeholder="e.g. complementary color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="flex-1"
                          />
                          {accentColor && (
                            <div 
                              className="w-8 h-8 rounded-md border" 
                              style={{ 
                                backgroundColor: accentColor,
                                boxShadow: `0 0 10px ${accentColor}`
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="colorScheme">Color Distribution</Label>
                      <Select value={colorScheme} onValueChange={setColorScheme}>
                        <SelectTrigger id="colorScheme">
                          <SelectValue placeholder="Select color distribution" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monochromatic">Monochromatic</SelectItem>
                          <SelectItem value="analogous">Analogous</SelectItem>
                          <SelectItem value="complementary">Complementary</SelectItem>
                          <SelectItem value="triadic">Triadic</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="high-contrast">High Contrast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="contrastLevel">Contrast Level</Label>
                        <span className="text-sm text-muted-foreground">{contrastLevel}%</span>
                      </div>
                      <Slider
                        id="contrastLevel"
                        min={0}
                        max={100}
                        step={1}
                        value={[contrastLevel]}
                        onValueChange={(value) => setContrastLevel(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Subtle</span>
                        <span>Prominent</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="darkMode" 
                        checked={isDarkMode}
                        onCheckedChange={setIsDarkMode}
                      />
                      <Label htmlFor="darkMode">Dark Mode</Label>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="typography" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fontPairing">Font Pairing</Label>
                      <Select value={fontPairing} onValueChange={setFontPairing}>
                        <SelectTrigger id="fontPairing">
                          <SelectValue placeholder="Select font pairing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Modern Sans</SelectItem>
                          <SelectItem value="classic">Classic Serif</SelectItem>
                          <SelectItem value="mixed">Mixed (Sans/Serif)</SelectItem>
                          <SelectItem value="playful">Playful</SelectItem>
                          <SelectItem value="monospace">Monospace</SelectItem>
                          <SelectItem value="elegant">Elegant</SelectItem>
                          <SelectItem value="minimalist">Minimalist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="headingStyle">Heading Style</Label>
                      <Select value={headingStyle} onValueChange={setHeadingStyle}>
                        <SelectTrigger id="headingStyle">
                          <SelectValue placeholder="Select heading style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="italic">Italic</SelectItem>
                          <SelectItem value="uppercase">Uppercase</SelectItem>
                          <SelectItem value="underlined">Underlined</SelectItem>
                          <SelectItem value="accent">Accent Color</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="textSize">Text Size Scale</Label>
                        <span className="text-sm text-muted-foreground">{textSize}%</span>
                      </div>
                      <Slider
                        id="textSize"
                        min={0}
                        max={100}
                        step={1}
                        value={[textSize]}
                        onValueChange={(value) => setTextSize(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Smaller</span>
                        <span>Larger</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="animation" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="animationSpeed">Animation Speed</Label>
                        <span className="text-sm text-muted-foreground">{animationSpeed}%</span>
                      </div>
                      <Slider
                        id="animationSpeed"
                        min={0}
                        max={100}
                        step={1}
                        value={[animationSpeed]}
                        onValueChange={(value) => setAnimationSpeed(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Slow</span>
                        <span>Fast</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="animationStyle">Animation Style</Label>
                      <Select value={animationStyle} onValueChange={setAnimationStyle}>
                        <SelectTrigger id="animationStyle">
                          <SelectValue placeholder="Select animation style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="bouncy">Bouncy</SelectItem>
                          <SelectItem value="smooth">Smooth</SelectItem>
                          <SelectItem value="elastic">Elastic</SelectItem>
                          <SelectItem value="spring">Spring</SelectItem>
                          <SelectItem value="staggered">Staggered</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="useParallax" 
                        checked={useParallax}
                        onCheckedChange={setUseParallax}
                      />
                      <Label htmlFor="useParallax">Use Parallax Effects</Label>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="layout" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="layoutStyle">Layout Structure</Label>
                      <Select value={layoutStyle} onValueChange={setLayoutStyle}>
                        <SelectTrigger id="layoutStyle">
                          <SelectValue placeholder="Select layout structure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="asymmetric">Asymmetric</SelectItem>
                          <SelectItem value="centered">Centered</SelectItem>
                          <SelectItem value="grid">Grid-based</SelectItem>
                          <SelectItem value="sidebar">Sidebar</SelectItem>
                          <SelectItem value="wide">Wide</SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="cornerRounding">Corner Rounding</Label>
                        <span className="text-sm text-muted-foreground">{cornerRounding}%</span>
                      </div>
                      <Slider
                        id="cornerRounding"
                        min={0}
                        max={100}
                        step={1}
                        value={[cornerRounding]}
                        onValueChange={(value) => setCornerRounding(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Sharp</span>
                        <span>Rounded</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="elementDensity">Element Density</Label>
                        <span className="text-sm text-muted-foreground">{elementDensity}%</span>
                      </div>
                      <Slider
                        id="elementDensity"
                        min={0}
                        max={100}
                        step={1}
                        value={[elementDensity]}
                        onValueChange={(value) => setElementDensity(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Spacious</span>
                        <span>Dense</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                // Basic mode
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="theme" className="text-right">
                      Theme
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="theme"
                        placeholder={`e.g. ${getRandomExample(themeExamples)}`}
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Visual style: cyberpunk, minimal, retro...
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mood" className="text-right">
                      Mood
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="mood"
                        placeholder={`e.g. ${getRandomExample(moodExamples)}`}
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Emotional feel: calm, energetic, elegant...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="mt-6 gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetForm}
                      className="gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset all settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button type="submit" disabled={isGenerating} className="relative overflow-hidden gap-2">
                <m.span
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20"
                  initial={{ x: '-100%' }}
                  animate={isGenerating ? { x: '100%' } : { x: '-100%' }}
                  transition={{ duration: 1, repeat: isGenerating ? Infinity : 0, ease: "linear" }}
                />
                <span className="relative z-10">
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Vibe
                    </>
                  )}
                </span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 