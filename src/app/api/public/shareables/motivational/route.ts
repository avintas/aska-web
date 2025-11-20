import { NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createServerClient();

    // Get the latest published set from pub_shareables_motivational
    const { data, error } = await supabase
      .from("pub_shareables_motivational")
      .select("id, items, created_at")
      .eq("status", "published")
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

    // Return the items array from the published set
    return NextResponse.json(
      { success: true, data: data.items },
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
