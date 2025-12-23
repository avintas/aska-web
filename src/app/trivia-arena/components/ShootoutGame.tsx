"use client";

import { useState, useEffect } from "react";
import type {
  GameQuestion,
  GameSession,
  UserStats,
} from "@/shared/types/shootout-game";
import {
  createKeeper,
  initialStats,
  loadSession,
  saveSession,
} from "../utils/keeper";
import { ScoreBoard } from "./ScoreBoard";
import { QuestionCard } from "./QuestionCard";
import { ResultCard } from "./ResultCard";
import { DebugPanel } from "./DebugPanel";

export function ShootoutGame(): JSX.Element {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastAnswer, setLastAnswer] = useState<{
    answer: string;
    isCorrect: boolean;
  } | null>(null);

  // Fetch questions and initialize session
  useEffect(() => {
    async function initGame(): Promise<void> {
      try {
        // 1. Fetch Questions
        const res = await fetch("/api/trivia-arena/questions");
        if (!res.ok) throw new Error("Failed to fetch questions");
        const { data } = await res.json();

        if (!data || data.length === 0) {
          throw new Error("No published questions available.");
        }

        setQuestions(data);

        // 2. Load or Create Session
        let currentSession = loadSession();

        if (!currentSession) {
          // New Keeper for today
          currentSession = {
            keeper: createKeeper(data),
            stats: { ...initialStats },
            state: "intro", // Start with intro
            lastActive: new Date().toISOString(),
          };
          saveSession(currentSession);
        }

        setSession(currentSession);
      } catch (err) {
        console.error("Game initialization error:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    initGame();
  }, []);

  // Handlers
  const handleStartGame = (): void => {
    if (!session) return;
    const updated = { ...session, state: "playing" as const };
    setSession(updated);
    saveSession(updated);
  };

  const handleAnswer = (answer: string): void => {
    if (!session || !questions.length) return;

    const currentEntry = session.keeper.sequence[session.keeper.currentIndex];
    const currentQuestion = questions.find(
      (q) => q.id === currentEntry.questionId && q.type === currentEntry.type,
    );

    if (!currentQuestion) return; // Should not happen

    // Validate Logic
    let isCorrect = false;
    if (currentQuestion.type === "multiple-choice") {
      isCorrect = answer === currentQuestion.correct_answer;
    } else {
      // T/F logic: answer is "True" or "False"
      const boolAnswer = answer === "True";
      isCorrect = boolAnswer === currentQuestion.is_true;
    }

    // Update Stats
    const newStats: UserStats = {
      ...session.stats,
      correct: isCorrect ? session.stats.correct + 1 : session.stats.correct,
      incorrect: !isCorrect
        ? session.stats.incorrect + 1
        : session.stats.incorrect,
      totalAnswered: session.stats.totalAnswered + 1,
    };

    // Update Session
    setLastAnswer({ answer, isCorrect });
    const updated: GameSession = {
      ...session,
      stats: newStats,
      state: "revealed",
      lastActive: new Date().toISOString(),
    };

    setSession(updated);
    saveSession(updated);
  };

  const handleSkip = (): void => {
    if (!session) return;

    // Just advance, increment skipped count, no score change
    const newStats = {
      ...session.stats,
      skipped: session.stats.skipped + 1,
    };

    // Move to next question immediately
    const nextIndex = session.keeper.currentIndex + 1;
    const isFinished = nextIndex >= session.keeper.sequence.length;

    const updated: GameSession = {
      ...session,
      keeper: {
        ...session.keeper,
        currentIndex: isFinished ? 0 : nextIndex, // Loop or finish? Requirement implied "within a day remember sequence", let's just loop for now or finish. Let's loop to keep playing.
        // Actually requirement says "reset every 24 hours or how many questions we have".
        // Let's just increment. If index >= length, we handle that in render (Completed state)
      },
      stats: newStats,
      state: isFinished ? "completed" : "playing",
      lastActive: new Date().toISOString(),
    };

    setSession(updated);
    saveSession(updated);
  };

  const handleNext = (): void => {
    if (!session) return;

    const nextIndex = session.keeper.currentIndex + 1;
    const isFinished = nextIndex >= session.keeper.sequence.length;

    const updated: GameSession = {
      ...session,
      keeper: {
        ...session.keeper,
        currentIndex: nextIndex,
      },
      state: isFinished ? "completed" : "playing",
      lastActive: new Date().toISOString(),
    };

    setSession(updated);
    saveSession(updated);
    setLastAnswer(null);
  };

  // Reset Game Handler (for Completed state or manual reset)
  const handleReset = (): void => {
    if (!questions.length) return;

    // New Keeper
    const newSession: GameSession = {
      keeper: createKeeper(questions),
      stats: { ...initialStats },
      state: "playing",
      lastActive: new Date().toISOString(),
    };

    setSession(newSession);
    saveSession(newSession);
    setLastAnswer(null);
  };

  // Render Logic
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 bg-red-50 rounded-lg">
        <h3 className="font-bold text-lg">Something went wrong</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!session || !questions.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">Initializing...</p>
      </div>
    );
  }

  // Intro State
  if (session.state === "intro") {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Welcome to the Shootout!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            This is a <strong>free preview</strong> of our Trivia Arena. Enjoy
            the game, play for free, and have fun! Test your hockey knowledge
            with a mix of Multiple Choice and True/False questions. See how many
            you can get right in a row!
          </p>
          <button
            onClick={handleStartGame}
            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
          >
            Start Playing
          </button>
        </div>
      </div>
    );
  }

  // Completed State
  if (session.state === "completed") {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <ScoreBoard stats={session.stats} />
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mt-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            All Questions Completed!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            You&apos;ve gone through all the questions for today. Great job!
          </p>
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
          >
            Play Again (Restart)
          </button>
        </div>
      </div>
    );
  }

  // Active Game State
  // Get Current Question from Keeper Sequence
  const currentEntry = session.keeper.sequence[session.keeper.currentIndex];
  // Robust lookup
  const currentQuestion = questions.find(
    (q) => q.id === currentEntry?.questionId && q.type === currentEntry?.type,
  );

  if (!currentQuestion) {
    // Fallback if question not found (e.g. data changed)
    return (
      <div className="text-center p-8">
        <p>Error loading question. Please reset.</p>
        <button onClick={handleReset} className="mt-4 text-blue-600 underline">
          Reset Game
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      {/* Scoreboard */}
      <ScoreBoard stats={session.stats} />

      {/* Game Area */}
      <div className="min-h-[400px] flex flex-col justify-center">
        {session.state === "playing" ? (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            onSkip={handleSkip}
          />
        ) : (
          <ResultCard
            question={currentQuestion}
            userAnswer={lastAnswer?.answer || ""}
            isCorrect={lastAnswer?.isCorrect || false}
            onNext={handleNext}
          />
        )}
      </div>

      {/* Debug Panel */}
      <DebugPanel session={session} totalQuestions={questions.length} />
    </div>
  );
}
