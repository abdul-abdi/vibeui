import { VibeSettings } from './types';

// Collection of carefully designed vibe presets
export const vibePresets: VibeSettings[] = [
  // Modern Minimal
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean, minimal interface with bold accents',
    layout: 'standard',
    colors: {
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      card: '0 0% 100%',
      cardForeground: '240 10% 3.9%',
      primary: '240 5.9% 10%',
      primaryForeground: '0 0% 98%',
      secondary: '240 4.8% 95.9%',
      secondaryForeground: '240 5.9% 10%',
      muted: '240 4.8% 95.9%',
      mutedForeground: '240 3.8% 46.1%',
      accent: '240 4.8% 95.9%',
      accentForeground: '240 5.9% 10%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 98%',
      border: '240 5.9% 90%',
      input: '240 5.9% 90%',
      ring: '240 5.9% 10%'
    },
    fonts: {
      primary: "'Inter', sans-serif",
      secondary: "'Inter', sans-serif",
      accent: "'Inter', sans-serif",
      mono: "'Roboto Mono', monospace"
    },
    radius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem'
    },
    spacing: {
      layoutSpacing: '2rem',
      cardSpacing: '1.5rem',
      elementSpacing: '1rem'
    },
    animation: {
      speed: 1,
      easing: [0.4, 0, 0.2, 1],  // Updated from 'cubic-bezier(0.4, 0, 0.2, 1)'
      entrance: 'fade-in',
      hover: 'pulse-soft'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
    }
  },
  
  // Vibrant Playful
  {
    id: 'vibrant-playful',
    name: 'Vibrant Playful',
    description: 'Bold, colorful interface with playful animations',
    layout: 'asymmetric',
    colors: {
      background: '280 75% 98%',
      foreground: '280 5% 13%',
      card: '0 0% 100%',
      cardForeground: '280 5% 13%',
      primary: '280 85% 65%',
      primaryForeground: '0 0% 100%',
      secondary: '180 100% 90%',
      secondaryForeground: '280 5% 13%',
      muted: '280 20% 92%',
      mutedForeground: '280 5% 40%',
      accent: '55 95% 65%',
      accentForeground: '280 5% 13%',
      destructive: '0 85% 65%',
      destructiveForeground: '0 0% 98%',
      border: '280 20% 88%',
      input: '280 20% 88%',
      ring: '280 85% 65%'
    },
    fonts: {
      primary: "'Quicksand', sans-serif",
      secondary: "'Space Grotesk', sans-serif",
      accent: "'Quicksand', sans-serif",
      mono: "'Space Mono', monospace"
    },
    radius: {
      sm: '0.75rem',
      md: '1.25rem',
      lg: '2rem'
    },
    spacing: {
      layoutSpacing: '2.5rem',
      cardSpacing: '1.75rem',
      elementSpacing: '1.25rem'
    },
    animation: {
      speed: 1.2,
      easing: [0.68, -0.6, 0.32, 1.6],  // Updated from 'cubic-bezier(0.68, -0.6, 0.32, 1.6)'
      entrance: 'bounce-subtle',
      hover: 'float'
    },
    shadows: {
      sm: '0 2px 8px 0 rgb(0 0 0 / 0.08)',
      md: '0 8px 16px -2px rgb(0 0 0 / 0.1), 0 4px 8px -2px rgb(0 0 0 / 0.1)',
      lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    }
  },
  
  // Elegant Serif
  {
    id: 'elegant-serif',
    name: 'Elegant Serif',
    description: 'Sophisticated interface with serif typography',
    layout: 'centered',
    colors: {
      background: '30 30% 98%',
      foreground: '210 20% 15%',
      card: '0 0% 100%',
      cardForeground: '210 20% 15%',
      primary: '210 60% 48%',
      primaryForeground: '0 0% 100%',
      secondary: '30 20% 94%',
      secondaryForeground: '210 20% 15%',
      muted: '30 10% 94%',
      mutedForeground: '210 10% 40%',
      accent: '210 40% 90%',
      accentForeground: '210 20% 15%',
      destructive: '0 70% 50%',
      destructiveForeground: '0 0% 98%',
      border: '30 20% 90%',
      input: '30 20% 90%',
      ring: '210 60% 48%'
    },
    fonts: {
      primary: "'Playfair Display', serif",
      secondary: "'DM Serif Display', serif",
      accent: "'Abril Fatface', cursive",
      mono: "'Roboto Mono', monospace"
    },
    radius: {
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.5rem'
    },
    spacing: {
      layoutSpacing: '3rem',
      cardSpacing: '2rem',
      elementSpacing: '1.5rem'
    },
    animation: {
      speed: 0.8,
      easing: [0.25, 0.1, 0.25, 1],  // Updated from 'cubic-bezier(0.25, 0.1, 0.25, 1)'
      entrance: 'fade-in',
      hover: 'pulse-soft'
    },
    shadows: {
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
    }
  },
  
  // Neo Brutalism
  {
    id: 'neo-brutalism',
    name: 'Neo Brutalism',
    description: 'Bold, high-contrast interface with sharp edges',
    layout: 'standard',
    colors: {
      background: '60 100% 97%',
      foreground: '0 0% 0%',
      card: '0 0% 100%',
      cardForeground: '0 0% 0%',
      primary: '0 85% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '60 100% 90%',
      secondaryForeground: '0 0% 0%',
      muted: '60 30% 92%',
      mutedForeground: '0 0% 40%',
      accent: '240 100% 70%',
      accentForeground: '0 0% 0%',
      destructive: '0 85% 60%',
      destructiveForeground: '0 0% 98%',
      border: '0 0% 0%',
      input: '0 0% 90%',
      ring: '0 85% 60%'
    },
    fonts: {
      primary: "'Space Grotesk', sans-serif",
      secondary: "'Space Grotesk', sans-serif",
      accent: "'Space Grotesk', sans-serif",
      mono: "'Space Mono', monospace"
    },
    radius: {
      sm: '0',
      md: '0',
      lg: '0'
    },
    spacing: {
      layoutSpacing: '2rem',
      cardSpacing: '1.5rem',
      elementSpacing: '1rem'
    },
    animation: {
      speed: 1.3,
      easing: [0.19, 1, 0.22, 1],  // Updated from 'cubic-bezier(0.19, 1, 0.22, 1)'
      entrance: 'slide-in-up',
      hover: 'bounce-subtle'
    },
    shadows: {
      sm: '2px 2px 0 0 rgb(0 0 0 / 1)',
      md: '4px 4px 0 0 rgb(0 0 0 / 1)',
      lg: '8px 8px 0 0 rgb(0 0 0 / 1)'
    }
  },
  
  // Dark Techno
  {
    id: 'dark-techno',
    name: 'Dark Techno',
    description: 'Sleek dark interface with neon accents',
    layout: 'sidebar',
    colors: {
      background: '240 10% 3.9%',
      foreground: '0 0% 98%',
      card: '240 10% 5.9%',
      cardForeground: '0 0% 98%',
      primary: '263.4 70% 50.4%',
      primaryForeground: '0 0% 100%',
      secondary: '240 3.7% 15.9%',
      secondaryForeground: '0 0% 98%',
      muted: '240 3.7% 15.9%',
      mutedForeground: '240 5% 64.9%',
      accent: '12 90% 60%',
      accentForeground: '0 0% 98%',
      destructive: '0 62.8% 30.6%',
      destructiveForeground: '0 0% 98%',
      border: '240 3.7% 15.9%',
      input: '240 3.7% 15.9%',
      ring: '263.4 70% 50.4%'
    },
    fonts: {
      primary: "'Space Grotesk', sans-serif",
      secondary: "'Space Grotesk', sans-serif",
      accent: "'Space Grotesk', sans-serif",
      mono: "'Space Mono', monospace"
    },
    radius: {
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.75rem'
    },
    spacing: {
      layoutSpacing: '2rem',
      cardSpacing: '1.5rem',
      elementSpacing: '1rem'
    },
    animation: {
      speed: 1.1,
      easing: [0.16, 1, 0.3, 1],  // Updated from 'cubic-bezier(0.16, 1, 0.3, 1)'
      entrance: 'slide-in-right',
      hover: 'pulse-soft'
    },
    shadows: {
      sm: '0 2px 10px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 20px -2px rgb(0 0 0 / 0.4)',
      lg: '0 10px 30px -5px rgb(0 0 0 / 0.5)'
    }
  },
  
  // Soft Organic
  {
    id: 'soft-organic',
    name: 'Soft Organic',
    description: 'Gentle, organic interface with soft colors and shapes',
    layout: 'asymmetric',
    colors: {
      background: '35 100% 98%',
      foreground: '35 40% 12%',
      card: '35 100% 100%',
      cardForeground: '35 40% 12%',
      primary: '160 84% 39%',
      primaryForeground: '0 0% 100%',
      secondary: '35 100% 96%',
      secondaryForeground: '35 40% 12%',
      muted: '35 30% 92%',
      mutedForeground: '35 30% 40%',
      accent: '35 100% 85%',
      accentForeground: '35 40% 12%',
      destructive: '10 75% 50%',
      destructiveForeground: '0 0% 98%',
      border: '35 30% 88%',
      input: '35 30% 88%',
      ring: '160 84% 39%'
    },
    fonts: {
      primary: "'Quicksand', sans-serif",
      secondary: "'Quicksand', sans-serif",
      accent: "'Quicksand', sans-serif",
      mono: "'Roboto Mono', monospace"
    },
    radius: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem'
    },
    spacing: {
      layoutSpacing: '2.5rem',
      cardSpacing: '2rem',
      elementSpacing: '1.25rem'
    },
    animation: {
      speed: 0.9,
      easing: [0.34, 1.56, 0.64, 1],  // Updated from 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      entrance: 'fade-in',
      hover: 'float'
    },
    shadows: {
      sm: '0 2px 10px 0 rgb(0 0 0 / 0.05)',
      md: '0 8px 30px 0 rgb(0 0 0 / 0.08)',
      lg: '0 25px 50px 0 rgb(0 0 0 / 0.1)'
    }
  },
];

// Function to get a random vibe preset
export function getRandomVibePreset(): VibeSettings {
  const randomIndex = Math.floor(Math.random() * vibePresets.length);
  return vibePresets[randomIndex];
}

// Function to get a specific vibe preset by ID
export function getVibePresetById(id: string): VibeSettings | undefined {
  return vibePresets.find(vibe => vibe.id === id);
}

