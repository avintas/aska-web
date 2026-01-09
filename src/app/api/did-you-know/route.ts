import { createServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// In-memory cache for factoid sets
// Key: setId
// Value: { items: FactItem[], setInfo: SetInfo, cachedAt: Date }
const setCache = new Map<
  number,
  {
    items: FactItem[];
    setInfo: {
      id: number;
      title: string;
      summary: string | null;
      theme: string | null;
      category: string | null;
    };
    cachedAt: Date;
  }
>();

interface FactItem {
  id?: number;
  content?: string;
  fact_text?: string;
  category?: string | null;
  fact_category?: string | null;
  theme?: string | null;
  year?: number | null;
  fact_value?: string | null;
  [key: string]: unknown;
}

interface SourceContentSet {
  id: number;
  app_id: number;
  set_title: string;
  set_summary: string | null;
  set_items: FactItem[];
  set_type: string[] | null;
  set_theme: string | null;
  set_category: string | null;
  set_difficulty: string | null;
  set_attribution: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    console.log("🔍 [Did You Know API] Starting request...");

    const supabase = await createServerClient();
    console.log("✅ [Did You Know API] Supabase client created");

    // Fetch factoid sets from source_content_sets
    console.log(
      "📊 [Did You Know API] Querying factoid sets from source_content_sets...",
    );

    const { data, error } = await supabase
      .from("source_content_sets")
      .select("*")
      .eq("app_id", 1)
      .eq("active", true)
      .contains("set_type", ["factoid"])
      .order("set_created_at", { ascending: false })
      .limit(1); // Get the latest active set

    if (error) {
      console.error("❌ [Did You Know API] Database error:", error);
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
      console.warn("⚠️ [Did You Know API] No factoid sets found");
      return NextResponse.json(
        {
          success: false,
          error: "No factoid sets found",
          debug: {
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 },
      );
    }

    const set = data[0] as SourceContentSet;

    // Check cache first
    const cached = setCache.get(set.id);
    if (cached) {
      console.log(
        `✅ [Did You Know API] Returning cached set ${set.id} (${cached.items.length} items)`,
      );
      return NextResponse.json({
        success: true,
        data: cached.items,
        setInfo: cached.setInfo,
        type: "set",
        cached: true,
        debug: {
          setId: set.id,
          totalItems: cached.items.length,
          cachedAt: cached.cachedAt.toISOString(),
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Cache miss - process set
    console.log(
      `🔄 [Did You Know API] Cache miss - processing set ${set.id}...`,
    );

    const setItems = (set.set_items || []) as FactItem[];

    // Normalize factoid items - handle both 'content' and 'fact_text' fields
    const normalizedItems: FactItem[] = setItems.map((item) => {
      // If item has 'content' field (from prompt), use it as 'fact_text'
      if (item.content && !item.fact_text) {
        return {
          ...item,
          fact_text: item.content,
          fact_category: item.category || item.fact_category || null,
        };
      }
      return item;
    });

    // We need exactly 70 factoids (14 per slide × 5 slides)
    // Take first 70, or pad/cycle if we have fewer
    const requiredCount = 70;
    let displayItems: FactItem[] = [];

    if (normalizedItems.length >= requiredCount) {
      // Take exactly 70 factoids
      displayItems = normalizedItems.slice(0, requiredCount);
    } else {
      // If we have fewer than 70, cycle through them to fill 70 slots
      displayItems = [];
      for (let i = 0; i < requiredCount; i++) {
        displayItems.push(normalizedItems[i % normalizedItems.length]);
      }
      console.warn(
        `⚠️ [Did You Know API] Only ${normalizedItems.length} factoids available, cycling to fill 70 slots`,
      );
    }

    const setInfoData = {
      id: set.id,
      title: set.set_title,
      summary: set.set_summary,
      theme: set.set_theme,
      category: set.set_category,
    };

    // Cache the result
    setCache.set(set.id, {
      items: displayItems,
      setInfo: setInfoData,
      cachedAt: new Date(),
    });

    // Clean up old cache entries (keep only last 10 sets)
    if (setCache.size > 10) {
      const entries = Array.from(setCache.entries());
      entries.sort((a, b) => a[1].cachedAt.getTime() - b[1].cachedAt.getTime());
      // Remove oldest entries
      for (let i = 0; i < entries.length - 10; i++) {
        setCache.delete(entries[i][0]);
      }
    }

    console.log(
      `✅ [Did You Know API] Successfully processed and cached set ${set.id}: ${displayItems.length} factoids (${normalizedItems.length} unique)`,
    );

    return NextResponse.json({
      success: true,
      data: displayItems,
      setInfo: setInfoData,
      type: "set",
      cached: false,
      debug: {
        setId: set.id,
        totalItems: displayItems.length,
        uniqueItems: normalizedItems.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("💥 [Did You Know API] Unexpected error:", error);
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
