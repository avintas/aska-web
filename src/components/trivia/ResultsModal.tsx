"use client";

import type { TriviaGameSession } from "@/shared/types/trivia-game";
import { getScorePercentage } from "@/utils/triviaGameSession";

interface ResultsModalProps {
  isOpen: boolean;
  session: TriviaGameSession;
  onPlayAgain: () => void;
  onBackToArena: () => void;
}

export function ResultsModal({
  isOpen,
  session,
  onPlayAgain,
  onBackToArena,
}: ResultsModalProps): JSX.Element | null {
  if (!isOpen) return null;

  const percentage = getScorePercentage(session);
  const isPerfect = percentage === 100;
  const isGood = percentage >= 70;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onBackToArena}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-4 duration-300 border-4 border-gray-900 dark:border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex flex-col items-center p-6 md:p-8 border-b-4 border-gray-900 dark:border-gray-100">
          <div className="text-6xl md:text-7xl mb-4">
            {isPerfect ? "🏆" : isGood ? "🎉" : "📊"}
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white text-center">
            Game Complete!
          </h2>
        </div>

        {/* Results Content */}
        <div className="p-6 md:p-8">
          {/* Score Breakdown */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <span className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300">
                Correct Answers:
              </span>
              <span className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                {session.correct} / {session.totalAnswered}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <span className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300">
                Score:
              </span>
              <span className="text-xl md:text-2xl font-bold text-navy-900 dark:text-orange-500">
                {percentage}%
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <span className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300">
                Points Earned:
              </span>
              <span className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {session.score}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={onPlayAgain}
              className="w-full px-6 py-3 text-base md:text-lg font-bold bg-navy-900 dark:bg-orange-500 text-white rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              Play Again
            </button>
            <button
              onClick={onBackToArena}
              className="w-full px-6 py-3 text-base md:text-lg font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:opacity-90 active:scale-95 transition-all"
            >
              Back to Arena
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
