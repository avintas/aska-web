import { useMemo } from "react";
import type { GameQuestion } from "@/shared/types/shootout-game";

interface QuestionCardProps {
  question: GameQuestion;
  onAnswer: (answer: string) => void;
  onSkip: () => void;
}

export function QuestionCard({
  question,
  onAnswer,
  onSkip,
}: QuestionCardProps): JSX.Element {
  const isMultipleChoice = question.type === "multiple-choice";

  // Prepare options - memoized to prevent re-shuffling on every render
  const options = useMemo(() => {
    if (isMultipleChoice) {
      const allOptions = [question.correct_answer, ...question.wrong_answers];
      // Shuffle using Fisher-Yates algorithm for better randomness
      const shuffled = [...allOptions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    return ["True", "False"];
  }, [question.id, question.type]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {isMultipleChoice ? "Multiple Choice" : "True / False"}
          </span>
          <button
            onClick={onSkip}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline transition-colors"
          >
            Skip Question
          </button>
        </div>

        {/* Question Text */}
        <div className="p-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-relaxed">
            {question.question_text}
          </h2>
        </div>

        {/* Options */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/30 grid gap-3">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onAnswer(option)}
              className="w-full text-left px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 font-medium text-gray-700 dark:text-gray-200 active:scale-[0.99]"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
