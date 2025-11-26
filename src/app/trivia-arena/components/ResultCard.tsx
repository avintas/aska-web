import type { GameQuestion } from "@/shared/types/shootout-game";

interface ResultCardProps {
  question: GameQuestion;
  userAnswer?: string; // Optional since not used in display currently
  isCorrect: boolean;
  onNext: () => void;
}

export function ResultCard({
  question,
  isCorrect,
  onNext,
}: ResultCardProps): JSX.Element {
  // Normalize boolean comparison for T/F
  const getCorrectText = (): string => {
    if (question.type === "multiple-choice") return question.correct_answer;
    return question.is_true ? "True" : "False";
  };

  const correctText = getCorrectText();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`rounded-xl shadow-lg overflow-hidden border-2 ${
          isCorrect
            ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
            : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
        }`}
      >
        {/* Result Header */}
        <div className="p-8 text-center">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isCorrect
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            <span className="text-3xl">{isCorrect ? "✓" : "✗"}</span>
          </div>

          <h2
            className={`text-2xl font-bold mb-2 ${
              isCorrect
                ? "text-green-800 dark:text-green-200"
                : "text-red-800 dark:text-red-200"
            }`}
          >
            {isCorrect ? "Correct!" : "Incorrect"}
          </h2>

          {!isCorrect && (
            <p className="text-gray-600 dark:text-gray-300">
              The correct answer was:{" "}
              <span className="font-bold">{correctText}</span>
            </p>
          )}
        </div>

        {/* Explanation */}
        {question.explanation && (
          <div className="px-8 pb-8">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 uppercase font-bold mb-2">
                Did you know?
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Next Button */}
        <div className="p-6 bg-white/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-center">
          <button
            onClick={onNext}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 active:translate-y-0"
          >
            Next Question →
          </button>
        </div>
      </div>
    </div>
  );
}
