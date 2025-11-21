import { NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createServerClient();

    // Fetch all published IDs
    const { data: ids, error: idsError } = await supabase
      .from("collection_greetings")
      .select("id")
      .eq("status", "published");

    if (idsError) {
      console.error("Error fetching greeting IDs:", idsError);
      return NextResponse.json(
        { success: false, error: "Failed to fetch greetings" },
        { status: 500 },
      );
    }

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "No published greetings found" },
        { status: 404 },
      );
    }

    // Pick random ID
    const idsArray = ids as Array<{ id: number }>;
    const randomItem = idsArray[Math.floor(Math.random() * idsArray.length)];
    const randomId = randomItem?.id;

    if (!randomId) {
      return NextResponse.json(
        { success: false, error: "Failed to select random greeting" },
        { status: 500 },
      );
    }

    // Fetch the random item
    const { data, error } = await supabase
      .from("collection_greetings")
      .select("id, greeting_text, attribution")
      .eq("id", randomId)
      .eq("status", "published")
      .single();

    if (error || !data) {
      console.error("Error fetching random greeting:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch greeting" },
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
