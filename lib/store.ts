// Zustand store for managing the vibe generation state

import { create } from 'zustand';
import type { VibeResult, DesignMood, DesignStyle } from './types';

interface VibeState {
  // Input state
  prompt: string;
  mood: DesignMood | null;
  style: DesignStyle | null;
  
  // Generation state
  isGenerating: boolean;
  generationProgress: number;
  generationStage: 'idle' | 'analyzing' | 'colors' | 'typography' | 'components' | 'preview' | 'complete';
  
  // Result state
  result: VibeResult | null;
  error: string | null;
  
  // History (stored in memory for session)
  history: VibeResult[];
  
  // Actions
  setPrompt: (prompt: string) => void;
  setMood: (mood: DesignMood | null) => void;
  setStyle: (style: DesignStyle | null) => void;
  setGenerating: (isGenerating: boolean) => void;
  setProgress: (progress: number, stage: VibeState['generationStage']) => void;
  setResult: (result: VibeResult) => void;
  setError: (error: string | null) => void;
  addToHistory: (result: VibeResult) => void;
  reset: () => void;
  clearHistory: () => void;
}

export const useVibeStore = create<VibeState>((set) => ({
  // Initial state
  prompt: '',
  mood: null,
  style: null,
  isGenerating: false,
  generationProgress: 0,
  generationStage: 'idle',
  result: null,
  error: null,
  history: [],
  
  // Actions
  setPrompt: (prompt) => set({ prompt }),
  setMood: (mood) => set({ mood }),
  setStyle: (style) => set({ style }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setProgress: (progress, stage) => set({ generationProgress: progress, generationStage: stage }),
  setResult: (result) => set({ result, isGenerating: false, generationStage: 'complete' }),
  setError: (error) => set({ error, isGenerating: false }),
  addToHistory: (result) => set((state) => ({ 
    history: [result, ...state.history].slice(0, 10) // Keep last 10
  })),
  reset: () => set({ 
    result: null, 
    error: null, 
    generationProgress: 0, 
    generationStage: 'idle',
    isGenerating: false 
  }),
  clearHistory: () => set({ history: [] }),
}));
