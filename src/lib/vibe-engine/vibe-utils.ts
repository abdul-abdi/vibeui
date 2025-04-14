import { VibeSettings } from './types';

// Apply vibe settings to CSS variables on the document root
export function applyVibe(vibe: VibeSettings): void {
  const root = document.documentElement;
  
  // Add a transition class to the root element for smooth color transitions
  root.classList.add('transitioning-vibe');
  
  // Apply all CSS variables in a single batch to reduce layout thrashing
  const cssVars = {
    '--background': vibe.colors.background,
    '--foreground': vibe.colors.foreground,
    '--card': vibe.colors.card,
    '--card-foreground': vibe.colors.cardForeground,
    '--primary': vibe.colors.primary,
    '--primary-foreground': vibe.colors.primaryForeground,
    '--secondary': vibe.colors.secondary,
    '--secondary-foreground': vibe.colors.secondaryForeground,
    '--muted': vibe.colors.muted,
    '--muted-foreground': vibe.colors.mutedForeground,
    '--accent': vibe.colors.accent,
    '--accent-foreground': vibe.colors.accentForeground,
    '--destructive': vibe.colors.destructive,
    '--destructive-foreground': vibe.colors.destructiveForeground,
    '--border': vibe.colors.border,
    '--input': vibe.colors.input,
    '--ring': vibe.colors.ring,
    '--font-primary': vibe.fonts.primary,
    '--font-secondary': vibe.fonts.secondary,
    '--font-accent': vibe.fonts.accent,
    '--font-mono': vibe.fonts.mono,
    '--radius-sm': vibe.radius.sm,
    '--radius-md': vibe.radius.md,
    '--radius-lg': vibe.radius.lg,
    '--layout-spacing': vibe.spacing.layoutSpacing,
    '--card-spacing': vibe.spacing.cardSpacing,
    '--element-spacing': vibe.spacing.elementSpacing,
    '--animation-speed': vibe.animation.speed.toString(),
    '--shadow-sm': vibe.shadows.sm,
    '--shadow-md': vibe.shadows.md,
    '--shadow-lg': vibe.shadows.lg,
  };
  
  // Apply all CSS variables at once
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // Convert the array of bezier curve values to a cubic-bezier string for CSS
  const easingArray = Array.isArray(vibe.animation.easing) ? vibe.animation.easing : [0.4, 0, 0.2, 1];
  root.style.setProperty('--animation-easing', `cubic-bezier(${easingArray.join(', ')})`);

  // Apply layout class with transition
  const currentLayout = document.body.className.match(/layout-\w+/)?.[0];
  if (currentLayout) {
    document.body.classList.remove(currentLayout);
  }
  
  // Add the new layout class and trigger a reflow
  document.body.classList.add(`layout-${vibe.layout}`);
  
  // Process color values efficiently
  processColorValues(vibe, root);
  
  // Apply special vibe-specific styles
  applySpecialVibeStyles(vibe, root);
  
  // Remove the transition class after the transition is complete
  // Use requestAnimationFrame to optimize timing
  requestAnimationFrame(() => {
    setTimeout(() => {
      root.classList.remove('transitioning-vibe');
    }, 600); // Reduced from 800ms for better performance
  });
}

// Process color values for RGB usage - optimized to reduce calculations
function processColorValues(vibe: VibeSettings, root: HTMLElement): void {
  // Create a helper function to extract and process HSL values
  const processColorProperty = (colorValue: string, prefix: string) => {
    const parts = colorValue.replace(/hsl\(|\)/g, '').split(' ');
    if (parts.length >= 3) {
      const h = parts[0];
      const s = parts[1].replace('%', '');
      const l = parts[2].replace('%', '');
      root.style.setProperty(`--${prefix}-h`, h);
      root.style.setProperty(`--${prefix}-s`, s);
      root.style.setProperty(`--${prefix}-l`, l);
      root.style.setProperty(`--${prefix}-rgb`, hslToRgb(h, s, l));
    }
  };
  
  // Process each color property
  processColorProperty(vibe.colors.primary, 'primary');
  processColorProperty(vibe.colors.secondary, 'secondary');
  processColorProperty(vibe.colors.accent, 'accent');
}

// Apply special styles for specific named vibes - optimized
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
  
  // Apply theme-specific classes and variables - optimized logic
  const vibeName = vibe.name.toLowerCase();
  let themeClass = '';
  const styleVars: Record<string, string> = {};
  
  if (vibeName.includes("organic")) {
    themeClass = 'soft-organic-theme';
    if (!vibe.colors.primary.includes('160')) {
      styleVars['--primary'] = '160 84% 39%';
    }
    styleVars['--organic-blob-1'] = 'ellipse(30% 40% at 50% 60%)';
    styleVars['--organic-blob-2'] = 'circle(20% at 65% 35%)';
  } 
  else if (vibeName.includes("brutal") || vibeName.includes("neo-brutal")) {
    themeClass = 'neo-brutalism-theme';
    styleVars['--brutal-offset-x'] = '6px';
    styleVars['--brutal-offset-y'] = '6px';
    styleVars['--brutal-color'] = '#000';
  }
  else if (vibeName.includes("techno") || (vibeName.includes("dark") && vibeName.includes("tech"))) {
    themeClass = 'dark-techno-theme';
    const primaryRgb = root.style.getPropertyValue('--primary-rgb');
    styleVars['--neon-glow'] = `0 0 10px rgba(${primaryRgb}, 0.7), 0 0 20px rgba(${primaryRgb}, 0.5)`;
    styleVars['--neon-glow-strong'] = `0 0 15px rgba(${primaryRgb}, 0.8), 0 0 30px rgba(${primaryRgb}, 0.6), 0 0 45px rgba(${primaryRgb}, 0.4)`;
    styleVars['--enhanced-contrast-text'] = '0 0% 98%';
    styleVars['--dark-texture'] = 'rgba(20, 20, 25, 0.3)';
  }
  else if (vibeName.includes("electric") || vibeName.includes("pop") || vibeName.includes("neon")) {
    themeClass = 'electric-pop-theme';
    const primaryRgb = root.style.getPropertyValue('--primary-rgb');
    styleVars['--electric-glow'] = `0 0 10px rgba(${primaryRgb}, 0.7), 0 0 20px rgba(${primaryRgb}, 0.5)`;
    styleVars['--electric-gradient'] = 'linear-gradient(45deg, var(--primary) 0%, var(--accent) 100%)';
    styleVars['--enhanced-contrast-text'] = '0 0% 98%';
  }
  else if (vibeName.includes("elegant") || vibeName.includes("serif")) {
    themeClass = 'elegant-serif-theme';
    styleVars['--serif-decoration'] = '1px solid rgba(0,0,0,0.1)';
    styleVars['--serif-spacing'] = '0.05em';
  }
  else if (vibeName.includes("playful") || vibeName.includes("vibrant")) {
    themeClass = 'vibrant-playful-theme';
    styleVars['--playful-shadow'] = '0 8px 20px -5px rgba(0, 0, 0, 0.15)';
  }
  else if (vibeName.includes("minimal") || vibeName.includes("modern")) {
    themeClass = 'modern-minimal-theme';
    styleVars['--minimal-border'] = '1px solid rgba(0,0,0,0.05)';
  }

  // Apply the theme class
  if (themeClass) {
    document.body.classList.add(themeClass);
  }
  
  // Apply all style variables at once
  Object.entries(styleVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // Apply themed animations
  applyThemedAnimations(vibe, root);
}

// Apply theme-specific animation settings - optimized
function applyThemedAnimations(vibe: VibeSettings, root: HTMLElement): void {
  const vibeName = vibe.name.toLowerCase();
  let animation = '';
  
  if (vibeName.includes("organic")) {
    animation = 'float 6s ease-in-out infinite';
  }
  else if (vibeName.includes("brutal") || vibeName.includes("neo-brutal")) {
    animation = 'none'; // Brutalism often avoids animations
  }
  else if (vibeName.includes("techno") || (vibeName.includes("dark") && vibeName.includes("tech"))) {
    animation = 'pulse 2s ease-in-out infinite';
  }
  else if (vibeName.includes("electric") || vibeName.includes("pop") || vibeName.includes("neon")) {
    animation = 'neon-pulse 1.5s ease-in-out infinite';
  }
  else if (vibeName.includes("elegant") || vibeName.includes("serif")) {
    animation = 'fade-in 0.7s ease-out';
  }
  else if (vibeName.includes("playful") || vibeName.includes("vibrant")) {
    animation = 'bounce-subtle 3s infinite';
  }
  else {
    animation = 'fade-in 0.5s ease-out';
  }
  
  root.style.setProperty('--themed-animation', animation);
}

// Convert HSL values to RGB for use in rgba() functions - optimized with memoization
const hslToRgbCache = new Map<string, string>();

function hslToRgb(h: string, s: string, l: string): string {
  const cacheKey = `${h},${s},${l}`;
  
  // Check if we have cached this calculation
  if (hslToRgbCache.has(cacheKey)) {
    return hslToRgbCache.get(cacheKey)!;
  }
  
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
  
  const result = `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`;
  
  // Cache the result for future use
  hslToRgbCache.set(cacheKey, result);
  
  return result;
}

// Generate a CSS animation string from settings - optimized
export function generateAnimationCSS(
  name: string,
  keyframes: string,
  duration: number,
  easing: number[] | string,
  delay: number = 0
): string {
  // Handle easing as either number array or string
  const easingValue = Array.isArray(easing) 
    ? `cubic-bezier(${easing.join(', ')})`
    : easing;
  
  return `${name} ${duration}s ${easingValue} ${delay}s`;
}

// Convert hex color to HSL for better transitions - optimized with memoization
const hexToHslCache = new Map<string, string>();

export function hexToHSL(hex: string): string {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Check if we have cached this conversion
  if (hexToHslCache.has(hex)) {
    return hexToHslCache.get(hex)!;
  }
  
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
  
  const result = `${h} ${s}% ${l}%`;
  
  // Cache the result
  hexToHslCache.set(hex, result);
  
  return result;
}

// Get contrast color (black or white) based on background color - optimized with memoization
const contrastColorCache = new Map<string, string>();

export function getContrastColor(hsl: string): string {
  // Check if we have cached this contrast calculation
  if (contrastColorCache.has(hsl)) {
    return contrastColorCache.get(hsl)!;
  }
  
  const parts = hsl.split(' ');
  if (parts.length < 3) {
    const result = 'var(--foreground)';
    contrastColorCache.set(hsl, result);
    return result;
  }
  
  // Improve the lightness threshold for better contrast with dark backgrounds
  const l = parseFloat(parts[2].replace('%', ''));
  
  // Lower threshold for dark backgrounds to ensure better visibility
  // Also consider hue and saturation for better color perception
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1].replace('%', ''));
  
  // For certain color ranges (blues, purples) we need different thresholds
  // as they appear darker to human perception
  let result: string;
  if ((h >= 200 && h <= 280) && s > 50) {
    result = l > 45 ? '0 0% 0%' : '0 0% 100%';
  } else {
    result = l > 50 ? '0 0% 0%' : '0 0% 100%';
  }
  
  // Cache the result
  contrastColorCache.set(hsl, result);
  
  return result;
}

// Generate a themed button style based on current vibe
export function getThemedButtonStyle(vibe: VibeSettings, variant: string): string {
  const vibeName = vibe.name.toLowerCase();
  
  if (vibeName.includes("organic") && variant === 'primary') {
    return `
      background-color: hsl(var(--primary));
      border-radius: 24px;
      box-shadow: 0 4px 12px rgba(0, 128, 96, 0.2);
    `;
  }
  
  return '';
}

// Generate a color palette array from the current vibe
export function generateColorPalette(vibe: VibeSettings): string[] {
  return [
    vibe.colors.primary,
    vibe.colors.secondary,
    vibe.colors.accent,
    vibe.colors.muted
  ];
}
