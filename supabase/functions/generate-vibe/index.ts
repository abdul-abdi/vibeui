// Import necessary modules
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { v4 as uuid } from "https://esm.sh/uuid@9.0.0"; // Keep for potential fallback or if Gemini doesn't generate it

// --- Define Types (Keep existing types for reference/validation) ---
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
  easing: number[];
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


// CORS headers (keep as is)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Adjust for production if needed
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, Origin, X-Requested-With, Accept",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Credentials": "true"
};

// --- NEW: Helper to get JSON instructions ---
const getJsonOutputInstructions = (): string => {
  // Reusable instructions for Gemini to output JSON
  return `
The output MUST be a valid JSON object matching the following TypeScript type structure:

type VibeLayout = 'standard' | 'asymmetric' | 'centered' | 'sidebar';
type ColorTheme = { background: string; foreground: string; card: string; cardForeground: string; primary: string; primaryForeground: string; secondary: string; secondaryForeground: string; muted: string; mutedForeground: string; accent: string; accentForeground: string; destructive: string; destructiveForeground: string; border: string; input: string; ring: string; }; // All HSL strings 'H S% L%'
type FontPairing = { primary: string; secondary: string; accent: string; mono: string; }; // All CSS font-family strings
type RadiusScale = { sm: string; md: string; lg: string; }; // All CSS size values
type SpacingScale = { layoutSpacing: string; cardSpacing: string; elementSpacing: string; }; // All CSS size values
type AnimationSettings = { speed: number; easing: [number, number, number, number]; entrance: string; hover: string; };
type ShadowSettings = { sm: string; md: string; lg: string; }; // All CSS box-shadow values
type VibeSettings = { id: string; name: string; description: string; layout: VibeLayout; colors: ColorTheme; fonts: FontPairing; radius: RadiusScale; spacing: SpacingScale; animation: AnimationSettings; shadows: ShadowSettings; };

Key Constraints:
- Generate a unique UUID v4 for the 'id'.
- Create a 'name' and 'description' that reflect the core theme/mood.
- Ensure color pairs have good contrast. Determine light/dark mode from background L%.
- Select appropriate fonts, spacing, radius, animations, and shadows based on the overall vibe described.
- Provide ONLY the JSON object conforming to the VibeSettings type as the response. Do not include any introductory text, code block markers (\`\`\`json), explanations, or comments.
`;
}

// Function to generate a vibe using the Gemini API
// MODIFIED: Accepts body which might contain 'prompt' or 'theme'/'mood'
async function generateVibeWithGemini(body: { prompt?: string, theme?: string, mood?: string }): Promise<VibeSettings> {
  const apiKey = Deno.env.get("GOOGLE_AI_API_KEY"); // Corrected Secret Name
  if (!apiKey) {
    console.error("GOOGLE_AI_API_KEY environment variable not set.");
    throw new Error("API key configuration error.");
  }

  // Use the latest flash model for speed and cost-effectiveness
  const model = "gemini-1.5-flash-latest";
  const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let generationPrompt: string;

  // --- Construct the prompt for Gemini ---
  // MODIFIED: Check for direct prompt first
  if (body.prompt && typeof body.prompt === 'string' && body.prompt.trim() !== '') {
    // Mode 1: Use the direct prompt from the API route (Advanced Mode)
    console.info("Edge Function: Using direct prompt received from API route.");
    generationPrompt = body.prompt + "\n\n" + getJsonOutputInstructions(); // Append JSON instructions

  } else if (body.theme && typeof body.theme === 'string' && body.theme.trim() !== '' &&
             body.mood && typeof body.mood === 'string' && body.mood.trim() !== '') {
    // Mode 2: Construct prompt from theme and mood keywords (Basic/Random Mode)
    console.info(`Edge Function: Constructing prompt from theme='${body.theme}', mood='${body.mood}'.`);
    generationPrompt = `Generate a UI theme 'vibe' based on the theme "${body.theme}" and mood "${body.mood}".\n\n${getJsonOutputInstructions()}`;

  } else {
      // Should ideally not happen due to API route validation/random fallback, but handle defensively
      console.error("Edge Function: Invalid input received - missing prompt or theme/mood.");
      throw new Error("Invalid input: requires either 'prompt' or both 'theme' and 'mood'.");
  }

  // Prepare the request body for Gemini API
  const requestBody = {
    contents: [{
      parts: [{
        text: generationPrompt // Use the constructed prompt
      }]
    }],
    // Ensure Gemini responds with JSON
    generationConfig: {
        "response_mime_type": "application/json",
    }
    // Optional: Add safety settings if needed
    // safetySettings: [ ... ],
  };

  console.log(`Edge Function: Sending request to Gemini API (model: ${model})`);

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Gemini API error: ${response.status} ${response.statusText}`, errorBody);
      let detailedError = errorBody;
      try {
        detailedError = JSON.parse(errorBody)?.error?.message || errorBody;
      } catch (_) { /* Ignore parsing error */ }
      throw new Error(`Gemini API request failed: ${response.statusText}. Details: ${detailedError}`);
    }

    const geminiResponse = await response.json();
    const generatedText = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error("Gemini response did not contain generated text:", JSON.stringify(geminiResponse, null, 2));
      throw new Error("Failed to extract content from Gemini response.");
    }

    const cleanedText = generatedText.replace(/^```json\s*|```\s*$/g, '').trim();

    try {
      const vibeData = JSON.parse(cleanedText);
      console.log("Successfully parsed vibe data from Gemini.");

      // Basic Validation
      if (!vibeData || typeof vibeData !== 'object') {
        throw new Error("Parsed data is not a valid object.");
      }
      if (!vibeData.name || typeof vibeData.name !== 'string') {
         console.warn("Gemini response missing/invalid 'name'.");
         // MODIFIED: Better fallback name generation
         vibeData.name = body.prompt ? "Advanced Vibe" : `${body.theme || 'Unknown'} ${body.mood || 'Vibe'}`;
      }
       if (!vibeData.description || typeof vibeData.description !== 'string') {
         console.warn("Gemini response missing/invalid 'description'.");
         vibeData.description = `Generated vibe.`; // Simple default
      }
      // Ensure an ID exists, generate locally if Gemini failed to include one or it's invalid
      if (!vibeData.id || typeof vibeData.id !== 'string' || vibeData.id.length < 10) { // Basic check
        console.warn("Gemini response missing or invalid ID, generating one locally.");
        vibeData.id = uuid();
      }

      // Return the validated (and potentially fixed) data, asserting the type
      return vibeData as VibeSettings;

    } catch (parseError: any) {
      console.error("Failed to parse JSON response from Gemini:", parseError);
      console.error("Raw Gemini text:", cleanedText);
      throw new Error(`Invalid JSON response received from Gemini: ${parseError.message}`);
    }

  } catch (error) {
    console.error("Error calling or processing Gemini API response:", error);
    // Add more specific error context if possible
    if (error instanceof Error && error.message.includes("API key not valid")) {
       throw new Error("Invalid Google AI API Key. Please check the GOOGLE_AI_API_KEY secret in Supabase.");
    }
    // Re-throw the original or a wrapped error
    throw error instanceof Error ? error : new Error(String(error));
  }
}

// Main serve function for the edge function
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Basic checks (POST, Content-Type)
    if (req.method !== "POST") {
      console.warn(`Edge Function: Received non-POST request: ${req.method}`);
      return new Response(JSON.stringify({ success: false, error: "Method Not Allowed" }), {
        status: 405, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (!req.body) {
      console.warn("Edge Function: Received POST request with no body.");
      return new Response(JSON.stringify({ success: false, error: "Request body required" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (!req.headers.get("content-type")?.includes("application/json")) {
      console.warn(`Edge Function: Received POST with invalid content-type: ${req.headers.get("content-type")}`);
      return new Response(JSON.stringify({ success: false, error: "Invalid Content-Type, expected application/json" }), {
          status: 415, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Parse the request body (expecting {prompt} or {theme, mood})
    let requestBody: { prompt?: string, theme?: string, mood?: string } = {};
    try {
        requestBody = await req.json();
    } catch (e: any) {
         console.error("Edge Function: Failed to parse request JSON body:", e);
         return new Response(JSON.stringify({ success: false, error: "Invalid JSON body." }), {
           status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
         });
    }

    // Validate input (either prompt or theme/mood must be valid based on the logic in generateVibeWithGemini)
     if (!(requestBody.prompt && typeof requestBody.prompt === 'string' && requestBody.prompt.trim() !== '') &&
         !(requestBody.theme && typeof requestBody.theme === 'string' && requestBody.theme.trim() !== '' &&
           requestBody.mood && typeof requestBody.mood === 'string' && requestBody.mood.trim() !== '')) {
         // This validation ensures the API route sent *something* usable
         console.warn("Edge Function: Invalid input from API route - requires 'prompt' or both 'theme' and 'mood'. Body:", requestBody);
         return new Response(JSON.stringify({ success: false, error: "Invalid input received from API route." }), {
             status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
         });
     }

    console.log(`Edge Function: Processing request... Body keys: ${Object.keys(requestBody).join(', ')}`);

    // Generate the vibe using the Gemini API with the received body
    const vibe = await generateVibeWithGemini(requestBody);

    // Return the generated vibe
    console.log(`Edge Function: Successfully generated vibe with ID: ${vibe.id}`);
    return new Response(JSON.stringify({
      success: true,
      vibe,
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    // Log and return any errors
    console.error("Error in generate-vibe Edge Function:", error);
    // Provide a user-friendly error message
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during vibe generation.";
    // Determine status code based on error type
    const statusCode = error.message?.includes("API key") ? 401 
                     : (error.message?.includes("Invalid input") ? 400 : 500);

    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
    }), {
      status: statusCode, // Internal Server Error or specific code
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
});

console.log("Generate Vibe Edge Function (supporting prompt/keywords) started and ready.");

