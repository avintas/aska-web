/**
 * Keeper Utility
 * Manages the daily question sequence and session persistence
 */

import { v4 as uuidv4 } from "uuid";
import type {
  DailyKeeper,
  GameQuestion,
  QuestionMapEntry,
  UserStats,
  GameSession,
} from "@/shared/types/shootout-game";
import { STORAGE_KEYS } from "@/shared/types/shootout-game";

// Helper to get today's date string YYYY-MM-DD
export const getTodayString = (): string =>
  new Date().toISOString().split("T")[0];

/**
 * Shuffles an array (Fisher-Yates)
 */
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Creates a new keeper with a randomized sequence
 */
export function createKeeper(questions: GameQuestion[]): DailyKeeper {
  const shuffled = shuffle(questions);
  const sequence: QuestionMapEntry[] = shuffled.map((q, index) => ({
    questionId: q.id,
    type: q.type,
    index,
  }));

  return {
    id: uuidv4(),
    date: getTodayString(),
    sequence,
    currentIndex: 0,
  };
}

/**
 * Initial empty stats
 */
export const initialStats: UserStats = {
  correct: 0,
  incorrect: 0,
  skipped: 0,
  totalAnswered: 0,
};

/**
 * Load session from local storage, handling daily expiration
 */
export function loadSession(): GameSession | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!stored) return null;

    const session = JSON.parse(stored) as GameSession;
    const today = getTodayString();

    // If the session is from a previous day, discard it (return null)
    // The game logic will then generate a new keeper for today
    if (session.keeper.date !== today) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      return null;
    }

    return session;
  } catch (e) {
    console.error("Error loading session:", e);
    return null;
  }
}

/**
 * Save session to local storage
 */
export function saveSession(session: GameSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  } catch (e) {
    console.error("Error saving session:", e);
  }
}
