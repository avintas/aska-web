import { createServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import type { GameQuestion } from "@/shared/types/shootout-game";
import type {
  MultipleChoiceTrivia,
  TrueFalseTrivia,
} from "@/shared/types/trivia";

/**
 * GET /api/trivia-arena/questions
 * Fetches all published questions to build the keeper sequence
 */
export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createServerClient();

    // Fetch Multiple Choice
    const { data: mcData, error: mcError } = await supabase
      .from("trivia_multiple_choice")
      .select("*")
      .eq("status", "published");

    if (mcError) throw mcError;

    // Fetch True/False
    const { data: tfData, error: tfError } = await supabase
      .from("trivia_true_false")
      .select("*")
      .eq("status", "published");

    if (tfError) throw tfError;

    // Combine and format
    const questions: GameQuestion[] = [];

    if (mcData) {
      (mcData as unknown as MultipleChoiceTrivia[]).forEach((q) => {
        questions.push({
          ...q,
          type: "multiple-choice",
        });
      });
    }

    if (tfData) {
      (tfData as unknown as TrueFalseTrivia[]).forEach((q) => {
        questions.push({
          ...q,
          type: "true-false",
        });
      });
    }

    return NextResponse.json({
      success: true,
      data: questions,
      count: questions.length,
    });
  } catch (error) {
    console.error("Error fetching trivia questions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch questions" },
      { status: 500 },
    );
  }
}
