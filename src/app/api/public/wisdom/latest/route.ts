import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    let supabase;
    try {
      supabase = await createServerClient();
    } catch (clientError) {
      console.error("Failed to create Supabase client:", clientError);
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details:
            clientError instanceof Error
              ? clientError.message
              : String(clientError),
        },
        { status: 500 },
      );
    }
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    const { data, error } = await supabase
      .from("collection_wisdom")
      .select("id, title, from_the_box, theme, attribution")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(Math.min(limit, 100)); // Max 100 items

    if (error) {
      console.error("Error fetching wisdom:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch wisdom" },
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
