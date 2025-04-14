
import React from 'react';
import { useVibe } from '@/lib/vibe-engine';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { AiVibeGenerator } from '@/components/ai-vibe-generator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function VibeControls() {
  const { vibeState, changeVibe, toggleLock, previousVibe, nextVibe } = useVibe();
  const canGoBack = vibeState.vibeHistory && vibeState.vibeHistory.length > 1;
  const canGoForward = false; // We need to implement this logic to check if there are more vibes in history

  return (
    <div className="flex items-center gap-2 p-2 bg-card rounded-md shadow-md">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => previousVibe()}
              disabled={!canGoBack || vibeState.isLocked}
              className="w-8 h-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Previous vibe</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="default" 
              onClick={() => changeVibe()}
              disabled={vibeState.isLocked}
              className="animated-element"
            >
              New Vibe
              <RefreshCw className="ml-2 h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Generate a random new vibe</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleLock}
              className={`w-8 h-8 ${vibeState.isLocked ? 'bg-primary/10' : ''}`}
            >
              {vibeState.isLocked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{vibeState.isLocked ? 'Unlock vibe changes' : 'Lock current vibe'}</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => nextVibe()}
              disabled={!canGoForward || vibeState.isLocked}
              className="w-8 h-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Next vibe</TooltipContent>
        </Tooltip>
        
        <AiVibeGenerator />
      </TooltipProvider>
    </div>
  );
}
