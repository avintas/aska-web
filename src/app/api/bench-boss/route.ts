import { createServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface CollectionItem {
  id: number;
  quote: string;
  theme: string | null;
  category: string | null;
  attribution: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

// In-memory cache for daily random sets
// Key: "bench-boss-daily-YYYY-MM-DD"
// Value: { items: CollectionItem[], cachedAt: Date }
const dailyCache = new Map<
  string,
  { items: CollectionItem[]; cachedAt: Date }
>();

// Helper function to get today's date string (YYYY-MM-DD)
function getTodayKey(): string {
  const today = new Date();
  return `bench-boss-daily-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

// Helper function to shuffle array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");

  try {
    console.log("🔍 [Bench Boss API] Starting request...");

    const supabase = await createServerClient();
    console.log("✅ [Bench Boss API] Supabase client created");

    // Handle category request - fetch from collection_hockey_motivate
    if (category) {
      console.log(`📋 [Bench Boss API] Fetching category: ${category}`);

      const { data, error } = await supabase
        .from("collection_hockey_motivate")
        .select("*")
        .eq("attribution", "Bench Boss")
        .eq("category", category)
        .limit(12);

      if (error) {
        console.error("❌ [Bench Boss API] Database error:", error);
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
        data: (data as CollectionItem[]) || [],
        type: "category",
      });
    }

    // Default: Get daily random set from collection_hockey_motivate
    const cacheKey = getTodayKey();
    console.log(
      `📊 [Bench Boss API] Checking cache for today's set: ${cacheKey}`,
    );

    // Check if we have today's set cached
    const cached = dailyCache.get(cacheKey);
    if (cached) {
      console.log(
        `✅ [Bench Boss API] Returning cached daily set (${cached.items.length} items)`,
      );
      return NextResponse.json({
        success: true,
        data: cached.items,
        type: "daily",
        cached: true,
      });
    }

    // Cache miss - generate new random set
    console.log(
      "🔄 [Bench Boss API] Cache miss - generating new random daily set...",
    );

    // Fetch all Bench Boss items from collection
    const { data, error } = await supabase
      .from("collection_hockey_motivate")
      .select("*")
      .eq("attribution", "Bench Boss");

    if (error) {
      console.error("❌ [Bench Boss API] Database error:", error);
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

    if (!data || data.length === 0) {
      console.warn("⚠️ [Bench Boss API] No Bench Boss items found");
      return NextResponse.json(
        {
          success: false,
          error: "No Bench Boss items available",
        },
        { status: 404 },
      );
    }

    // Shuffle and select 12 random items
    const shuffled = shuffleArray(data as CollectionItem[]);
    const random12 = shuffled.slice(0, 12);

    // Cache the result for today
    dailyCache.set(cacheKey, {
      items: random12,
      cachedAt: new Date(),
    });

    // Clean up old cache entries (keep only last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    for (const [key, value] of dailyCache.entries()) {
      if (value.cachedAt < sevenDaysAgo) {
        dailyCache.delete(key);
      }
    }

    console.log(
      `✅ [Bench Boss API] Generated and cached new daily set: ${random12.length} items from ${data.length} total`,
    );

    return NextResponse.json({
      success: true,
      data: random12,
      type: "daily",
      cached: false,
      debug: {
        totalAvailable: data.length,
        selected: random12.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("💥 [Bench Boss API] Unexpected error:", error);
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
