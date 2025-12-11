"use client";

import { useState } from "react";

interface Motivator {
  emoji: string;
  quote: string;
  author: string | null;
  context: string | null;
}

export default function GameDayPage(): JSX.Element {
  // Array of emojis for the 4x10 grid (40 cells total)
  const emojis = [
    "🏒",
    "🥅",
    "⛸️",
    "🏆",
    "🥇",
    "🥈",
    "🥉",
    "🎯",
    "⚡",
    "🔥",
    "💪",
    "🏃",
    "🎉",
    "🎊",
    "👏",
    "🙌",
    "❤️",
    "💙",
    "🧡",
    "💚",
    "⭐",
    "🌟",
    "✨",
    "💫",
    "🚀",
    "🎪",
    "🎨",
    "🎭",
    "🏅",
    "🎖️",
    "🏵️",
    "🎗️",
    "🎁",
    "🎀",
    "🎈",
    "🎊",
    "🍀",
    "🌠",
    "🌈",
    "☀️",
  ];

  // Sample motivator data - can be replaced with API data later
  const motivators: Motivator[] = emojis.map((emoji, index) => ({
    emoji,
    quote: `Sample motivational quote ${index + 1}. This is a placeholder message that will inspire and motivate. Replace this with actual motivational content from your database.`,
    author:
      index % 3 === 0
        ? "Hockey Legend"
        : index % 3 === 1
          ? "Famous Coach"
          : null,
    context:
      index % 4 === 0
        ? "Pre-game motivation"
        : index % 4 === 1
          ? "Post-game encouragement"
          : index % 4 === 2
            ? "During tough times"
            : null,
  }));

  const [selectedMotivator, setSelectedMotivator] = useState<Motivator | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCellClick = (index: number): void => {
    setSelectedMotivator(motivators[index]);
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedMotivator(null);
  };

  const handleShare = (): void => {
    if (!selectedMotivator) return;

    const shareText = `${selectedMotivator.quote}${selectedMotivator.author ? ` - ${selectedMotivator.author}` : ""}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Shareable Motivator",
          text: shareText,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          alert("Motivator copied to clipboard!");
        })
        .catch((err) => {
          console.error("Error copying to clipboard:", err);
        });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🏒</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              Shareable Motivators
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            The game starts before the puck drops. Whether you need a pre-game
            boost or a post-game high five, we&apos;ve got the perfect message
            ready to text. Find the words, make them yours, and send the ❤️
            love.
          </p>
        </div>

        {/* 4x10 Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-4 gap-2">
            {emojis.map((emoji, index) => (
              <div
                key={index}
                onClick={() => handleCellClick(index)}
                className="w-[150px] h-[150px] bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center text-5xl hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-md transition-all cursor-pointer"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && selectedMotivator && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedMotivator.emoji}</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Shareable Motivator
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Close modal"
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
            <div className="p-6">
              {/* Quote */}
              <div className="mb-6">
                <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed italic">
                  &ldquo;{selectedMotivator.quote}&rdquo;
                </p>
              </div>

              {/* Author */}
              {selectedMotivator.author && (
                <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    &mdash; {selectedMotivator.author}
                  </p>
                </div>
              )}

              {/* Context */}
              {selectedMotivator.context && (
                <div className="mb-6">
                  <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm font-semibold px-3 py-1 rounded">
                    {selectedMotivator.context}
                  </span>
                </div>
              )}

              {/* Share Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleShare}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
