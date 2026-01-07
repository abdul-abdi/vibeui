import { DesignSystem } from './types';

export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}

function adjustColorForMode(hex: string, mode: 'light' | 'dark', type: 'background' | 'foreground'): string {
  // Simple pass-through for now, but could be used to invert colors if needed
  // In our case, the presets should already be tuned, or we generate light/dark variants 
  // For this V1, we will trust the preset or derive it.
  return hex;
}

export function applyTheme(designSystem: DesignSystem, mode: 'light' | 'dark' | 'system') {
  const root = document.documentElement;
  const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const colors = designSystem.colors;
  
  // Define themes
  // We need to map the high-level design system to our app's semantics
  // App variables: 
  // --background, --foreground, --muted, --muted-foreground, --border, --ring, 
  // --card, --card-hover, --input-bg, --btn-primary-bg, --btn-primary-text, 
  // --dot-color, --glow-color

  if (isDark) {
    // DARK MODE MAPPING
    const bg = colors.neutral[950]; // Very dark
    const card = colors.neutral[900]; // Slightly lighter
    const border = colors.neutral[800]; // Visible border
    
    root.style.setProperty('--background', bg);
    root.style.setProperty('--foreground', colors.neutral[50]);
    root.style.setProperty('--muted', colors.neutral[700]);
    root.style.setProperty('--muted-foreground', colors.neutral[400]);
    
    root.style.setProperty('--border', `rgba(${hexToRgb(colors.neutral[700])}, 0.3)`);
    root.style.setProperty('--ring', `rgba(${hexToRgb(colors.primary[500])}, 0.2)`);
    
    root.style.setProperty('--card', `rgba(${hexToRgb(card)}, 0.4)`);
    root.style.setProperty('--card-hover', `rgba(${hexToRgb(colors.neutral[800])}, 0.4)`);
    root.style.setProperty('--input-bg', `rgba(${hexToRgb(colors.neutral[800])}, 0.3)`);
    
    root.style.setProperty('--btn-primary-bg', colors.primary[500]);
    root.style.setProperty('--btn-primary-text', colors.text.inverse); // Usually white/black depending on contrast
    
    root.style.setProperty('--dot-color', `rgba(${hexToRgb(colors.neutral[500])}, 0.1)`);
    root.style.setProperty('--glow-color', `rgba(${hexToRgb(colors.primary[600])}, 0.15)`);
  } else {
    // LIGHT MODE MAPPING - Specific fix for "not looking good"
    // Problems with old light mode: too generic, poor contrast on borders
    
    // We want a very slight tint of the primary color in the background for personality
    // but keep it mostly white/neutral.
    
    const bg = colors.neutral[50]; 
    const fg = colors.neutral[900];
    
    root.style.setProperty('--background', bg);
    root.style.setProperty('--foreground', fg);
    
    // Make muted darker in light mode for better readability
    root.style.setProperty('--muted', colors.neutral[200]);
    root.style.setProperty('--muted-foreground', colors.neutral[600]);
    
    // Crisper borders in light mode
    root.style.setProperty('--border', `rgba(${hexToRgb(colors.neutral[300])}, 0.8)`);
    root.style.setProperty('--ring', `rgba(${hexToRgb(colors.primary[500])}, 0.1)`);
    
    // Cards need to pop slightly from the background
    root.style.setProperty('--card', `rgba(255, 255, 255, 0.7)`);
    root.style.setProperty('--card-hover', `rgba(255, 255, 255, 0.9)`);
    root.style.setProperty('--input-bg', '#ffffff');
    
    // Brand buttons
    root.style.setProperty('--btn-primary-bg', colors.primary[900]); // Dark button on light bg looks lux
    root.style.setProperty('--btn-primary-text', '#ffffff');
    
    // Subtle personality
    root.style.setProperty('--dot-color', `rgba(${hexToRgb(colors.neutral[900])}, 0.05)`);
    root.style.setProperty('--glow-color', `rgba(${hexToRgb(colors.primary[400])}, 0.08)`);
  }
}
