"use client";

import { useState, useMemo } from "react";
import type { TriviaQuestionData } from "@/shared/types/trivia-game";
import { formatModalContent } from "@/utils/formatModalContent";

interface QuestionModalProps {
  isOpen: boolean;
  questionData: TriviaQuestionData;
  onAnswer: (answer: string) => void;
  onClose: () => void;
  isReviewMode?: boolean; // If true, show correct answer and explanation
}

export function QuestionModal({
  isOpen,
  questionData,
  onAnswer,
  onClose,
  isReviewMode = false,
}: QuestionModalProps): JSX.Element | null {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const isMultipleChoice =
    questionData.question_type === "multiple-choice" ||
    (questionData.wrong_answers && questionData.wrong_answers.length > 0);

  // Prepare options - shuffle for multiple choice
  // Use question_text as key for memoization since questionData doesn't have id
  const options = useMemo(() => {
    if (isMultipleChoice && questionData.wrong_answers) {
      const allOptions = [
        questionData.correct_answer,
        ...questionData.wrong_answers,
      ];
      // Shuffle using Fisher-Yates algorithm
      const shuffled = [...allOptions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    return ["True", "False"];
  }, [
    questionData.question_text,
    isMultipleChoice,
    questionData.correct_answer,
    questionData.wrong_answers,
  ]);

  if (!isOpen) return null;

  const handleSubmit = (): void => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer);
      setSelectedAnswer(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border-4 border-gray-900 dark:border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b-4 border-gray-900 dark:border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl">
              {isMultipleChoice ? "🎯" : "✅"}
            </span>
            <span className="text-xs md:text-sm font-medium px-2.5 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {isMultipleChoice ? "Multiple Choice" : "True / False"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Question Text */}
        <div className="p-6 md:p-8">
          <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-relaxed text-center mb-6">
            {formatModalContent(questionData.question_text, {
              className: "",
              preserveLineBreaks: true,
            })}
          </div>

          {/* Difficulty Badge */}
          {questionData.difficulty && (
            <div className="flex justify-center mb-6">
              <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs md:text-sm font-semibold px-3 py-1.5 rounded">
                {questionData.difficulty}
              </span>
            </div>
          )}

          {/* Answer Options */}
          <div className="grid gap-3 mt-8">
            {options.map((option) => {
              const isCorrectAnswer =
                option.toLowerCase().trim() ===
                questionData.correct_answer.toLowerCase().trim();
              const showCorrect = isReviewMode && isCorrectAnswer;

              return (
                <button
                  key={option}
                  onClick={() => !isReviewMode && setSelectedAnswer(option)}
                  disabled={isReviewMode}
                  className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all duration-200 font-medium text-base md:text-lg ${
                    isReviewMode
                      ? showCorrect
                        ? "border-green-500 bg-green-100 dark:bg-green-900/30"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-60"
                      : selectedAnswer === option
                        ? "border-navy-900 dark:border-orange-500 bg-navy-100 dark:bg-orange-900/30 shadow-md"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-navy-500 dark:hover:border-orange-500 hover:shadow-md"
                  } text-gray-700 dark:text-gray-200 ${!isReviewMode ? "active:scale-[0.99]" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isReviewMode && showCorrect && (
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        ✓ Correct Answer
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation (for review mode) */}
          {isReviewMode && questionData.explanation && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                <strong>Explanation:</strong>{" "}
                {formatModalContent(questionData.explanation, {
                  className: "",
                  preserveLineBreaks: true,
                })}
              </div>
            </div>
          )}

          {/* Submit Button (only show if not in review mode) */}
          {!isReviewMode && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className={`px-8 py-3 text-base md:text-lg font-bold rounded-lg shadow-lg transition-all ${
                  selectedAnswer !== null
                    ? "bg-navy-900 dark:bg-orange-500 text-white hover:opacity-90 active:scale-95 hover:shadow-xl"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
