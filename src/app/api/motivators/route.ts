import { createServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface ContentSet {
  id: number;
  app_id: number;
  set_title: string;
  set_summary: string | null;
  set_items: Array<{ id: number; quote: string }>;
  set_type: string[] | null;
  set_theme: string | null;
  set_category: string | null;
  set_difficulty: string | null;
  set_parent: number | null;
  set_created_at: string;
  set_updated_at: string;
  set_attribution: string | null;
}

interface MotivatorItem {
  id: number;
  quote: string;
  set_id: number;
  set_title: string;
  set_attribution: string | null;
  set_category: string | null;
  set_theme: string | null;
}

export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createServerClient();

    // Fetch all sets from aska_content_sets (all personas mixed)
    const { data, error } = await supabase
      .from("aska_content_sets")
      .select("*")
      .order("set_created_at", { ascending: false });

    if (error) {
      console.error("❌ [Motivators API] Database error:", error);
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
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Flatten all set_items from all sets into a single array
    const allItems: MotivatorItem[] = [];
    (data as ContentSet[]).forEach((set) => {
      if (set.set_items && Array.isArray(set.set_items)) {
        set.set_items.forEach((item) => {
          allItems.push({
            id: item.id,
            quote: item.quote,
            set_id: set.id,
            set_title: set.set_title,
            set_attribution: set.set_attribution,
            set_category: set.set_category,
            set_theme: set.set_theme,
          });
        });
      }
    });

    return NextResponse.json({
      success: true,
      data: allItems,
      totalSets: data.length,
      totalItems: allItems.length,
    });
  } catch (error) {
    console.error("💥 [Motivators API] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
