import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/integrations/supabase/types'; // Assuming types are generated

// Ensure environment variables are defined
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create a Supabase client for Route Handler context
// Note: For server-side operations that require user authentication context,
// you might need a different client setup using the service_role key or user's access token.
// For invoking an Edge Function with anon key, this should suffice.
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Helper for random selection ---
const randomItem = <T>(items: T[]): T => {
  if (!items || items.length === 0) {
    // Provide a default or throw an error if the array is empty
    return null as T; // Or handle appropriately
  }
  return items[Math.floor(Math.random() * items.length)];
};

// --- Theme and Mood Options for Random Generation ---
const themeWords = [
    "Neon", "Ocean", "Forest", "Desert", "Space", "Cyber", "Retro", "Futuristic",
    "Vintage", "Modern", "Minimal", "Vibrant", "Pastel", "Dark", "Light", "Muted",
    "Electric", "Organic", "Crystal", "Metallic", "Dreamy", "Sharp", "Soft", "Bold",
    "Industrial", "Tropical", "Arctic", "Steampunk", "Solarpunk", "Grunge",
    "Candy", "Nature", "Urban", "Mystic", "Gothic", "Sakura",
];

const moodWords = [
    "Calm", "Energetic", "Playful", "Serious", "Elegant", "Quirky", "Professional",
    "Creative", "Relaxed", "Dynamic", "Peaceful", "Exciting", "Cheerful", "Mysterious",
    "Warm", "Cool", "Fresh", "Intense", "Subtle", "Powerful", "Gentle", "Bold",
    "Hopeful", "Melancholic", "Focused", "Whimsical", "Serene", "Dramatic",
    "Cozy", "Nostalgic", "Optimistic", "Contemplative", "Romantic",
];

export async function POST(request: NextRequest) {
  // Initialize requestData to null
  let requestData: { prompt: string } | { theme: string; mood: string } | null = null;
  let mode: 'prompt' | 'keywords' | 'random' = 'random'; // Default to random

  try {
    // --- Determine Input Mode ---
    let body: any = null;
    try {
      body = await request.json();
    } catch (e: any) { // Explicitly type the error object
        console.warn("API Route: Could not parse JSON body or body was empty. Assuming random generation.");
        // Keep mode as 'random'
    }

    if (body && typeof body === 'object') {
        // Scenario 1: Advanced Prompt Provided
        if (body.prompt && typeof body.prompt === 'string' && body.prompt.trim() !== '') {
            requestData = { prompt: body.prompt.trim() };
            mode = 'prompt';
            console.info(`API Route: Using direct prompt from request body.`);
        }
        // Scenario 2: Basic Theme/Mood Provided
        else if (body.theme && typeof body.theme === 'string' && body.theme.trim() !== '' &&
                 body.mood && typeof body.mood === 'string' && body.mood.trim() !== '')
        {
            // Ensure requestData is typed correctly for this branch
            const theme = body.theme.trim();
            const mood = body.mood.trim();
            requestData = { theme, mood };
            mode = 'keywords';
            console.info(`API Route: Using theme="${theme}", mood="${mood}" from request body.`);
        }
    }

    // Scenario 3: Fallback to Random Generation
    if (mode === 'random') {
        const randomTheme = randomItem(themeWords);
        const randomMood = randomItem(moodWords);
        if (!randomTheme || !randomMood) {
             console.error("API Route: Failed to select random theme/mood.");
             return NextResponse.json(
                 { error: "Failed to generate random theme/mood parameters." },
                 { status: 500 }
             );
         }
        // Ensure requestData is typed correctly for this branch
        requestData = { theme: randomTheme, mood: randomMood }; 
        console.info(`API Route: Generated random theme="${randomTheme}", mood="${randomMood}".`);
    }

    // --- Invoke Supabase Edge Function ---
    // Add null check before invoking
    if (!requestData) {
       console.error("API Route: Internal error - requestData was not assigned.");
       return NextResponse.json(
           { error: "Internal server error preparing generation request." },
           { status: 500 }
       );
    }

    console.info(`API Route: Invoking Supabase Edge Function 'generate-vibe' (mode: ${mode})...`);

    // Set a timeout for the function invocation
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Vibe generation timed out (API Route)")), 35000); // Slightly longer timeout
    });

    // Actual request to the Supabase Edge Function - send the determined data
    const functionPromise = supabase.functions.invoke("generate-vibe", {
      body: requestData, // Pass the structured data based on mode
    });

    // Race between timeout and response
    const { data, error } = await Promise.race([functionPromise, timeoutPromise]) as any;

    console.info("API Route: Received response from edge function");

    if (error) {
      console.error("API Route: Edge function error:", error);
      const status = error.context?.status || 500;
      return NextResponse.json(
        { error: error.message || "Edge function failed" },
        { status: status }
      );
    }

    if (!data?.vibe) {
      console.error("API Route: No vibe data returned:", JSON.stringify(data));
      return NextResponse.json(
        { error: "No vibe data returned from the edge function" },
        { status: 500 }
      );
    }

    console.info("API Route: Successfully generated vibe:", data.vibe.name);
    return NextResponse.json({ vibe: data.vibe }, { status: 200 });

  } catch (error: any) {
    console.error("API Route: Error generating vibe:", error);
    const errorMessage = error.message?.includes("timed out")
      ? "Vibe generation timed out."
      : "An unexpected error occurred.";
    const status = error.message?.includes("timed out") ? 504 : 500;

    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: status }
    );
  }
}

// Optional: Add edge runtime if needed, but default Node.js runtime is fine for this.
// export const runtime = 'edge'; 