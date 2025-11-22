import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

// Define interfaces matching your database structure
interface CodeRecord {
  id: number;
  items: unknown;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  try {
    const supabase = await createServerClient();

    // Handle different query modes
    if (mode === "archive") {
      // Archive/list mode
      const { data, error } = await supabase
        .from("pub_shareables_code")
        .select("id, created_at, status")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        const errorMessage =
          error && typeof error === "object" && "message" in error
            ? String(error.message)
            : "Database error occurred";
        return NextResponse.json(
          { success: false, error: errorMessage },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        data: data || [],
      });
    }

    // Handle specific ID request
    if (id) {
      const parsedId = parseInt(id, 10);
      if (isNaN(parsedId)) {
        return NextResponse.json(
          { success: false, error: "Invalid ID" },
          { status: 400 },
        );
      }

      const { data, error } = await supabase
        .from("pub_shareables_code")
        .select("*")
        .eq("id", parsedId)
        .eq("status", "published")
        .single();

      if (error || !data) {
        return NextResponse.json(
          { success: false, error: "Record not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        data: data as CodeRecord,
      });
    }

    // Default: Query latest published record
    const { data, error } = await supabase
      .from("pub_shareables_code")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "No record found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: data as CodeRecord,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
