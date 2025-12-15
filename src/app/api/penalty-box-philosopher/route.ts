import { createServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface WisdomItem {
  id: number;
  quote: string;
  theme: string | null;
  category: string | null;
  attribution: string | null;
  author?: string | null;
  [key: string]: unknown;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const theme = searchParams.get("theme");

  try {
    console.log("🔍 [Penalty Box Philosopher API] Starting request...");

    const supabase = await createServerClient();
    console.log("✅ [Penalty Box Philosopher API] Supabase client created");

    // Handle theme request - fetch from collection_hockey_wisdom
    if (theme) {
      console.log(`📋 [Penalty Box Philosopher API] Fetching theme: ${theme}`);

      const { data, error } = await supabase
        .from("collection_hockey_wisdom")
        .select("*")
        .eq("theme", theme)
        .limit(12);

      if (error) {
        console.error(
          "❌ [Penalty Box Philosopher API] Database error:",
          error,
        );
        const errorMessage =
          error && typeof error === "object" && "message" in error
            ? String(error.message)
            : "Database error occurred";
        return NextResponse.json(
          {
            success: false,
            error: errorMessage,
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        data: (data as WisdomItem[]) || [],
        type: "theme",
      });
    }

    // Default: Query 8 random records from collection_hockey_wisdom for Daily Set
    console.log(
      "📊 [Penalty Box Philosopher API] Querying random Daily Set from collection_hockey_wisdom...",
    );

    // Fetch more records than needed, then randomize and limit to 8
    const { data, error } = await supabase
      .from("collection_hockey_wisdom")
      .select("*")
      .limit(100); // Fetch more to ensure good randomization

    if (error) {
      console.error("❌ [Penalty Box Philosopher API] Database error:", error);
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Database error occurred";
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          errorDetails: error,
          debug: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      console.warn("⚠️ [Penalty Box Philosopher API] No data returned");
      return NextResponse.json(
        {
          success: false,
          error: "No wisdom items found",
          debug: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 },
      );
    }

    // Randomize and limit to 8 records
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    const displayItems = shuffled.slice(0, 8);

    console.log(
      `✅ [Penalty Box Philosopher API] Successfully retrieved ${displayItems.length} random wisdom items from ${data.length} total`,
    );

    return NextResponse.json({
      success: true,
      data: displayItems,
      type: "daily",
      debug: {
        totalAvailable: data.length,
        displayed: displayItems.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("💥 [Penalty Box Philosopher API] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        debug: {
          errorType:
            error instanceof Error ? error.constructor.name : typeof error,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    );
  }
}
