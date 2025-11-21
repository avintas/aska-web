import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    let supabase;
    try {
      supabase = await createServerClient();
    } catch (clientError) {
      console.error("Failed to create Supabase client:", clientError);
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details:
            clientError instanceof Error
              ? clientError.message
              : String(clientError),
        },
        { status: 500 },
      );
    }
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const mode = searchParams.get("mode");

    // MODE: Archive List (Fetch metadata for past sets)
    if (mode === "archive") {
      const { data: archiveData, error: archiveError } = await supabase
        .from("pub_shareables_motivational")
        .select("id, created_at, status") // Minimal fields
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(20); // Limit history to 20 items

      if (archiveError) {
        console.error("Error fetching motivational archive:", archiveError);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to fetch archive",
            details: archiveError.message || JSON.stringify(archiveError),
            code: archiveError.code,
            hint: archiveError.hint,
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { success: true, data: archiveData },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        },
      );
    }

    // MODE: Single Set (Latest or by ID)
    const baseQuery = supabase
      .from("pub_shareables_motivational")
      .select("id, items, created_at")
      .eq("status", "published");

    const { data, error } = id
      ? await baseQuery.eq("id", id).single()
      : await baseQuery
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

    if (error) {
      console.error("Error fetching published motivational shareables:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch motivational shareables",
          details: error.message || JSON.stringify(error),
          code: error.code,
          hint: error.hint,
        },
        { status: 500 },
      );
    }

    console.log("Motivational query result:", {
      hasData: !!data,
      dataKeys: data ? Object.keys(data) : null,
    });

    if (!data) {
      console.log("No data returned from motivational query");
      return NextResponse.json(
        { success: false, error: "No published motivational shareables found" },
        { status: 404 },
      );
    }

    const shareableData = data as {
      id: number;
      items: unknown[];
      created_at: string;
    };

    if (!shareableData.items) {
      return NextResponse.json(
        { success: false, error: "No published motivational shareables found" },
        { status: 404 },
      );
    }

    // Return the items array AND the set metadata (id, date)
    return NextResponse.json(
      {
        success: true,
        data: shareableData.items,
        meta: {
          id: shareableData.id,
          created_at: shareableData.created_at,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
