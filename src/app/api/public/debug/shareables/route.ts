import { NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

/**
 * Debug endpoint to check shareables tables status
 * Helps diagnose why shareables aren't loading
 */
export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createServerClient();

    // Try different possible table names
    const possibleFactsTables = [
      "pub_shareables_facts",
      "daily_shareables_facts",
      "shareables_facts",
    ];

    const possibleMotivationalTables = [
      "pub_shareables_motivational",
      "daily_shareables_motivational",
      "shareables_motivational",
    ];

    const results: Record<string, unknown> = {};

    // Test facts tables
    for (const tableName of possibleFactsTables) {
      const test = await supabase.from(tableName).select("*").limit(1);
      results[`facts_${tableName}`] = {
        exists: !test.error,
        error: test.error?.message || null,
        code: test.error?.code || null,
        hint: test.error?.hint || null,
        hasData: test.data && test.data.length > 0,
        columns:
          test.data && test.data.length > 0 ? Object.keys(test.data[0]) : null,
      };
    }

    // Test motivational tables
    for (const tableName of possibleMotivationalTables) {
      const test = await supabase.from(tableName).select("*").limit(1);
      results[`motivational_${tableName}`] = {
        exists: !test.error,
        error: test.error?.message || null,
        code: test.error?.code || null,
        hint: test.error?.hint || null,
        hasData: test.data && test.data.length > 0,
        columns:
          test.data && test.data.length > 0 ? Object.keys(test.data[0]) : null,
      };
    }

    // Try the actual queries the code uses
    const factsQuery = await supabase
      .from("pub_shareables_facts")
      .select("id, items, created_at")
      .eq("status", "published")
      .limit(1);

    const motivationalQuery = await supabase
      .from("pub_shareables_motivational")
      .select("id, items, created_at")
      .eq("status", "published")
      .limit(1);

    return NextResponse.json({
      success: true,
      debug: {
        tableTests: results,
        actualQueries: {
          facts: {
            error: factsQuery.error?.message || null,
            code: factsQuery.error?.code || null,
            hint: factsQuery.error?.hint || null,
            hasData: factsQuery.data && factsQuery.data.length > 0,
          },
          motivational: {
            error: motivationalQuery.error?.message || null,
            code: motivationalQuery.error?.code || null,
            hint: motivationalQuery.error?.hint || null,
            hasData:
              motivationalQuery.data && motivationalQuery.data.length > 0,
          },
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Debug check failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
