import { NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createServerClient();

    // Fetch all published IDs
    const { data: ids, error: idsError } = await supabase
      .from("collection_wisdom")
      .select("id")
      .eq("status", "published");

    if (idsError) {
      console.error("Error fetching wisdom IDs:", idsError);
      return NextResponse.json(
        { success: false, error: "Failed to fetch wisdom" },
        { status: 500 },
      );
    }

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "No published wisdom found" },
        { status: 404 },
      );
    }

    // Pick random ID
    const randomId = ids[Math.floor(Math.random() * ids.length)].id;

    // Fetch the random item
    const { data, error } = await supabase
      .from("collection_wisdom")
      .select("id, title, from_the_box, theme, attribution")
      .eq("id", randomId)
      .eq("status", "published")
      .single();

    if (error || !data) {
      console.error("Error fetching random wisdom:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch wisdom" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, data },
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
