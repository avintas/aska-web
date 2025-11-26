/**
 * Shootout Trivia Game Types
 */

import type { MultipleChoiceTrivia, TrueFalseTrivia } from "./trivia";

// Unified Question Type
export type GameQuestion =
  | (MultipleChoiceTrivia & { type: "multiple-choice" })
  | (TrueFalseTrivia & { type: "true-false" });

// Keeper / Sequence Types
export interface QuestionMapEntry {
  questionId: number;
  type: "multiple-choice" | "true-false";
  index: number; // Position in the sequence
}

export interface DailyKeeper {
  id: string; // UUID for the keeper session
  date: string; // YYYY-MM-DD to track daily persistence
  sequence: QuestionMapEntry[];
  currentIndex: number;
}

// Game State Types
export interface UserStats {
  correct: number;
  incorrect: number;
  skipped: number;
  totalAnswered: number;
}

export type GameState =
  | "loading"
  | "intro" // Initial state with intro text
  | "playing" // Question visible
  | "revealed" // Answer revealed (explanation shown)
  | "completed" // All questions done
  | "error";

export interface GameSession {
  keeper: DailyKeeper;
  stats: UserStats;
  state: GameState;
  lastActive: string; // ISO Timestamp
}

// Storage Keys
export const STORAGE_KEYS = {
  SESSION: "shootout-game-session-v1",
};
