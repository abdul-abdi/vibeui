import { supabase } from "@/integrations/supabase/client";
import { VibeSettings } from "./types";
import { toast } from "@/hooks/use-toast";
import { getRandomVibePreset } from "./vibe-presets";

// Cache control
const CACHE_KEY = 'vibeui_cached_vibes';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

// Check if there are cached vibes
const getCachedVibes = (): { vibes: VibeSettings[] | null, timestamp: number } | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    return data;
  } catch (e) {
    console.error('Error retrieving cached vibes:', e);
    return null;
  }
};

// Save vibes to cache
const cacheVibes = (vibes: VibeSettings[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheData = {
      vibes,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (e) {
    console.error('Error caching vibes:', e);
  }
};

// Convert database format to VibeSettings format
export const mapDbVibeToVibeSettings = (dbVibe: any): VibeSettings => {
  return {
    id: dbVibe.id,
    name: dbVibe.name,
    description: dbVibe.description,
    layout: dbVibe.layout,
    colors: dbVibe.colors,
    fonts: dbVibe.fonts,
    radius: dbVibe.radius_settings,
    spacing: dbVibe.spacing_settings,
    animation: dbVibe.animation_settings,
    shadows: dbVibe.shadow_settings,
  };
};

// Fetch all AI-generated vibes from Supabase with caching
export const fetchAiVibes = async (): Promise<VibeSettings[]> => {
  // Check cache first
  const cached = getCachedVibes();
  const now = Date.now();
  
  // If we have valid cached data, use it
  if (cached && cached.vibes && (now - cached.timestamp < CACHE_EXPIRY)) {
    console.info('Using cached vibes data');
    return cached.vibes;
  }
  
  // Otherwise fetch from Supabase with optimized query
  try {
    const { data, error } = await supabase
      .from("generated_vibes")
      .select("id, name, description, layout, colors, fonts, radius_settings, shadow_settings, spacing_settings, animation_settings, created_at")
      .order("created_at", { ascending: false })
      .limit(20); // Limit to 20 most recent vibes for better performance

    if (error) throw error;
    
    const vibes = data ? data.map(mapDbVibeToVibeSettings) : [];
    
    // Cache the results
    cacheVibes(vibes);
    
    return vibes;
  } catch (error) {
    console.error("Error fetching AI vibes:", error);
    
    // If fetch fails but we have cached data (even if expired), use it as fallback
    if (cached && cached.vibes) {
      console.info('Using expired cached vibes as fallback');
      return cached.vibes;
    }
    
    return [];
  }
};

// Generate a new vibe using the Edge Function with optimized error handling
export const generateNewVibe = async (theme?: string, mood?: string): Promise<VibeSettings | null> => {
  try {
    // Show optimistic UI feedback immediately
    const toastId = toast({
      title: "Generating new vibe...",
      description: theme || mood ? 
        `Creating a custom ${theme || ''} ${theme && mood ? ' & ' : ''}${mood || ''} vibe` : 
        "Creating a random vibe"
    });
    
    // Set a timeout to handle slow connections
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => reject(new Error("Vibe generation timed out")), 15000);
    });
    
    // Actual request
    const responsePromise = supabase.functions.invoke("generate-vibe", {
      body: { theme, mood },
    });
    
    // Race between timeout and response
    const response = await Promise.race([responsePromise, timeoutPromise]) as any;

    if (response?.error) {
      console.error("Edge function error:", response.error);
      throw new Error(response.error.message || "Edge function error");
    }
    
    if (!response?.data?.vibe) {
      console.error("No vibe data returned:", response?.data);
      throw new Error("No vibe data returned from the API");
    }

    return response.data.vibe as VibeSettings;
  } catch (error: any) {
    console.error("Error generating vibe:", error);
    
    // Create a fallback vibe with deterministic behavior
    const randomVibe = getRandomVibePreset();
    const localVibe: VibeSettings = {
      ...randomVibe,
      id: `local-${Date.now()}`,
      name: theme ? `${theme.charAt(0).toUpperCase() + theme.slice(1)} Vibe` : 
             mood ? `${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibe` : 
             'Fallback Vibe',
      description: `A locally generated vibe${theme ? ' with ' + theme + ' theme' : ''}${
        theme && mood ? ' and ' : (mood ? ' with ' : '')
      }${mood ? mood + ' mood' : ''}.`,
    };
    
    toast({
      title: "Using locally generated vibe",
      description: "The edge function is unavailable, so we created a local vibe instead",
    });
    
    return localVibe;
  }
};
