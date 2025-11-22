import { createServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface MotivationalRecord {
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
    console.log("🔍 [Game Plan API] Starting request...");

    const supabase = await createServerClient();
    console.log("✅ [Game Plan API] Supabase client created");

    // Handle archive mode - return list of previous sets
    if (mode === "archive") {
      console.log("📚 [Game Plan API] Fetching archive list...");
      const { data: archiveData, error: archiveError } = await supabase
        .from("pub_shareables_motivational")
        .select("id, created_at, status")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(20);

      if (archiveError) {
        console.error("❌ [Game Plan API] Archive error:", archiveError);
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

      console.log(`📋 [Game Plan API] Fetching set ID: ${parsedSetId}`);
      const { data, error } = (await supabase
        .from("pub_shareables_motivational")
        .select("*")
        .eq("id", parsedSetId)
        .eq("status", "published")
        .single()) as {
        data: MotivationalRecord | null;
        error: unknown;
        status: number;
        statusText: string;
      };

      if (error) {
        console.error("❌ [Game Plan API] Database error:", error);
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

    // Default: Query latest published motivational from pub_shareables_motivational
    console.log(
      "📊 [Game Plan API] Querying latest pub_shareables_motivational...",
    );

    const { data, error, status, statusText } = (await supabase
      .from("pub_shareables_motivational")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()) as {
      data: MotivationalRecord | null;
      error: unknown;
      status: number;
      statusText: string;
    };

    console.log("📥 [Game Plan API] Query response received:");
    console.log("   - Status:", status);
    console.log("   - Status Text:", statusText);
    console.log("   - Error:", error);
    console.log("   - Data:", JSON.stringify(data, null, 2));

    if (error) {
      console.error("❌ [Game Plan API] Database error:", error);
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
      console.warn("⚠️ [Game Plan API] No data returned");
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
      "✅ [Game Plan API] Successfully retrieved record:",
      (data as MotivationalRecord).id,
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
    console.error("💥 [Game Plan API] Unexpected error:", error);
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
