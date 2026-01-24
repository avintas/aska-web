import { createServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/collections/slogans
 * Fetches slogan sets from source_content_sets
 * set_type: ["slogans"]
 */
export async function GET(): Promise<NextResponse> {
  try {
    console.log("💬 [Slogans API] Starting request...");

    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("source_content_sets")
      .select("*")
      .eq("app_id", 1)
      .eq("active", true)
      .contains("set_type", ["slogans"])
      .order("set_created_at", { ascending: false })
      .limit(30);

    if (error) throw error;

    console.log(`✅ [Slogans API] Fetched ${data?.length || 0} sets`);

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("❌ [Slogans API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
