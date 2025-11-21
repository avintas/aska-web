import {
  createServerClient as createSupabaseServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates and returns a Supabase client for use in Server Components/Actions/API Routes.
 *
 * This client securely manages the user's session via cookies on the server.
 *
 * @returns {Promise<ReturnType<typeof createSupabaseServerClient>>} The secure server-side Supabase client.
 */
export async function createServerClient(): Promise<
  ReturnType<typeof createSupabaseServerClient>
> {
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const missing = [];
    if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!supabaseKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

    console.error(
      "❌ Missing Supabase environment variables:",
      missing.join(", "),
    );
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }

  const cookieStore = await cookies();

  return createSupabaseServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string): string | undefined {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions): void {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions): void {
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });
}
