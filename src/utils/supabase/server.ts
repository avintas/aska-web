import {
  createServerClient as createSupabaseServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerClient(): Promise<
  ReturnType<typeof createSupabaseServerClient>
> {
  // 1. Sanitize the URL (remove invisible spaces)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  // 2. Strict validation
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase environment variables");
    throw new Error("Missing required environment variables");
  }

  // 3. Optional: Debugging log (Remove this after it works)
  // This will show up in Vercel logs so you can see EXACTLY what it's trying to use
  console.log(`[Supabase Init] Connecting to: '${supabaseUrl}'`);

  const cookieStore = await cookies();

  return createSupabaseServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string): string | undefined {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions): void {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // Handle the case where setting cookies fails (e.g. Server Actions)
        }
      },
      remove(name: string, options: CookieOptions): void {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch (error) {
          // Handle cookie deletion errors
        }
      },
    },
  });
}
