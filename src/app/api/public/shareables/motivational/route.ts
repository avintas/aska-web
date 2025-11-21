import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createServerClient();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const mode = searchParams.get("mode");

    // MODE: Archive List (Fetch metadata for past sets)
    if (mode === "archive") {
      const { data: archiveData, error: archiveError } = await supabase
        .from("pub_shareables_motivational")
        .select("id, created_at, status") // Minimal fields
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(20); // Limit history to 20 items

      if (archiveError) {
        console.error("Error fetching motivational archive:", archiveError);
        return NextResponse.json(
          { success: false, error: "Failed to fetch archive" },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { success: true, data: archiveData },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        },
      );
    }

    // MODE: Single Set (Latest or by ID)
    const baseQuery = supabase
      .from("pub_shareables_motivational")
      .select("id, items, created_at")
      .eq("status", "published");

    const { data, error } = id
      ? await baseQuery.eq("id", id).single()
      : await baseQuery
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

    if (error) {
      console.error("Error fetching published motivational shareables:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch motivational shareables" },
        { status: 500 },
      );
    }

    if (!data || !data.items) {
      return NextResponse.json(
        { success: false, error: "No published motivational shareables found" },
        { status: 404 },
      );
    }

    // Return the items array AND the set metadata (id, date)
    return NextResponse.json(
      {
        success: true,
        data: data.items,
        meta: {
          id: data.id,
          created_at: data.created_at,
        },
      },
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
