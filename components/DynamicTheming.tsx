'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { PRESETS } from '@/lib/presets';
import { applyTheme } from '@/lib/theme-utils';

export function DynamicTheming() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Pick a random preset on mount (page load)
    // We use a deterministic random index based on something that changes per session
    // Or just Math.random() since the user asked for "everytime a person loads the site"
    
    const savedPresetIndex = sessionStorage.getItem('vibeui-preset-index');
    let index: number;
    
    if (savedPresetIndex !== null) {
      // Keep the same vibe for the session so it doesn't flicker on nav
      index = parseInt(savedPresetIndex, 10);
      // If we have a stored index, small chance to re-roll on full reload? 
      // User said "everytime a person loads the site". 
      // Let's assume hitting refresh = new vibe.
      // So we ignore session storage for the purpose of "refresh".
    }
    
    // Actually, to make it truly "every load", we just pick new.
    index = Math.floor(Math.random() * PRESETS.length);
    sessionStorage.setItem('vibeui-preset-index', index.toString());
    
    const preset = PRESETS[index];
    console.log(`[VibeUI] Applied preset: ${preset.name}`);
    
    applyTheme(preset, (resolvedTheme as 'light' | 'dark' | undefined) || 'dark');
    
  }, [resolvedTheme]); // Re-apply if theme switches between light/dark

  return null;
}
