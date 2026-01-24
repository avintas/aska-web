"use client";

import type { TriviaGameSession } from "@/shared/types/trivia-game";
import { getScorePercentage, getScoreDisplay } from "@/utils/triviaGameSession";

interface ScoreDisplayProps {
  session: TriviaGameSession;
}

export function ScoreDisplay({ session }: ScoreDisplayProps): JSX.Element {
  const displayText = getScoreDisplay(session);

  return (
    <div className="w-full flex justify-center mb-4 md:mb-6">
      <div className="inline-block px-6 py-3 bg-navy-900 dark:bg-orange-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg">
        <p className="text-sm md:text-base font-bold text-white text-center">
          {displayText}
        </p>
      </div>
    </div>
  );
}
