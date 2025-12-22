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

export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createServerClient();

    // Fetch sets from aska_content_sets where set_attribution = 'Captain Heart'
    const { data, error } = await supabase
      .from("aska_content_sets")
      .select("*")
      .eq("set_attribution", "Captain Heart")
      .order("set_created_at", { ascending: false });

    if (error) {
      console.error("❌ [Captain Heart Sets API] Database error:", error);
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

    return NextResponse.json({
      success: true,
      data: data as ContentSet[],
    });
  } catch (error) {
    console.error("💥 [Captain Heart Sets API] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
