import { NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createServerClient();

    // Get the latest published set from pub_shareables_facts
    const { data, error } = await supabase
      .from("pub_shareables_facts")
      .select("id, items, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching published facts shareables:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch facts shareables" },
        { status: 500 },
      );
    }

    if (!data || !data.items) {
      return NextResponse.json(
        { success: false, error: "No published facts shareables found" },
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
