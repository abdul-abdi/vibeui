
import { supabase } from "@/integrations/supabase/client";
import { VibeSettings } from "./types";
import { toast } from "@/hooks/use-toast";
import { getRandomVibePreset } from "./vibe-presets";

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

// Fetch all AI-generated vibes from Supabase
export const fetchAiVibes = async (): Promise<VibeSettings[]> => {
  try {
    const { data, error } = await supabase
      .from("generated_vibes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data ? data.map(mapDbVibeToVibeSettings) : [];
  } catch (error) {
    console.error("Error fetching AI vibes:", error);
    return [];
  }
};

// Generate a new vibe using the Edge Function
export const generateNewVibe = async (theme?: string, mood?: string): Promise<VibeSettings | null> => {
  try {
    const response = await supabase.functions.invoke("generate-vibe", {
      body: { theme, mood },
      // Remove the timeout property as it's not supported in the FunctionInvokeOptions type
    });

    if (response.error) {
      console.error("Edge function error:", response.error);
      throw new Error(response.error.message || "Edge function error");
    }
    
    if (!response.data?.vibe) {
      console.error("No vibe data returned:", response.data);
      throw new Error("No vibe data returned from the API");
    }

    return response.data.vibe as VibeSettings;
  } catch (error: any) {
    console.error("Error generating vibe:", error);
    
    // If the Edge Function fails, let's create a fallback vibe
    if (Math.random() > 0.5) {
      // In some cases, just propagate the error to show the error message
      throw error;
    }
    
    // In other cases, create a fallback local vibe with the theme/mood
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
