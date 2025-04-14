
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

export function AiVibeGenerator() {
  const { generateAiVibe, isGenerating } = useVibe();
  const [theme, setTheme] = useState('');
  const [mood, setMood] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateAiVibe(theme, mood);
    setOpen(false);
  };

  const handleQuickGenerate = async () => {
    await generateAiVibe();
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={handleQuickGenerate} 
        disabled={isGenerating}
        variant="outline"
        className="animated-element flex items-center gap-2"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        Generate AI Vibe
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={isGenerating}
            className="w-8 h-8"
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
                  placeholder="e.g. cyberpunk, nature, minimal"
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
                  placeholder="e.g. energetic, calm, professional"
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
