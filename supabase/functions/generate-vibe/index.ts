// NOTE: This is a temporary implementation of the generate-vibe Edge Function
// It generates random vibes without requiring external API calls

// Import necessary modules
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { v4 as uuid } from "https://esm.sh/uuid@9.0.0";

// Define types for the edge function
type VibeLayout = 'standard' | 'asymmetric' | 'centered' | 'sidebar';

type ColorTheme = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
};

type FontPairing = {
  primary: string;
  secondary: string;
  accent: string;
  mono: string;
};

type RadiusScale = {
  sm: string;
  md: string;
  lg: string;
};

type SpacingScale = {
  layoutSpacing: string;
  cardSpacing: string;
  elementSpacing: string;
};

type AnimationSettings = {
  speed: number;
  easing: number[];  // Updated to array format for Framer Motion
  entrance: string;
  hover: string;
};

type VibeSettings = {
  id: string;
  name: string;
  description: string;
  layout: VibeLayout;
  colors: ColorTheme;
  fonts: FontPairing;
  radius: RadiusScale;
  spacing: SpacingScale;
  animation: AnimationSettings;
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
};

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, Origin, X-Requested-With, Accept",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Random helpers
const randomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

const randomRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate a vibe based on theme and mood
const generateVibe = (theme?: string, mood?: string): VibeSettings => {
  // Generate theme-based name
  const themeWords = [
    "Neon", "Ocean", "Forest", "Desert", "Space", "Cyber", "Retro", "Futuristic",
    "Vintage", "Modern", "Minimal", "Vibrant", "Pastel", "Dark", "Light", "Muted",
    "Electric", "Organic", "Crystal", "Metallic", "Dreamy", "Sharp", "Soft", "Bold"
  ];
  
  // Generate mood-based name
  const moodWords = [
    "Calm", "Energetic", "Playful", "Serious", "Elegant", "Quirky", "Professional",
    "Creative", "Relaxed", "Dynamic", "Peaceful", "Exciting", "Cheerful", "Mysterious",
    "Warm", "Cool", "Fresh", "Intense", "Subtle", "Powerful", "Gentle", "Bold"
  ];
  
  // Use provided theme/mood or generate random ones
  const themeWord = theme ? 
    theme.charAt(0).toUpperCase() + theme.slice(1) : 
    randomItem(themeWords);
    
  const moodWord = mood ? 
    mood.charAt(0).toUpperCase() + mood.slice(1) : 
    randomItem(moodWords);
  
  // Generate name and description
  const name = `${themeWord} ${moodWord}`;
  const description = `A ${moodWord.toLowerCase()} UI theme with ${themeWord.toLowerCase()} aesthetics.`;
  
  // Generate layout
  const layout = randomItem<VibeLayout>(['standard', 'asymmetric', 'centered', 'sidebar']);
  
  // Generate colors
  const hues = {
    primary: randomRange(0, 360),
    secondary: randomRange(0, 360),
    accent: randomRange(0, 360)
  };
  
  const isDark = Math.random() > 0.5;
  
  const colors: ColorTheme = {
    background: isDark ? '240 10% 3.9%' : '0 0% 100%',
    foreground: isDark ? '0 0% 98%' : '240 10% 3.9%',
    card: isDark ? '240 10% 5.9%' : '0 0% 100%',
    cardForeground: isDark ? '0 0% 98%' : '240 10% 3.9%',
    primary: `${hues.primary} ${randomRange(70, 90)}% ${randomRange(40, 60)}%`,
    primaryForeground: isDark ? '0 0% 98%' : '0 0% 100%',
    secondary: `${hues.secondary} ${randomRange(20, 40)}% ${randomRange(80, 95)}%`,
    secondaryForeground: isDark ? '0 0% 98%' : '240 5.9% 10%',
    muted: isDark ? '240 3.7% 15.9%' : '240 4.8% 95.9%',
    mutedForeground: isDark ? '240 5% 64.9%' : '240 3.8% 46.1%',
    accent: `${hues.accent} ${randomRange(80, 100)}% ${randomRange(80, 95)}%`,
    accentForeground: isDark ? '0 0% 98%' : '240 5.9% 10%',
    destructive: isDark ? '0 62.8% 30.6%' : '0 84.2% 60.2%',
    destructiveForeground: isDark ? '0 0% 98%' : '0 0% 98%',
    border: isDark ? '240 3.7% 15.9%' : '240 5.9% 90%',
    input: isDark ? '240 3.7% 15.9%' : '240 5.9% 90%',
    ring: isDark ? `${hues.primary} 70% 50.4%` : `${hues.primary} 40% 50%`
  };
  
  // Generate fonts
  const fontOptions = [
    "'Inter', sans-serif",
    "'Space Grotesk', sans-serif",
    "'Playfair Display', serif",
    "'Quicksand', sans-serif",
    "'DM Serif Display', serif"
  ];
  
  const monoFonts = [
    "'Space Mono', monospace",
    "'Roboto Mono', monospace"
  ];
  
  const fonts: FontPairing = {
    primary: randomItem(fontOptions),
    secondary: randomItem(fontOptions),
    accent: randomItem(fontOptions),
    mono: randomItem(monoFonts)
  };
  
  // Generate radius
  const radiusStyle = Math.random() > 0.7 ? 'sharp' : Math.random() > 0.5 ? 'rounded' : 'soft';
  
  const radius: RadiusScale = radiusStyle === 'sharp' ? {
    sm: '0',
    md: '0',
    lg: '0'
  } : radiusStyle === 'rounded' ? {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem'
  } : {
    sm: '0.75rem',
    md: '1.5rem',
    lg: '2rem'
  };
  
  // Generate spacing
  const spacing: SpacingScale = {
    layoutSpacing: `${randomRange(15, 30) / 10}rem`,
    cardSpacing: `${randomRange(10, 25) / 10}rem`,
    elementSpacing: `${randomRange(8, 15) / 10}rem`
  };
  
  // Generate animations
  const entranceAnimations = ['fade-in', 'slide-in-up', 'slide-in-right', 'bounce-subtle'];
  const hoverAnimations = ['pulse-soft', 'float', 'wave', 'bounce-subtle'];
  
  // Updated easing options to use number arrays instead of cubic-bezier strings
  const easings = [
    [0.4, 0, 0.2, 1],    // was cubic-bezier(0.4, 0, 0.2, 1)
    [0.65, 0, 0.35, 1],   // was cubic-bezier(0.65, 0, 0.35, 1)
    [0.34, 1.56, 0.64, 1], // was cubic-bezier(0.34, 1.56, 0.64, 1)
    [0.68, -0.6, 0.32, 1.6] // was cubic-bezier(0.68, -0.6, 0.32, 1.6)
  ];
  
  const animation: AnimationSettings = {
    speed: randomRange(8, 12) / 10,
    easing: randomItem(easings),
    entrance: randomItem(entranceAnimations),
    hover: randomItem(hoverAnimations)
  };
  
  // Generate shadows
  let shadows;
  if (Math.random() > 0.8) {
    // Brutal shadows
    shadows = {
      sm: '2px 2px 0 0 rgb(0 0 0 / 1)',
      md: '4px 4px 0 0 rgb(0 0 0 / 1)',
      lg: '8px 8px 0 0 rgb(0 0 0 / 1)'
    };
  } else if (Math.random() > 0.5) {
    // Soft shadows
    shadows = {
      sm: '0 2px 10px 0 rgb(0 0 0 / 0.05)',
      md: '0 8px 30px 0 rgb(0 0 0 / 0.08)',
      lg: '0 25px 50px 0 rgb(0 0 0 / 0.1)'
    };
  } else {
    // Standard shadows
    shadows = {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
    };
  }
  
  // Generate and return the complete vibe
  return {
    id: uuid(),
    name,
    description,
    layout,
    colors,
    fonts,
    radius,
    spacing,
    animation,
    shadows
  };
};

// Main serve function for the edge function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Parse the request body
    const { theme, mood } = await req.json();
    
    // Log the request for debugging
    console.log(`Generating vibe with theme: ${theme}, mood: ${mood}`);
    
    // Generate the vibe with the specified theme/mood
    const vibe = generateVibe(theme, mood);
    
    // Return the generated vibe
    return new Response(
      JSON.stringify({
        success: true,
        vibe,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    // Log and return any errors
    console.error("Error in generate-vibe function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});

