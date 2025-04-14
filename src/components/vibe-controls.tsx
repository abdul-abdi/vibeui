
import React from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { AiVibeGenerator } from '@/components/ai-vibe-generator';

export function VibeControls() {
  const { vibeState, changeVibe, toggleLock, previousVibe, nextVibe } = useVibe();

  return (
    <div className="flex items-center gap-2 p-2 bg-card rounded-md shadow-md">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => previousVibe()}
        disabled={vibeState.isLocked}
        className="w-8 h-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="default" 
        onClick={() => changeVibe()}
        disabled={vibeState.isLocked}
        className="animated-element"
      >
        New Vibe
        <RefreshCw className="ml-2 h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleLock}
        className="w-8 h-8"
      >
        {vibeState.isLocked ? (
          <Lock className="h-4 w-4" />
        ) : (
          <Unlock className="h-4 w-4" />
        )}
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => nextVibe()}
        disabled={vibeState.isLocked}
        className="w-8 h-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <AiVibeGenerator />
    </div>
  );
}
