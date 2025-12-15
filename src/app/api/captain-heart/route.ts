import { createServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface MotivationalRecord {
  id: number;
  items: unknown;
  status: string;
  created_at: string;
  updated_at: string;
}

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

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");

  try {
    console.log("🔍 [Captain Heart API] Starting request...");

    const supabase = await createServerClient();
    console.log("✅ [Captain Heart API] Supabase client created");

    // Handle category request - fetch from collection_hockey_motivate
    if (category) {
      console.log(`📋 [Captain Heart API] Fetching category: ${category}`);

      // Map frontend category name to database category name
      // Frontend displays "I'm proud" but database stores "Im Proud"
      // Frontend displays "Good Luck" but database stores "Good Luck" (same)
      const dbCategory = category === "I'm proud" ? "Im Proud" : category;

      const { data, error } = await supabase
        .from("collection_hockey_motivate")
        .select("*")
        .eq("attribution", "Captain Heart")
        .eq("category", dbCategory)
        .limit(12);

      if (error) {
        console.error("❌ [Captain Heart API] Database error:", error);
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

    // Default: Query latest published Daily Set from pub_shareables_motivational
    console.log(
      "📊 [Captain Heart API] Querying latest Daily Set from pub_shareables_motivational...",
    );

    const { data, error, status, statusText } = (await supabase
      .from("pub_shareables_motivational")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()) as {
      data: MotivationalRecord | null;
      error: unknown;
      status: number;
      statusText: string;
    };

    console.log("📥 [Captain Heart API] Query response received:");
    console.log("   - Status:", status);
    console.log("   - Status Text:", statusText);
    console.log("   - Error:", error);

    if (error) {
      console.error("❌ [Captain Heart API] Database error:", error);
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
            status,
            statusText,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 500 },
      );
    }

    if (!data) {
      console.warn("⚠️ [Captain Heart API] No data returned");
      return NextResponse.json(
        {
          success: false,
          error: "No record found",
          debug: {
            status,
            statusText,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 },
      );
    }

    // Parse items array and limit to 12
    const allItems = Array.isArray(data.items) ? data.items : [];
    const displayItems = allItems.slice(0, 12);

    console.log(
      `✅ [Captain Heart API] Successfully retrieved Daily Set: ${(data as MotivationalRecord).id}, displaying ${displayItems.length} items`,
    );

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        items: displayItems,
      },
      type: "daily",
      debug: {
        status,
        statusText,
        recordCount: 1,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("💥 [Captain Heart API] Unexpected error:", error);
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
