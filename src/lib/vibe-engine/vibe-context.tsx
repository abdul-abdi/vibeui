
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VibeSettings, VibeState } from './types';
import { getRandomVibePreset, getVibePresetById } from './vibe-presets';
import { applyVibe } from './vibe-utils';

// Context for managing the current vibe
const VibeContext = createContext<{
  vibeState: VibeState;
  changeVibe: (vibeId?: string) => void;
  toggleLock: () => void;
  previousVibe: () => void;
  nextVibe: () => void;
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

  // Apply the current vibe to the DOM
  useEffect(() => {
    applyVibe(vibeState.currentVibe);
  }, [vibeState.currentVibe]);

  // Change the current vibe
  const changeVibe = (vibeId?: string) => {
    if (vibeState.isLocked) return;

    const newVibe = vibeId 
      ? getVibePresetById(vibeId) 
      : getRandomVibePreset();
      
    if (!newVibe) return;

    // Update the state with the new vibe
    setVibeState(prev => {
      const newHistory = [...prev.vibeHistory.slice(0, historyIndex + 1), newVibe.id];

      return {
        ...prev,
        currentVibe: newVibe,
        vibeHistory: newHistory,
      };
    });
    
    setHistoryIndex(prev => prev + 1);
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
      const prevVibe = getVibePresetById(prevVibeId);
      
      if (prevVibe) {
        setVibeState(prev => ({
          ...prev,
          currentVibe: prevVibe,
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
      const nextVibe = getVibePresetById(nextVibeId);
      
      if (nextVibe) {
        setVibeState(prev => ({
          ...prev,
          currentVibe: nextVibe,
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
        nextVibe 
      }}
    >
      {children}
    </VibeContext.Provider>
  );
};
