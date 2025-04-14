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
  
  // Add CSS variables with color values that can be used for gradients and overlays
  const primaryHSL = vibe.colors.primary.replace(/hsl\(|\)/g, '').split(' ');
  if (primaryHSL.length >= 3) {
    root.style.setProperty('--primary-h', primaryHSL[0]);
    root.style.setProperty('--primary-s', primaryHSL[1].replace('%', ''));
    root.style.setProperty('--primary-l', primaryHSL[2].replace('%', ''));
    root.style.setProperty('--primary-rgb', hslToRgb(primaryHSL[0], primaryHSL[1], primaryHSL[2]));
  }
  
  // Apply special vibe-specific styles
  applySpecialVibeStyles(vibe, root);
  
  // Process secondary and accent colors for RGB values
  const secondaryHSL = vibe.colors.secondary.replace(/hsl\(|\)/g, '').split(' ');
  if (secondaryHSL.length >= 3) {
    root.style.setProperty('--secondary-h', secondaryHSL[0]);
    root.style.setProperty('--secondary-s', secondaryHSL[1].replace('%', ''));
    root.style.setProperty('--secondary-l', secondaryHSL[2].replace('%', ''));
    root.style.setProperty('--secondary-rgb', hslToRgb(secondaryHSL[0], secondaryHSL[1], secondaryHSL[2]));
  }
  
  const accentHSL = vibe.colors.accent.replace(/hsl\(|\)/g, '').split(' ');
  if (accentHSL.length >= 3) {
    root.style.setProperty('--accent-h', accentHSL[0]);
    root.style.setProperty('--accent-s', accentHSL[1].replace('%', ''));
    root.style.setProperty('--accent-l', accentHSL[2].replace('%', ''));
    root.style.setProperty('--accent-rgb', hslToRgb(accentHSL[0], accentHSL[1], accentHSL[2]));
  }
  
  // Remove the transition class after the transition is complete
  setTimeout(() => {
    root.classList.remove('transitioning-vibe');
  }, 800); // match this to the CSS transition duration
}

// Apply special styles for specific named vibes
function applySpecialVibeStyles(vibe: VibeSettings, root: HTMLElement): void {
  // Reset all special theme classes first
  document.body.classList.remove(
    'soft-organic-theme',
    'neo-brutalism-theme',
    'dark-techno-theme',
    'elegant-serif-theme',
    'electric-pop-theme',
    'vibrant-playful-theme',
    'modern-minimal-theme'
  );
  
  // Apply theme-specific classes and variables
  const vibeName = vibe.name.toLowerCase();
  
  if (vibeName.includes("organic")) {
    document.body.classList.add('soft-organic-theme');
    // Set specific colors for soft organic theme
    if (!vibe.colors.primary.includes('160')) {
      root.style.setProperty('--primary', '160 84% 39%');
    }
    
    // Add biomorphic shape variables
    root.style.setProperty('--organic-blob-1', 'ellipse(30% 40% at 50% 60%)');
    root.style.setProperty('--organic-blob-2', 'circle(20% at 65% 35%)');
  } 
  else if (vibeName.includes("brutal") || vibeName.includes("neo-brutal")) {
    document.body.classList.add('neo-brutalism-theme');
    root.style.setProperty('--brutal-offset-x', '6px');
    root.style.setProperty('--brutal-offset-y', '6px');
    root.style.setProperty('--brutal-color', '#000');
  }
  else if (vibeName.includes("techno") || vibeName.includes("dark") && vibeName.includes("tech")) {
    document.body.classList.add('dark-techno-theme');
    // Add neon glow variables
    root.style.setProperty('--neon-glow', `0 0 10px rgba(${root.style.getPropertyValue('--primary-rgb')}, 0.7), 0 0 20px rgba(${root.style.getPropertyValue('--primary-rgb')}, 0.5)`);
    root.style.setProperty('--neon-glow-strong', `0 0 15px rgba(${root.style.getPropertyValue('--primary-rgb')}, 0.8), 0 0 30px rgba(${root.style.getPropertyValue('--primary-rgb')}, 0.6), 0 0 45px rgba(${root.style.getPropertyValue('--primary-rgb')}, 0.4)`);
  }
  else if (vibeName.includes("electric") || vibeName.includes("pop") || vibeName.includes("neon")) {
    document.body.classList.add('electric-pop-theme');
    // Add electric glow variables
    root.style.setProperty('--electric-glow', `0 0 10px rgba(${root.style.getPropertyValue('--primary-rgb')}, 0.7), 0 0 20px rgba(${root.style.getPropertyValue('--primary-rgb')}, 0.5)`);
    root.style.setProperty('--electric-gradient', 'linear-gradient(45deg, var(--primary) 0%, var(--accent) 100%)');
  }
  else if (vibeName.includes("elegant") || vibeName.includes("serif")) {
    document.body.classList.add('elegant-serif-theme');
    // Serif theme variables
    root.style.setProperty('--serif-decoration', '1px solid rgba(0,0,0,0.1)');
    root.style.setProperty('--serif-spacing', '0.05em');
  }
  else if (vibeName.includes("playful") || vibeName.includes("vibrant")) {
    document.body.classList.add('vibrant-playful-theme');
    // Playful theme variables
    root.style.setProperty('--playful-shadow', '0 8px 20px -5px rgba(0, 0, 0, 0.15)');
  }
  else if (vibeName.includes("minimal") || vibeName.includes("modern")) {
    document.body.classList.add('modern-minimal-theme');
    // Minimal theme variables
    root.style.setProperty('--minimal-border', '1px solid rgba(0,0,0,0.05)');
  }

  // Apply themed animations
  applyThemedAnimations(vibe, root);
}

// Apply theme-specific animation settings
function applyThemedAnimations(vibe: VibeSettings, root: HTMLElement): void {
  const vibeName = vibe.name.toLowerCase();
  
  if (vibeName.includes("organic")) {
    root.style.setProperty('--themed-animation', 'float 6s ease-in-out infinite');
  }
  else if (vibeName.includes("brutal") || vibeName.includes("neo-brutal")) {
    root.style.setProperty('--themed-animation', 'none'); // Brutalism often avoids animations
  }
  else if (vibeName.includes("techno") || (vibeName.includes("dark") && vibeName.includes("tech"))) {
    root.style.setProperty('--themed-animation', 'pulse 2s ease-in-out infinite');
  }
  else if (vibeName.includes("electric") || vibeName.includes("pop") || vibeName.includes("neon")) {
    root.style.setProperty('--themed-animation', 'neon-pulse 1.5s ease-in-out infinite');
  }
  else if (vibeName.includes("elegant") || vibeName.includes("serif")) {
    root.style.setProperty('--themed-animation', 'fade-in 0.7s ease-out');
  }
  else if (vibeName.includes("playful") || vibeName.includes("vibrant")) {
    root.style.setProperty('--themed-animation', 'bounce-subtle 3s infinite');
  }
  else {
    root.style.setProperty('--themed-animation', 'fade-in 0.5s ease-out');
  }
}

// Convert HSL values to RGB for use in rgba() functions
function hslToRgb(h: string, s: string, l: string): string {
  // Remove any "%" from s and l
  const hue = parseFloat(h);
  const sat = parseFloat(s.replace('%', '')) / 100;
  const light = parseFloat(l.replace('%', '')) / 100;
  
  let r, g, b;
  
  if (sat === 0) {
    r = g = b = light; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
    const p = 2 * light - q;
    r = hue2rgb(p, q, (hue / 360 + 1/3) % 1);
    g = hue2rgb(p, q, (hue / 360) % 1);
    b = hue2rgb(p, q, (hue / 360 - 1/3) % 1);
  }
  
  return `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`;
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

// Generate a themed button style based on current vibe
export function getThemedButtonStyle(vibe: VibeSettings, variant: string): string {
  const vibeName = vibe.name.toLowerCase();
  let style = '';
  
  if (vibeName.includes("organic") && variant === 'primary') {
    style = `
      background-color: hsl(var(--primary));
      border-radius: 24px;
      box-shadow: 0 4px 12px rgba(0, 128, 96, 0.2);
    `;
  }
  
  return style;
}

// Generate a color palette array from the current vibe
export function generateColorPalette(vibe: VibeSettings): string[] {
  const palette: string[] = [
    vibe.colors.primary,
    vibe.colors.secondary,
    vibe.colors.accent,
    vibe.colors.muted
  ];
  
  return palette;
}
