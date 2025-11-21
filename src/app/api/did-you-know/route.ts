import { createServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface FactRecord {
  id: number;
  items: unknown;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("mode");
  const setId = searchParams.get("id");
  try {
    console.log("🔍 [Did You Know API] Starting request...");

    const supabase = await createServerClient();
    console.log("✅ [Did You Know API] Supabase client created");

    // Handle archive mode - return list of previous sets
    if (mode === "archive") {
      console.log("📚 [Did You Know API] Fetching archive list...");
      const { data: archiveData, error: archiveError } = await supabase
        .from("pub_shareables_facts")
        .select("id, created_at, status")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(20);

      if (archiveError) {
        console.error("❌ [Did You Know API] Archive error:", archiveError);
        const errorMessage =
          archiveError &&
          typeof archiveError === "object" &&
          "message" in archiveError
            ? String(archiveError.message)
            : "Database error occurred";
        return NextResponse.json(
          {
            success: false,
            error: errorMessage,
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        data: archiveData || [],
      });
    }

    // Handle specific set ID request
    if (setId) {
      const parsedSetId = parseInt(setId, 10);
      if (isNaN(parsedSetId)) {
        return NextResponse.json(
          { success: false, error: "Invalid Set ID" },
          { status: 400 },
        );
      }

      console.log(`📋 [Did You Know API] Fetching set ID: ${parsedSetId}`);
      const { data, error } = (await supabase
        .from("pub_shareables_facts")
        .select("*")
        .eq("id", parsedSetId)
        .eq("status", "published")
        .single()) as {
        data: FactRecord | null;
        error: unknown;
        status: number;
        statusText: string;
      };

      if (error) {
        console.error("❌ [Did You Know API] Database error:", error);
        const errorMessage =
          error && typeof error === "object" && "message" in error
            ? String(error.message)
            : "Database error occurred";
        return NextResponse.json(
          {
            success: false,
            error: errorMessage,
          },
          { status: 500 },
        );
      }

      if (!data) {
        return NextResponse.json(
          {
            success: false,
            error: "Set not found",
          },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        data,
      });
    }

    // Default: Query latest published facts from pub_shareables_facts
    console.log(
      "📊 [Did You Know API] Querying latest pub_shareables_facts...",
    );

    const { data, error, status, statusText } = (await supabase
      .from("pub_shareables_facts")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()) as {
      data: FactRecord | null;
      error: unknown;
      status: number;
      statusText: string;
    };

    console.log("📥 [Did You Know API] Query response received:");
    console.log("   - Status:", status);
    console.log("   - Status Text:", statusText);
    console.log("   - Error:", error);
    console.log("   - Data:", JSON.stringify(data, null, 2));

    if (error) {
      console.error("❌ [Did You Know API] Database error:", error);
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Database error occurred";
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          errorDetails: error,
          debug: {
            status,
            statusText,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 500 },
      );
    }

    if (!data) {
      console.warn("⚠️ [Did You Know API] No data returned");
      return NextResponse.json(
        {
          success: false,
          error: "No record found",
          debug: {
            status,
            statusText,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 },
      );
    }

    console.log(
      "✅ [Did You Know API] Successfully retrieved record:",
      (data as FactRecord).id,
    );

    return NextResponse.json({
      success: true,
      data,
      debug: {
        status,
        statusText,
        recordCount: 1,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("💥 [Did You Know API] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        debug: {
          errorType:
            error instanceof Error ? error.constructor.name : typeof error,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    );
  }
}
