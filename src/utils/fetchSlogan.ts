import { createServerClient } from "@/utils/supabase/server";

/**
 * Server-side function to fetch a random slogan
 * Used in server components to avoid client-side API calls
 * Returns null if fetching fails (e.g., during static generation)
 */
export async function fetchSlogan(): Promise<string | null> {
  try {
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

    if (error) {
      // Silently fail during static generation or other errors
      // Component will use fallback message
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    // Extract slogans from records using the content field
    const slogans: string[] = [];

    for (const record of data as ShareableRecord[]) {
      if (
        record.content &&
        typeof record.content === "string" &&
        record.content.trim()
      ) {
        slogans.push(record.content.trim());
      }
    }

    if (slogans.length === 0) {
      return null;
    }

    // Pick a random slogan
    const randomIndex = Math.floor(Math.random() * slogans.length);
    return slogans[randomIndex];
  } catch (error) {
    // Silently fail during static generation or other errors
    // Component will use fallback message
    // This is expected during static generation when cookies aren't available
    return null;
  }
}
