import React, { useState } from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Palette, Wand2 } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';

export function AiVibeGenerator() {
  const { generateAiVibe, isGenerating, vibeState } = useVibe();
  const [theme, setTheme] = useState('');
  const [mood, setMood] = useState('');
  const [open, setOpen] = useState(false);

  const getEasing = () => {
    const easing = vibeState.currentVibe.animation.easing;
    if (Array.isArray(easing)) {
      return easing;
    }
    return [0.4, 0, 0.2, 1];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      setTheme('');
      setMood('');
    }
  };

  const handleQuickGenerate = async () => {
    toast({
      title: "Generating AI vibe...",
      description: "Creating a surprise design from the edge function",
    });
    await generateAiVibe();
  };

  const themeExamples = ["cyberpunk", "nature", "minimal", "retro", "futuristic", "neon", "elegant", "playful"];
  const moodExamples = ["energetic", "calm", "professional", "playful", "elegant", "dark", "vibrant", "muted"];

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
      <motion.div
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
          <motion.span
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
              <motion.div variants={iconVariants}>
                <Wand2 className="h-4 w-4" />
              </motion.div>
              <span className="relative z-10">Generate AI Vibe</span>
            </>
          )}
        </Button>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <motion.div
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
              title="Custom AI Vibe"
            >
              <motion.div variants={iconVariants}>
                <Palette className="h-4 w-4" />
              </motion.div>
              <AnimatePresence>
                <motion.span
                  className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />
              </AnimatePresence>
            </Button>
          </motion.div>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Create Custom AI Vibe
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                </motion.div>
              </DialogTitle>
              <DialogDescription>
                Describe your desired theme and mood for a custom generated vibe
              </DialogDescription>
            </DialogHeader>
            
            <motion.div 
              className="grid gap-4 py-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="theme" className="text-right">
                  Theme
                </Label>
                <div className="col-span-3">
                  <Input
                    id="theme"
                    placeholder={`e.g. ${getRandomExample(themeExamples)}`}
                    className="w-full"
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
                    className="w-full"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Emotional feel: calm, energetic, elegant...
                  </p>
                </div>
              </div>
            </motion.div>
            
            <DialogFooter>
              <Button type="submit" disabled={isGenerating} className="relative overflow-hidden">
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20"
                  initial={{ x: '-100%' }}
                  animate={isGenerating ? { x: '100%' } : { x: '-100%' }}
                  transition={{ duration: 1, repeat: isGenerating ? Infinity : 0, ease: "linear" }}
                />
                <span className="relative z-10">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 inline" />
                      Generate Custom Vibe
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
