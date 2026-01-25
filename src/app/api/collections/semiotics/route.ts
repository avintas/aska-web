import { createServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/collections/semiotics
 * Fetches slogans from source_content_semiotics table
 * Extracts "slogan" field from the "semiotic_analysis" JSONB array
 */
export async function GET(): Promise<NextResponse> {
  try {
    console.log("🔍 [Semiotics API] Starting request...");

    const supabase = await createServerClient();

    // Fetch all records from source_content_semiotics
    const { data, error } = await supabase
      .from("source_content_semiotics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    console.log(`✅ [Semiotics API] Fetched ${data?.length || 0} records`);

    // Type definition for source_content_semiotics records
    type SemioticsRecord = {
      id: number;
      semiotic_analysis: unknown;
      created_at: string;
      [key: string]: unknown;
    };

    // Type definition for semiotic analysis structure
    type SemioticAnalysis = {
      motto?: string;
      t_shirt_product?: {
        slogan?: string;
        [key: string]: unknown;
      };
      semiotic_analysis?: {
        hidden_meaning?: string;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };

    // Extract slogans from semiotic_analysis JSONB field
    const slogans: Array<{
      id: number;
      slogan: string;
      motto?: string;
      hidden_meaning?: string;
      source_id?: number;
      created_at?: string;
      [key: string]: unknown;
    }> = [];

    if (data) {
      for (const record of data as SemioticsRecord[]) {
        let semioticAnalysis: unknown = record.semiotic_analysis;

        // Parse JSON string if it's a string
        if (typeof semioticAnalysis === "string") {
          try {
            semioticAnalysis = JSON.parse(semioticAnalysis);
          } catch (e) {
            console.warn(
              `⚠️ [Semiotics API] Failed to parse JSON for record ${record.id}:`,
              e,
            );
            continue;
          }
        }

        // Check if semiotic_analysis is an object
        if (semioticAnalysis && typeof semioticAnalysis === "object") {
          const analysis = semioticAnalysis as SemioticAnalysis;
          // Prioritize motto over slogan
          if (
            analysis.motto &&
            typeof analysis.motto === "string" &&
            analysis.motto.trim()
          ) {
            slogans.push({
              id: record.id || 0,
              slogan: analysis.motto.trim(),
              motto: analysis.motto.trim(),
              hidden_meaning: analysis.semiotic_analysis?.hidden_meaning,
              source_id: record.id,
              created_at: record.created_at,
            });
          }
          // Fallback to t_shirt_product.slogan if no motto
          else if (
            analysis.t_shirt_product &&
            typeof analysis.t_shirt_product === "object" &&
            "slogan" in analysis.t_shirt_product
          ) {
            const slogan = analysis.t_shirt_product.slogan;
            if (slogan && typeof slogan === "string" && slogan.trim()) {
              slogans.push({
                id: record.id || 0,
                slogan: slogan.trim(),
                motto: analysis.motto,
                hidden_meaning: analysis.semiotic_analysis?.hidden_meaning,
                source_id: record.id,
                created_at: record.created_at,
              });
            }
          }
        }
      }
    }

    console.log(`✅ [Semiotics API] Extracted ${slogans.length} slogans`);

    return NextResponse.json({
      success: true,
      data: slogans,
      count: slogans.length,
    });
  } catch (error) {
    console.error("❌ [Semiotics API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
