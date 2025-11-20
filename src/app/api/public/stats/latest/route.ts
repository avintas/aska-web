import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createServerClient();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    const { data, error } = await supabase
      .from("collection_stats")
      .select(
        "id, stat_text, stat_value, stat_category, year, theme, attribution",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(Math.min(limit, 100)); // Max 100 items

    if (error) {
      console.error("Error fetching stats:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch stats" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, data: data || [] },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
