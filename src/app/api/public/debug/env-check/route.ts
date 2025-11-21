import { NextResponse } from "next/server";

/**
 * Debug endpoint to check if environment variables are set
 * Does NOT expose actual values for security
 */
export async function GET(): Promise<NextResponse> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return NextResponse.json({
    success: true,
    env: {
      hasSupabaseUrl: !!supabaseUrl,
      supabaseUrlLength: supabaseUrl?.length || 0,
      hasSupabaseKey: !!supabaseKey,
      supabaseKeyLength: supabaseKey?.length || 0,
      supabaseUrlStartsWith: supabaseUrl?.substring(0, 20) || "NOT SET",
    },
  });
}
