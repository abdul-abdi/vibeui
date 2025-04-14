
import { VibeSettings } from './types';

// Apply vibe settings to CSS variables on the document root
export function applyVibe(vibe: VibeSettings): void {
  const root = document.documentElement;
  
  // Apply colors
  root.style.setProperty('--background', vibe.colors.background);
  root.style.setProperty('--foreground', vibe.colors.foreground);
  root.style.setProperty('--card', vibe.colors.card);
  root.style.setProperty('--card-foreground', vibe.colors.cardForeground);
  root.style.setProperty('--primary', vibe.colors.primary);
  root.style.setProperty('--primary-foreground', vibe.colors.primaryForeground);
  root.style.setProperty('--secondary', vibe.colors.secondary);
  root.style.setProperty('--secondary-foreground', vibe.colors.secondaryForeground);
  root.style.setProperty('--muted', vibe.colors.muted);
  root.style.setProperty('--muted-foreground', vibe.colors.mutedForeground);
  root.style.setProperty('--accent', vibe.colors.accent);
  root.style.setProperty('--accent-foreground', vibe.colors.accentForeground);
  root.style.setProperty('--destructive', vibe.colors.destructive);
  root.style.setProperty('--destructive-foreground', vibe.colors.destructiveForeground);
  root.style.setProperty('--border', vibe.colors.border);
  root.style.setProperty('--input', vibe.colors.input);
  root.style.setProperty('--ring', vibe.colors.ring);
  
  // Apply fonts
  root.style.setProperty('--font-primary', vibe.fonts.primary);
  root.style.setProperty('--font-secondary', vibe.fonts.secondary);
  root.style.setProperty('--font-accent', vibe.fonts.accent);
  root.style.setProperty('--font-mono', vibe.fonts.mono);
  
  // Apply radiuses
  root.style.setProperty('--radius-sm', vibe.radius.sm);
  root.style.setProperty('--radius-md', vibe.radius.md);
  root.style.setProperty('--radius-lg', vibe.radius.lg);
  
  // Apply spacing
  root.style.setProperty('--layout-spacing', vibe.spacing.layoutSpacing);
  root.style.setProperty('--card-spacing', vibe.spacing.cardSpacing);
  root.style.setProperty('--element-spacing', vibe.spacing.elementSpacing);
  
  // Apply animation settings
  root.style.setProperty('--animation-speed', vibe.animation.speed.toString());
  root.style.setProperty('--animation-easing', vibe.animation.easing);
  
  // Apply shadows
  root.style.setProperty('--shadow-sm', vibe.shadows.sm);
  root.style.setProperty('--shadow-md', vibe.shadows.md);
  root.style.setProperty('--shadow-lg', vibe.shadows.lg);

  // Apply layout class
  document.body.className = `layout-${vibe.layout}`;
}

// Generate a CSS animation string from settings
export function generateAnimationCSS(
  name: string,
  keyframes: string,
  duration: number,
  easing: string,
  delay: number = 0
): string {
  return `${name} ${duration}s ${easing} ${delay}s`;
}
