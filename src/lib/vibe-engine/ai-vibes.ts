
import { supabase } from "@/integrations/supabase/client";
import { VibeSettings } from "./types";
import { toast } from "@/components/ui/use-toast";

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

    return data.map(mapDbVibeToVibeSettings);
  } catch (error) {
    console.error("Error fetching AI vibes:", error);
    return [];
  }
};

// Generate a new vibe using the Edge Function
export const generateNewVibe = async (theme?: string, mood?: string): Promise<VibeSettings | null> => {
  try {
    toast({
      title: "Generating new vibe...",
      description: "This might take a moment",
    });

    const response = await supabase.functions.invoke("generate-vibe", {
      body: { theme, mood },
    });

    if (response.error) throw new Error(response.error.message);
    
    toast({
      title: "New vibe generated!",
      description: `${response.data.vibe.name} is ready to use`,
    });

    return response.data.vibe;
  } catch (error) {
    console.error("Error generating vibe:", error);
    toast({
      title: "Vibe generation failed",
      description: "Couldn't create a new vibe. Please try again.",
      variant: "destructive"
    });
    return null;
  }
};
