import { createServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/collections/shareables
 * Fetches slogans from source_content_shareables table
 * Filters by content_type: "slogans"
 */
export async function GET(): Promise<NextResponse> {
  try {
    console.log("📤 [Shareables API] Starting request...");

    const supabase = await createServerClient();

    // Type definition for source_content_shareables records
    type ShareableRecord = {
      id: number;
      content_type: string;
      content: string;
      created_at: string;
      [key: string]: unknown;
    };

    // Fetch slogans from source_content_shareables table
    const { data, error } = await supabase
      .from("source_content_shareables")
      .select("*")
      .eq("content_type", "slogans")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    console.log(`✅ [Shareables API] Fetched ${data?.length || 0} records`);

    // Extract slogans from records using the content field
    const slogans: Array<{
      id: number;
      slogan: string;
      created_at?: string;
      [key: string]: unknown;
    }> = [];

    if (data) {
      for (const record of data as ShareableRecord[]) {
        // Use the content field as the slogan text
        if (
          record.content &&
          typeof record.content === "string" &&
          record.content.trim()
        ) {
          slogans.push({
            id: record.id,
            slogan: record.content.trim(),
            created_at: record.created_at,
          });
        }
      }
    }

    console.log(`✅ [Shareables API] Extracted ${slogans.length} slogans`);

    return NextResponse.json(
      {
        success: true,
        data: slogans,
        count: slogans.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    console.error("❌ [Shareables API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
