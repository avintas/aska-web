"use client";

import type React from "react";

interface QuestionCountModalProps {
  isOpen: boolean;
  onSelect: (count: number) => void;
  onClose: () => void;
}

const QUESTION_OPTIONS = [3, 5, 10, 15];

export function QuestionCountModal({
  isOpen,
  onSelect,
  onClose,
}: QuestionCountModalProps): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-4 duration-300 border-4 border-gray-900 dark:border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b-4 border-gray-900 dark:border-gray-100">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
            How many questions?
          </h2>
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

        {/* Modal Content */}
        <div className="p-4 md:p-6">
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6 text-center">
            Select how many questions you want to play:
          </p>

          {/* Question Count Options */}
          <div className="grid grid-cols-2 gap-3">
            {QUESTION_OPTIONS.map((count) => (
              <button
                key={count}
                onClick={() => {
                  onSelect(count);
                  onClose();
                }}
                className="px-6 py-4 text-lg md:text-xl font-bold bg-navy-900 dark:bg-orange-500 text-white rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-lg hover:shadow-xl"
              >
                {count} Questions
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
