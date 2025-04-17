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

export async function POST(request: NextRequest) {
  try {
    const { theme, mood } = await request.json();

    console.info("API Route: Invoking Supabase Edge Function 'generate-vibe'");
    console.info(`API Route: Theme: ${theme}, Mood: ${mood}`);

    // Set a timeout for the function invocation
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Vibe generation timed out (API Route)")), 35000); // Slightly longer timeout
    });

    // Actual request to the Supabase Edge Function
    const functionPromise = supabase.functions.invoke("generate-vibe", {
      body: { theme, mood },
    });

    // Race between timeout and response
    // Cast to any for now to bypass potential type issues with status, similar to original client code
    const { data, error } = await Promise.race([functionPromise, timeoutPromise]) as any; 

    console.info("API Route: Received response from edge function");

    if (error) {
      console.error("API Route: Edge function error:", error);
      // Attempt to get status from error context, default to 500
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
        { status: 500 } // Internal Server Error if data format is wrong
      );
    }

    console.info("API Route: Successfully generated vibe:", data.vibe.name);
    // Return the generated vibe data
    return NextResponse.json({ vibe: data.vibe }, { status: 200 });

  } catch (error: any) {
    console.error("API Route: Error generating vibe:", error);
    // Differentiate between timeout error and other errors
    const errorMessage = error.message?.includes("timed out")
      ? "Vibe generation timed out."
      : "An unexpected error occurred.";
    const status = error.message?.includes("timed out") ? 504 : 500; // Gateway Timeout or Internal Server Error

    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: status }
    );
  }
}

// Optional: Add edge runtime if needed, but default Node.js runtime is fine for this.
// export const runtime = 'edge'; 