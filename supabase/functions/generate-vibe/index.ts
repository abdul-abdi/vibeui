
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define VibeSettings type locally instead of importing from frontend code
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

type VibeSettings = {
  id: string;
  name: string;
  description: string;
  layout: VibeLayout;
  colors: ColorTheme;
  fonts: {
    primary: string;
    secondary: string;
    accent: string;
    mono: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
  };
  spacing: {
    layoutSpacing: string;
    cardSpacing: string;
    elementSpacing: string;
  };
  animation: {
    speed: number;
    easing: string;
    entrance: string;
    hover: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
};

const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request for any additional parameters
    const requestData = await req.json().catch(() => ({}));
    const { theme = '', mood = '' } = requestData;

    console.log("Generating vibe with theme:", theme, "and mood:", mood);

    // Call Gemini API to generate a new vibe
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GOOGLE_AI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Generate a unique UI vibe theme for a web application. 
                ${theme ? `The theme should incorporate: ${theme}.` : ''}
                ${mood ? `The mood should be: ${mood}.` : ''}
                
                Return a JSON object with the following structure:
                {
                  "id": "unique-id-here",
                  "name": "Creative Theme Name",
                  "description": "Short description of the theme and its feeling",
                  "layout": "One of: standard, asymmetric, centered, sidebar",
                  "colors": {
                    "background": "HSL value",
                    "foreground": "HSL value",
                    "card": "HSL value",
                    "cardForeground": "HSL value",
                    "primary": "HSL value",
                    "primaryForeground": "HSL value",
                    "secondary": "HSL value",
                    "secondaryForeground": "HSL value",
                    "muted": "HSL value",
                    "mutedForeground": "HSL value",
                    "accent": "HSL value",
                    "accentForeground": "HSL value",
                    "destructive": "HSL value",
                    "destructiveForeground": "HSL value",
                    "border": "HSL value",
                    "input": "HSL value",
                    "ring": "HSL value"
                  },
                  "fonts": {
                    "primary": "Font family name with fallbacks",
                    "secondary": "Font family name with fallbacks",
                    "accent": "Font family name with fallbacks",
                    "mono": "Monospace font family with fallbacks"
                  },
                  "radius": {
                    "sm": "small radius value (e.g. 0.125rem)",
                    "md": "medium radius value (e.g. 0.375rem)",
                    "lg": "large radius value (e.g. 0.75rem)"
                  },
                  "spacing": {
                    "layoutSpacing": "layout spacing value (e.g. 2rem)",
                    "cardSpacing": "card internal spacing value (e.g. 1.5rem)",
                    "elementSpacing": "element spacing value (e.g. 1rem)"
                  },
                  "animation": {
                    "speed": "animation speed multiplier as a number (e.g. 1.2)",
                    "easing": "CSS easing function (e.g. cubic-bezier(0.4, 0, 0.2, 1))",
                    "entrance": "entrance animation name (one of: fade-in, slide-in-up, slide-in-right, slide-in-down, slide-in-left, bounce-subtle)",
                    "hover": "hover animation name (one of: pulse-soft, float, bounce-subtle, wave, spin-slow)"
                  },
                  "shadows": {
                    "sm": "small shadow value",
                    "md": "medium shadow value",
                    "lg": "large shadow value"
                  }
                }

                Make all properties valid CSS values. For colors, use HSL format like "240 10% 3.9%".
                Be creative and cohesive with the theme.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    const jsonResponse = await response.json();
    
    // Extract the generated vibe from the Gemini response
    const generatedText = jsonResponse.candidates[0]?.content?.parts[0]?.text;
    
    // Extract the JSON object from the response text
    const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/) || 
                       generatedText.match(/```([\s\S]*?)```/) ||
                       [null, generatedText];
                       
    let vibeData;
    try {
      const jsonText = jsonMatch[1] || generatedText;
      vibeData = JSON.parse(jsonText);
    } catch (e) {
      console.error("Error parsing JSON from Gemini response:", e);
      console.log("Raw response:", generatedText);
      throw new Error("Failed to parse generated vibe data");
    }

    // Generate a unique ID if not provided
    if (!vibeData.id || vibeData.id === "unique-id-here") {
      vibeData.id = crypto.randomUUID();
    }

    // Save the vibe to Supabase
    const { data: savedVibe, error } = await fetch(`https://jhvuteawbvlkssznovxq.supabase.co/rest/v1/generated_vibes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpodnV0ZWF3YnZsa3Nzem5vdnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTcyMjIsImV4cCI6MjA2MDE5MzIyMn0.at5JxnT-MbwEz4_x0me7vVUUqQw4c0dgBP0szqaIavQ",
        "Prefer": "return=representation"
      },
      body: JSON.stringify({
        name: vibeData.name,
        description: vibeData.description,
        layout: vibeData.layout,
        colors: vibeData.colors,
        fonts: vibeData.fonts,
        radius_settings: vibeData.radius,
        spacing_settings: vibeData.spacing,
        animation_settings: vibeData.animation,
        shadow_settings: vibeData.shadows
      })
    }).then(res => res.json());

    if (error) {
      throw new Error(`Error saving vibe: ${error.message}`);
    }

    // Return the formatted vibe object
    return new Response(JSON.stringify({ vibe: vibeData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error generating vibe:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
