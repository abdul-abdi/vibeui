
import React, { useState } from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Palette } from 'lucide-react';
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

export function AiVibeGenerator() {
  const { generateAiVibe, isGenerating } = useVibe();
  const [theme, setTheme] = useState('');
  const [mood, setMood] = useState('');
  const [open, setOpen] = useState(false);

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
    
    const success = await generateAiVibe(theme, mood);
    if (success) {
      setOpen(false);
      setTheme('');
      setMood('');
    }
  };

  const handleQuickGenerate = async () => {
    await generateAiVibe();
  };

  const themeExamples = ["cyberpunk", "nature", "minimal", "retro", "futuristic"];
  const moodExamples = ["energetic", "calm", "professional", "playful", "elegant"];

  const getRandomExample = (examples: string[]) => {
    return examples[Math.floor(Math.random() * examples.length)];
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={handleQuickGenerate} 
        disabled={isGenerating}
        variant="outline"
        className="animated-element flex items-center gap-2 relative"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Generate AI Vibe</span>
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={isGenerating}
            className="w-8 h-8"
            title="Custom AI Vibe"
          >
            <Palette className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create Custom AI Vibe</DialogTitle>
              <DialogDescription>
                Describe your desired theme and mood for a custom generated vibe
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="theme" className="text-right">
                  Theme
                </Label>
                <Input
                  id="theme"
                  placeholder={`e.g. ${getRandomExample(themeExamples)}`}
                  className="col-span-3"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mood" className="text-right">
                  Mood
                </Label>
                <Input
                  id="mood"
                  placeholder={`e.g. ${getRandomExample(moodExamples)}`}
                  className="col-span-3"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Vibe
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
