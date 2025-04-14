
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VibeSettings, VibeState } from './types';
import { getRandomVibePreset, getVibePresetById, vibePresets } from './vibe-presets';
import { applyVibe } from './vibe-utils';
import { fetchAiVibes, generateNewVibe } from './ai-vibes';
import { toast } from '@/hooks/use-toast';

// Context for managing the current vibe
const VibeContext = createContext<{
  vibeState: VibeState;
  changeVibe: (vibeId?: string) => void;
  toggleLock: () => void;
  previousVibe: () => void;
  nextVibe: () => void;
  generateAiVibe: (theme?: string, mood?: string) => Promise<boolean>;
  aiVibes: VibeSettings[];
  isGenerating: boolean;
}>({
  vibeState: {
    currentVibe: getRandomVibePreset(),
    isLocked: false,
    vibeHistory: [],
  },
  changeVibe: () => {},
  toggleLock: () => {},
  previousVibe: () => {},
  nextVibe: () => {},
  generateAiVibe: async () => false,
  aiVibes: [],
  isGenerating: false,
});

export const useVibe = () => useContext(VibeContext);

export const VibeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vibeState, setVibeState] = useState<VibeState>(() => {
    const initialVibe = getRandomVibePreset();
    return {
      currentVibe: initialVibe,
      isLocked: false,
      vibeHistory: [initialVibe.id],
    };
  });
  
  const [historyIndex, setHistoryIndex] = useState(0);
  const [aiVibes, setAiVibes] = useState<VibeSettings[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load AI vibes on component mount
  useEffect(() => {
    const loadAiVibes = async () => {
      try {
        const vibes = await fetchAiVibes();
        setAiVibes(vibes);
      } catch (error) {
        console.error("Error loading AI vibes:", error);
        toast({
          title: "Couldn't load saved vibes",
          description: "There was an error loading your saved vibes",
          variant: "destructive"
        });
      }
    };
    
    loadAiVibes();
  }, []);

  // Apply the current vibe to the DOM
  useEffect(() => {
    applyVibe(vibeState.currentVibe);
  }, [vibeState.currentVibe]);

  // Change the current vibe
  const changeVibe = (vibeId?: string) => {
    if (vibeState.isLocked) return;

    // First try to find in AI vibes
    let newVibe: VibeSettings | undefined;
    
    if (vibeId) {
      newVibe = aiVibes.find(v => v.id === vibeId) || getVibePresetById(vibeId);
    } else {
      // Get random from all vibes (built-in + AI)
      const allVibes = [...aiVibes, ...vibePresets];
      
      const randomIndex = Math.floor(Math.random() * allVibes.length);
      newVibe = allVibes[randomIndex];
    }
      
    if (!newVibe) return;

    // Update the state with the new vibe
    setVibeState(prev => {
      const newHistory = [...prev.vibeHistory.slice(0, historyIndex + 1), newVibe!.id];

      return {
        ...prev,
        currentVibe: newVibe!,
        vibeHistory: newHistory,
      };
    });
    
    setHistoryIndex(prev => prev + 1);
  };

  // Generate a new AI vibe
  const generateAiVibe = async (theme?: string, mood?: string): Promise<boolean> => {
    setIsGenerating(true);
    try {
      const newVibe = await generateNewVibe(theme, mood);
      if (newVibe) {
        setAiVibes(prev => [newVibe, ...prev]);
        
        // Apply the new vibe immediately
        setVibeState(prev => {
          const newHistory = [...prev.vibeHistory.slice(0, historyIndex + 1), newVibe.id];
          return {
            ...prev,
            currentVibe: newVibe,
            vibeHistory: newHistory,
          };
        });
        
        setHistoryIndex(prev => prev + 1);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error generating AI vibe:", error);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle the lock state
  const toggleLock = () => {
    setVibeState(prev => ({
      ...prev,
      isLocked: !prev.isLocked,
    }));
  };

  // Navigate to the previous vibe in history
  const previousVibe = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevVibeId = vibeState.vibeHistory[prevIndex];
      
      // Try to find in AI vibes first
      let prevVibe = aiVibes.find(v => v.id === prevVibeId);
      
      // If not found, check in presets
      if (!prevVibe) {
        prevVibe = getVibePresetById(prevVibeId);
      }
      
      if (prevVibe) {
        setVibeState(prev => ({
          ...prev,
          currentVibe: prevVibe!,
        }));
        setHistoryIndex(prevIndex);
      }
    }
  };

  // Navigate to the next vibe in history
  const nextVibe = () => {
    if (historyIndex < vibeState.vibeHistory.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextVibeId = vibeState.vibeHistory[nextIndex];
      
      // Try to find in AI vibes first
      let nextVibe = aiVibes.find(v => v.id === nextVibeId);
      
      // If not found, check in presets
      if (!nextVibe) {
        nextVibe = getVibePresetById(nextVibeId);
      }
      
      if (nextVibe) {
        setVibeState(prev => ({
          ...prev,
          currentVibe: nextVibe!,
        }));
        setHistoryIndex(nextIndex);
      }
    }
  };

  return (
    <VibeContext.Provider 
      value={{ 
        vibeState, 
        changeVibe, 
        toggleLock, 
        previousVibe, 
        nextVibe,
        generateAiVibe,
        aiVibes,
        isGenerating
      }}
    >
      {children}
    </VibeContext.Provider>
  );
};
