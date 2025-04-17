import { VibeSettings } from "./types";
import { toast } from "@/hooks/use-toast";

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
    // This still uses the client-side Supabase client, which is fine for reads
    // If needed, this could also be moved to an API route
    const { data, error } = await (await import("@/integrations/supabase/client")).supabase
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

// Generate a new vibe by calling the Next.js API route
export const generateNewVibe = async (theme?: string, mood?: string): Promise<VibeSettings | null> => {
  // Show optimistic UI feedback immediately and store the toast controls
  const toastControls = toast({
    title: "Generating new vibe...",
    description: theme || mood ? 
      `Creating a custom ${theme || ''} ${theme && mood ? ' & ' : ''}${mood || ''} vibe` : 
      "Creating a random vibe"
  });
  
  try {
    console.info("Calling API route: /api/generate-vibe");
    const response = await fetch('/api/generate-vibe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme, mood }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("API Error:", result);
      throw new Error(result.error || `API request failed with status ${response.status}`);
    }

    if (!result?.vibe) {
        console.error("Invalid data structure returned from API:", result);
        throw new Error("Invalid data received from API");
    }

    console.info("Successfully generated vibe via API:", result.vibe.name);
    
    // Update toast on success using the update function
    toastControls.update({
      id: toastControls.id, // Required to identify the toast to update
      title: "Vibe Generated!",
      description: `Successfully created the ${result.vibe.name} vibe.`,
      // variant: "success", // Assuming no success variant, remove or use default
    });

    return result.vibe as VibeSettings;

  } catch (error: any) {
    console.error("Error generating vibe via API:", error);
    
    // Update toast on failure using the update function
    toastControls.update({ 
      id: toastControls.id, // Required to identify the toast to update
      title: "Vibe Generation Failed",
      description: error.message || "Could not generate vibe. Please try again.",
      variant: "destructive",
    });
    
    return null; // Return null instead of a fallback vibe
  }
};
