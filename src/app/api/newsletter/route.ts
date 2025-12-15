import { createServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface NewsletterSignup {
  email: string;
}

interface NewsletterSignupRecord {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  unsubscribe_token: string;
  created_at: string;
  updated_at: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("📧 [Newsletter API] Starting signup request...");

    // Parse request body
    const body = (await request.json()) as NewsletterSignup;
    const { email } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
        },
        { status: 400 },
      );
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid email address",
        },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log(
      `📧 [Newsletter API] Processing signup for: ${normalizedEmail}`,
    );

    // Initialize Supabase client
    const supabase = await createServerClient();
    console.log("✅ [Newsletter API] Supabase client created");

    // Check if email already exists
    const { data: existingSignup, error: checkError } = (await supabase
      .from("newsletter_signups")
      .select("email, is_active")
      .eq("email", normalizedEmail)
      .single()) as { data: NewsletterSignupRecord | null; error: unknown };

    if (checkError && (checkError as { code?: string }).code !== "PGRST116") {
      // PGRST116 is "not found" error, which is fine
      console.error(
        "❌ [Newsletter API] Error checking existing email:",
        checkError,
      );
      return NextResponse.json(
        {
          success: false,
          error: "Database error occurred",
        },
        { status: 500 },
      );
    }

    // If email already exists and is active
    if (existingSignup && existingSignup.is_active) {
      console.log(
        `ℹ️ [Newsletter API] Email already subscribed: ${normalizedEmail}`,
      );
      return NextResponse.json(
        {
          success: true,
          message: "You're already subscribed to our newsletter!",
          alreadySubscribed: true,
        },
        { status: 200 },
      );
    }

    // If email exists but was unsubscribed, reactivate it
    if (existingSignup && !existingSignup.is_active) {
      const { error: updateError } = (await supabase
        .from("newsletter_signups")
        // @ts-expect-error - newsletter_signups table not in generated types yet
        .update({ is_active: true, subscribed_at: new Date().toISOString() })
        .eq("email", normalizedEmail)) as { error: unknown };

      if (updateError) {
        console.error(
          "❌ [Newsletter API] Error reactivating subscription:",
          updateError,
        );
        return NextResponse.json(
          {
            success: false,
            error: "Failed to reactivate subscription",
          },
          { status: 500 },
        );
      }

      console.log(
        `✅ [Newsletter API] Reactivated subscription: ${normalizedEmail}`,
      );
      return NextResponse.json({
        success: true,
        message: "Welcome back! You've been resubscribed to our newsletter.",
      });
    }

    // Insert new signup
    const { error: insertError } = (await supabase
      .from("newsletter_signups")
      // @ts-expect-error - newsletter_signups table not in generated types yet
      .insert([{ email: normalizedEmail }])) as { error: unknown };

    if (insertError) {
      console.error("❌ [Newsletter API] Error inserting signup:", insertError);

      // Handle unique constraint violation (just in case)
      if ((insertError as { code?: string }).code === "23505") {
        return NextResponse.json(
          {
            success: true,
            message: "You're already subscribed to our newsletter!",
            alreadySubscribed: true,
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to subscribe. Please try again.",
        },
        { status: 500 },
      );
    }

    console.log(
      `✅ [Newsletter API] Successfully subscribed: ${normalizedEmail}`,
    );

    return NextResponse.json({
      success: true,
      message:
        "Thanks for subscribing! You'll receive hockey trivia updates from us.",
    });
  } catch (error) {
    console.error("💥 [Newsletter API] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
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
