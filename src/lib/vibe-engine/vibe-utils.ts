
import { VibeSettings } from './types';

// Apply vibe settings to CSS variables on the document root
export function applyVibe(vibe: VibeSettings): void {
  const root = document.documentElement;
  
  // Add a transition class to the root element for smooth color transitions
  root.classList.add('transitioning-vibe');
  
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
  
  // Apply animation settings - Convert array to string for CSS
  root.style.setProperty('--animation-speed', vibe.animation.speed.toString());
  
  // Convert the array of bezier curve values to a cubic-bezier string for CSS
  const easingArray = Array.isArray(vibe.animation.easing) ? vibe.animation.easing : [0.4, 0, 0.2, 1];
  root.style.setProperty('--animation-easing', `cubic-bezier(${easingArray.join(', ')})`);
  
  // Apply shadows
  root.style.setProperty('--shadow-sm', vibe.shadows.sm);
  root.style.setProperty('--shadow-md', vibe.shadows.md);
  root.style.setProperty('--shadow-lg', vibe.shadows.lg);

  // Apply layout class with transition
  const currentLayout = document.body.className.match(/layout-\w+/)?.[0];
  if (currentLayout) {
    document.body.classList.remove(currentLayout);
  }
  
  // Add the new layout class and trigger a reflow
  document.body.classList.add(`layout-${vibe.layout}`);
  
  // Add a CSS variable with color values that can be used for gradients and overlays
  const primaryHSL = vibe.colors.primary.replace(/hsl\(|\)/g, '').split(' ');
  if (primaryHSL.length >= 3) {
    root.style.setProperty('--primary-h', primaryHSL[0]);
    root.style.setProperty('--primary-s', primaryHSL[1].replace('%', ''));
    root.style.setProperty('--primary-l', primaryHSL[2].replace('%', ''));
  }
  
  // Remove the transition class after the transition is complete
  setTimeout(() => {
    root.classList.remove('transitioning-vibe');
  }, 600); // match this to the CSS transition duration
}

// Generate a CSS animation string from settings
export function generateAnimationCSS(
  name: string,
  keyframes: string,
  duration: number,
  easing: number[] | string,
  delay: number = 0
): string {
  // Handle easing as either number array or string
  let easingValue: string;
  if (Array.isArray(easing)) {
    easingValue = `cubic-bezier(${easing.join(', ')})`;
  } else {
    easingValue = easing;
  }
  
  return `${name} ${duration}s ${easingValue} ${delay}s`;
}

// Convert hex color to HSL for better transitions
export function hexToHSL(hex: string): string {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Convert hex to rgb
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  
  let h = 0;
  let s = 0;
  let l = 0;
  
  // Calculate hue
  if (delta === 0) {
    h = 0;
  } else if (cmax === r) {
    h = ((g - b) / delta) % 6;
  } else if (cmax === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }
  
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  
  // Calculate lightness
  l = (cmax + cmin) / 2;
  
  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  
  // Convert to percentages
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  
  return `${h} ${s}% ${l}%`;
}

// Get contrast color (black or white) based on background color
export function getContrastColor(hsl: string): string {
  const parts = hsl.split(' ');
  if (parts.length < 3) return 'var(--foreground)';
  
  const l = parseFloat(parts[2].replace('%', ''));
  return l > 50 ? '0 0% 0%' : '0 0% 100%';
}
